import { readDB, saveDB } from './db-json.js';
import crypto from 'crypto';
import { hashPassword, verifyPassword, createAdminToken } from './middleware.js';

// ============ CUSTOMERS ============

export async function getCustomers(req, res) {
  try {
    const db = await readDB();
    const customers = (db.customers || []).map(c => {
      const { password, ...safe } = c;
      return safe;
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
}

export async function registerCustomer(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
    }
    const db = await readDB();
    if (!db.customers) db.customers = [];
    if (db.customers.find(c => c.email === email.toLowerCase())) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado' });
    }
    const newCustomer = {
      id: Date.now(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password: await hashPassword(password),
      createdAt: new Date().toISOString(),
      loyalty: { points: 0, totalSpent: 0, level: 'bronze', history: [] },
    };
    db.customers.push(newCustomer);
    saveDB(db);
    const { password: _, ...safe } = newCustomer;
    res.status(201).json(safe);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar cliente' });
  }
}

export async function loginCustomer(req, res) {
  try {
    const { email, password } = req.body;
    const db = await readDB();
    const customer = (db.customers || []).find(c => c.email === email.toLowerCase());
    if (!customer) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }

    // Support both hashed and legacy plain-text passwords
    let valid = false;
    if (customer.password.includes(':')) {
      valid = await verifyPassword(password, customer.password);
    } else {
      valid = customer.password === password;
      // Migrate to hashed password on successful login
      if (valid) {
        const idx = db.customers.findIndex(c => c.id === customer.id);
        db.customers[idx].password = await hashPassword(password);
        saveDB(db);
      }
    }

    if (!valid) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }
    const { password: _, ...safe } = customer;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

export async function updateCustomerLoyalty(req, res) {
  try {
    const { id } = req.params;
    const { purchaseAmount, redeemPoints } = req.body;
    const db = await readDB();
    if (!db.customers) db.customers = [];
    const idx = db.customers.findIndex(c => c.id === parseInt(id));
    if (idx < 0) return res.status(404).json({ error: 'Cliente não encontrado' });

    const customer = db.customers[idx];
    if (!customer.loyalty) {
      customer.loyalty = { points: 0, totalSpent: 0, level: 'bronze', history: [] };
    }

    if (purchaseAmount) {
      const pts = Math.floor(purchaseAmount);
      customer.loyalty.points += pts;
      customer.loyalty.totalSpent += purchaseAmount;
      customer.loyalty.history.push({ date: new Date().toISOString(), amount: purchaseAmount, points: pts });
    }

    if (redeemPoints && customer.loyalty.points >= redeemPoints) {
      customer.loyalty.points -= redeemPoints;
      customer.loyalty.history.push({ date: new Date().toISOString(), amount: 0, points: -redeemPoints, type: 'resgate' });
    }

    const spent = customer.loyalty.totalSpent;
    if (spent >= 2000) customer.loyalty.level = 'gold';
    else if (spent >= 500) customer.loyalty.level = 'silver';
    else customer.loyalty.level = 'bronze';

    db.customers[idx] = customer;
    saveDB(db);
    const { password: _, ...safe } = customer;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fidelidade' });
  }
}

export async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    const db = await readDB();
    if (!db.customers) return res.status(404).json({ error: 'Cliente não encontrado' });
    const idx = db.customers.findIndex(c => c.id === parseInt(id));
    if (idx < 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    db.customers.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
}

// ============ PAYMENTS (Mercado Pago Checkout Pro) ============

export async function createPaymentPreference(req, res) {
  try {
    const db = await readDB();
    const accessToken = process.env.MP_ACCESS_TOKEN || db.settings?.mpAccessToken;
    if (!accessToken) {
      return res.status(500).json({ error: 'Mercado Pago não configurado. Defina MP_ACCESS_TOKEN.' });
    }

    const { items, payer, shipment_cost, external_reference } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Nenhum item no pedido' });
    }

    // Build base URL for redirects
    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://emporiofilhodedeus.com.br';

    const preferenceData = {
      items: items.map(item => ({
        title: item.title,
        description: item.description || '',
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        currency_id: 'BRL',
      })),
      payer: payer ? {
        name: payer.name || '',
        email: payer.email || '',
        phone: payer.phone ? { number: payer.phone } : undefined,
      } : undefined,
      back_urls: {
        success: `${origin}/checkout/status?status=approved`,
        failure: `${origin}/checkout/status?status=rejected`,
        pending: `${origin}/checkout/status?status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${origin}/api/payments/notification`,
      external_reference: external_reference || `order_${Date.now()}`,
      statement_descriptor: 'EMPORIO FILHO DEUS',
    };

    // Add shipping cost as an extra item if provided
    if (shipment_cost && shipment_cost > 0) {
      preferenceData.items.push({
        title: 'Frete',
        quantity: 1,
        unit_price: Number(shipment_cost),
        currency_id: 'BRL',
      });
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('MP Error:', JSON.stringify(mpData));
      return res.status(mpResponse.status).json({ error: 'Erro ao criar pagamento', details: mpData.message });
    }

    // Save order to database
    if (!db.orders) db.orders = [];
    db.orders.push({
      id: mpData.id,
      external_reference: preferenceData.external_reference,
      items: req.body.items,
      payer: payer || null,
      total: items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0) + (shipment_cost || 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    saveDB(db);

    res.json({
      id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Erro interno ao processar pagamento' });
  }
}

export async function getOrders(req, res) {
  try {
    const db = await readDB();
    res.json(db.orders || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status deve ser: approved, pending ou rejected' });
    }
    const db = await readDB();
    if (!db.orders) return res.status(404).json({ error: 'Pedido não encontrado' });
    const idx = db.orders.findIndex(o => o.id === id);
    if (idx < 0) return res.status(404).json({ error: 'Pedido não encontrado' });
    db.orders[idx].status = status;
    if (status === 'approved') {
      db.orders[idx].paidAt = new Date().toISOString();
      db.orders[idx].confirmedBy = 'admin';
    }
    saveDB(db);
    res.json(db.orders[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
}

// ============ PIX C6 BANK (BACEN Standard) ============

// Cache token in memory (survives within same Vercel instance)
let pixTokenCache = { token: null, expiresAt: 0 };

async function getPixToken(dbSettings) {
  const now = Date.now();
  if (pixTokenCache.token && pixTokenCache.expiresAt > now) {
    return pixTokenCache.token;
  }

  const clientId = process.env.C6_CLIENT_ID || dbSettings?.c6ClientId;
  const clientSecret = process.env.C6_CLIENT_SECRET || dbSettings?.c6ClientSecret;
  const apiUrl = process.env.C6_API_URL || dbSettings?.c6ApiUrl || 'https://openfinance.c6bank.com.br';

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${apiUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=cob.write cob.read pix.read webhook.write webhook.read',
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error('C6 OAuth Error:', errBody);
    throw new Error('Falha ao autenticar com C6 Bank');
  }

  const data = await res.json();
  pixTokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

function generateTxid() {
  return crypto.randomBytes(16).toString('hex');
}

// ——— Static Pix EMV/BRCode Generator (works without C6 API) ———
function emvField(id, value) {
  const len = String(value).length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function generatePixPayload({ pixKey, merchantName, merchantCity, amount, txid, description }) {
  // Remove accents for BRCode compatibility
  const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 25);

  let payload = '';
  payload += emvField('00', '01'); // Payload Format Indicator
  payload += emvField('26',       // Merchant Account Information
    emvField('00', 'br.gov.bcb.pix') +
    emvField('01', pixKey) +
    (description ? emvField('02', normalize(description).substring(0, 72)) : '')
  );
  payload += emvField('52', '0000'); // Merchant Category Code
  payload += emvField('53', '986');  // Transaction Currency (BRL)

  if (amount && amount > 0) {
    payload += emvField('54', amount.toFixed(2));
  }

  payload += emvField('58', 'BR'); // Country Code
  payload += emvField('59', normalize(merchantName)); // Merchant Name
  payload += emvField('60', normalize(merchantCity));  // Merchant City
  payload += emvField('62', emvField('05', txid || '***')); // Additional Data (txid)

  // CRC16 placeholder, then calculate
  payload += '6304';
  const checksum = crc16(payload);
  payload += checksum;

  return payload;
}

// Create Pix charge (cobrança imediata)
export async function createPixCharge(req, res) {
  try {
    const { amount, description, payer, items, shipment_cost } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    const txid = generateTxid();

    // Load settings from DB for Pix key / merchant info
    const db = await readDB();
    const settings = db.settings || {};
    const clientId = process.env.C6_CLIENT_ID || settings.c6ClientId;
    const pixKey = settings.pixKey || process.env.C6_PIX_KEY || '64330427000130';
    const merchantName = settings.pixName || 'EMPORIO FILHO DE DEUS';
    const merchantCity = settings.pixCity || 'SAO PAULO';

    let pixCopiaECola = '';
    let qrcodeImage = null;

    if (clientId) {
      // ——— C6 Bank API (cobrança dinâmica) ———
      const apiUrl = process.env.C6_API_URL || settings.c6ApiUrl || 'https://openfinance.c6bank.com.br';
      const token = await getPixToken(settings);

      const cobPayload = {
        calendario: { expiracao: 3600 },
        devedor: payer ? {
          nome: payer.name || 'Cliente',
          cpf: payer.cpf?.replace(/\D/g, '') || undefined,
          cnpj: payer.cnpj?.replace(/\D/g, '') || undefined,
        } : undefined,
        valor: { original: amount.toFixed(2) },
        chave: pixKey,
        solicitacaoPagador: description || 'Pedido Empório Filho de Deus',
        infoAdicionais: [{ nome: 'Loja', valor: 'Empório Filho de Deus' }],
      };

      if (cobPayload.devedor) {
        if (!cobPayload.devedor.cpf) delete cobPayload.devedor.cpf;
        if (!cobPayload.devedor.cnpj) delete cobPayload.devedor.cnpj;
      }

      const cobResponse = await fetch(`${apiUrl}/api/v2/cob/${txid}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(cobPayload),
      });

      const cobData = await cobResponse.json();
      if (!cobResponse.ok) {
        console.error('C6 Cob Error:', JSON.stringify(cobData));
        return res.status(cobResponse.status).json({ error: 'Erro ao criar cobrança Pix', details: cobData.detail || cobData.message });
      }

      const qrResponse = await fetch(`${apiUrl}/api/v2/cob/${txid}/qrcode`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        pixCopiaECola = qrData.qrcode || cobData.pixCopiaECola || '';
        qrcodeImage = qrData.imagemQrcode || null;
      }
    } else {
      // ——— Pix Estático (BRCode EMV — funciona sem API) ———
      pixCopiaECola = generatePixPayload({
        pixKey,
        merchantName,
        merchantCity,
        amount,
        txid: txid.substring(0, 25),
        description: description ? description.substring(0, 40) : '',
      });
      // QR Code via free API
      qrcodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCopiaECola)}`;
    }

    // Save order
    if (!db.orders) db.orders = [];
    db.orders.push({
      id: txid,
      type: clientId ? 'pix_c6' : 'pix_static',
      external_reference: txid,
      items: items || [],
      payer: payer || null,
      total: amount,
      status: 'pending',
      pixCopiaECola,
      createdAt: new Date().toISOString(),
    });
    saveDB(db);

    res.json({
      txid,
      status: 'ATIVA',
      qrcode: qrcodeImage,
      pixCopiaECola,
      expiration: 3600,
      amount: amount.toFixed(2),
    });
  } catch (error) {
    console.error('Pix Error:', error);
    res.status(500).json({ error: error.message || 'Erro interno ao criar Pix' });
  }
}

// Check Pix charge status
export async function checkPixStatus(req, res) {
  try {
    const { txid } = req.params;
    const apiUrl = process.env.C6_API_URL || 'https://openfinance.c6bank.com.br';
    const clientId = process.env.C6_CLIENT_ID;

    const db = await readDB();
    const dbSettings = db.settings || {};

    if (!clientId) {
      const order = (db.orders || []).find(o => o.id === txid);
      return res.json({ txid, status: order?.status || 'pending' });
    }

    const token = await getPixToken(dbSettings);
    const cobResponse = await fetch(`${apiUrl}/api/v2/cob/${txid}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!cobResponse.ok) {
      return res.status(cobResponse.status).json({ error: 'Erro ao consultar status' });
    }

    const cobData = await cobResponse.json();
    const isPaid = cobData.status === 'CONCLUIDA';
    const mappedStatus = isPaid ? 'approved' : cobData.status === 'ATIVA' ? 'pending' : 'rejected';

    // Update local DB
    const orderIdx = (db.orders || []).findIndex(o => o.id === txid);
    if (orderIdx >= 0 && db.orders[orderIdx].status !== mappedStatus) {
      db.orders[orderIdx].status = mappedStatus;
      if (isPaid) {
        db.orders[orderIdx].paidAt = new Date().toISOString();
        db.orders[orderIdx].pixEndToEndId = cobData.pix?.[0]?.endToEndId || '';
      }
      saveDB(db);
    }

    res.json({
      txid,
      status: mappedStatus,
      bacenStatus: cobData.status,
      paidAt: isPaid ? cobData.pix?.[0]?.horario : null,
      endToEndId: isPaid ? cobData.pix?.[0]?.endToEndId : null,
    });
  } catch (error) {
    console.error('Pix status error:', error);
    res.status(500).json({ error: 'Erro ao consultar Pix' });
  }
}

// Webhook — C6 Bank POST when Pix confirmed
export async function pixWebhook(req, res) {
  try {
    // Verify webhook secret (optional extra security layer)
    const db = await readDB();
    const webhookSecret = (db.settings || {}).pixWebhookSecret || process.env.PIX_WEBHOOK_SECRET;
    if (webhookSecret) {
      const provided = req.headers['x-webhook-secret'] || req.query.secret;
      if (provided !== webhookSecret) {
        console.warn('Pix webhook: secret inválido');
        return res.status(200).json({ status: 'ok' }); // 200 to avoid retries
      }
    }

    const { pix } = req.body;

    if (!pix || !Array.isArray(pix)) {
      return res.status(200).json({ status: 'ok' });
    }

    if (!db.orders) db.orders = [];

    for (const payment of pix) {
      const { txid, valor, horario, endToEndId } = payment;
      if (!txid) continue;
      const orderIdx = db.orders.findIndex(o => o.id === txid);

      if (orderIdx >= 0) {
        db.orders[orderIdx].status = 'approved';
        db.orders[orderIdx].paidAt = horario || new Date().toISOString();
        db.orders[orderIdx].pixEndToEndId = endToEndId || '';
        db.orders[orderIdx].pixAmount = valor;
        console.log(`✅ Pix confirmado: ${txid} — R$ ${valor}`);
      } else {
        db.orders.push({
          id: txid,
          type: 'pix_c6_webhook',
          external_reference: txid,
          items: [],
          payer: { info: payment.infoPagador || '' },
          total: parseFloat(valor) || 0,
          status: 'approved',
          paidAt: horario || new Date().toISOString(),
          pixEndToEndId: endToEndId || '',
          createdAt: new Date().toISOString(),
        });
      }
    }

    saveDB(db);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).json({ status: 'ok' });
  }
}

// ============ MERCADO PAGO IPN NOTIFICATION ============

export async function handleMPNotification(req, res) {
  try {
    const { type, data } = req.body;

    // MP sends 'payment' type for payment notifications
    if (type !== 'payment' || !data?.id) {
      return res.status(200).json({ status: 'ok' });
    }

    const db = await readDB();
    const accessToken = process.env.MP_ACCESS_TOKEN || (db.settings || {}).mpAccessToken;
    if (!accessToken) {
      console.warn('MP notification recebida mas MP_ACCESS_TOKEN não configurado');
      return res.status(200).json({ status: 'ok' });
    }

    // Fetch payment details from Mercado Pago API
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!mpRes.ok) {
      console.error('MP notification: erro ao consultar pagamento', mpRes.status);
      return res.status(200).json({ status: 'ok' });
    }

    const payment = await mpRes.json();
    const externalRef = payment.external_reference;
    const mpStatus = payment.status; // approved, rejected, pending, in_process

    // Map MP status to our status
    const statusMap = {
      approved: 'approved',
      authorized: 'approved',
      pending: 'pending',
      in_process: 'pending',
      rejected: 'rejected',
      cancelled: 'rejected',
      refunded: 'refunded',
      charged_back: 'refunded',
    };
    const mappedStatus = statusMap[mpStatus] || 'pending';

    if (!db.orders) db.orders = [];
    const orderIdx = db.orders.findIndex(o =>
      o.id === externalRef || o.external_reference === externalRef
    );

    if (orderIdx >= 0) {
      db.orders[orderIdx].status = mappedStatus;
      db.orders[orderIdx].mpPaymentId = data.id;
      if (mappedStatus === 'approved') {
        db.orders[orderIdx].paidAt = payment.date_approved || new Date().toISOString();
      }
      console.log(`✅ MP pagamento ${data.id}: ${mpStatus} → pedido ${externalRef}`);
    } else {
      // Payment without matching order — store it
      db.orders.push({
        id: externalRef || `mp_${data.id}`,
        type: 'mercadopago',
        external_reference: externalRef,
        mpPaymentId: data.id,
        items: [],
        payer: payment.payer ? { name: payment.payer.first_name, email: payment.payer.email } : null,
        total: payment.transaction_amount || 0,
        status: mappedStatus,
        paidAt: mappedStatus === 'approved' ? (payment.date_approved || new Date().toISOString()) : null,
        createdAt: new Date().toISOString(),
      });
      console.log(`✅ MP pagamento ${data.id}: novo pedido criado (${mappedStatus})`);
    }

    saveDB(db);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('MP notification error:', error);
    res.status(200).json({ status: 'ok' });
  }
}

// Register webhook with C6
export async function registerPixWebhook(req, res) {
  try {
    const pixKey = process.env.C6_PIX_KEY || '64330427000130';
    const db = await readDB();
    const dbSettings = db.settings || {};
    const apiUrl = process.env.C6_API_URL || dbSettings.c6ApiUrl || 'https://openfinance.c6bank.com.br';
    const clientId = process.env.C6_CLIENT_ID || dbSettings.c6ClientId;

    if (!clientId) return res.status(500).json({ error: 'API C6 não configurada' });

    const { webhookUrl } = req.body;
    if (!webhookUrl) return res.status(400).json({ error: 'webhookUrl é obrigatório' });

    const token = await getPixToken(dbSettings);

    const wRes = await fetch(`${apiUrl}/api/v2/webhook/${pixKey}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ webhookUrl }),
    });

    if (!wRes.ok) {
      const errData = await wRes.json();
      return res.status(wRes.status).json({ error: 'Erro ao registrar webhook', details: errData });
    }

    res.json({ success: true, message: `Webhook registrado para chave ${pixKey}` });
  } catch (error) {
    console.error('Register webhook error:', error);
    res.status(500).json({ error: error.message });
  }
}

// ============ SETTINGS ============

// ============ PROMOTIONS ============

export async function getPromotions(req, res) {
  try {
    const db = await readDB();
    const now = new Date().toISOString();
    const promotions = (db.promotions || []).map(p => ({
      ...p,
      active: p.active && (!p.endDate || p.endDate >= now),
    }));
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar promoções' });
  }
}

export async function getActivePromotions(req, res) {
  try {
    const db = await readDB();
    const now = new Date().toISOString();
    const promotions = (db.promotions || []).filter(p =>
      p.active && (!p.startDate || p.startDate <= now) && (!p.endDate || p.endDate >= now)
    );
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar promoções ativas' });
  }
}

export async function createPromotion(req, res) {
  try {
    const { title, description, type, discountPercent, discountValue, productIds, bannerText, bannerColor, startDate, endDate, active } = req.body;
    if (!title) return res.status(400).json({ error: 'Título é obrigatório' });
    if (!type || !['percentage', 'fixed', 'banner'].includes(type)) {
      return res.status(400).json({ error: 'Tipo deve ser: percentage, fixed ou banner' });
    }

    const db = await readDB();
    if (!db.promotions) db.promotions = [];
    const newId = db.promotions.length > 0 ? Math.max(...db.promotions.map(p => p.id || 0)) + 1 : 1;

    const promo = {
      id: newId,
      title: title.trim(),
      description: (description || '').trim(),
      type,
      discountPercent: type === 'percentage' ? Math.min(Math.max(Number(discountPercent) || 0, 0), 100) : 0,
      discountValue: type === 'fixed' ? Math.max(Number(discountValue) || 0, 0) : 0,
      productIds: Array.isArray(productIds) ? productIds.map(Number) : [],
      bannerText: (bannerText || '').trim(),
      bannerColor: bannerColor || 'from-orange-500 to-red-500',
      startDate: startDate || null,
      endDate: endDate || null,
      active: active !== false,
      createdAt: new Date().toISOString(),
    };

    db.promotions.push(promo);
    saveDB(db);
    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar promoção' });
  }
}

export async function updatePromotion(req, res) {
  try {
    const { id } = req.params;
    const db = await readDB();
    if (!db.promotions) db.promotions = [];
    const idx = db.promotions.findIndex(p => p.id === parseInt(id));
    if (idx < 0) return res.status(404).json({ error: 'Promoção não encontrada' });

    const { title, description, type, discountPercent, discountValue, productIds, bannerText, bannerColor, startDate, endDate, active } = req.body;

    if (type && !['percentage', 'fixed', 'banner'].includes(type)) {
      return res.status(400).json({ error: 'Tipo deve ser: percentage, fixed ou banner' });
    }

    const promo = db.promotions[idx];
    db.promotions[idx] = {
      ...promo,
      title: title !== undefined ? title.trim() : promo.title,
      description: description !== undefined ? description.trim() : promo.description,
      type: type || promo.type,
      discountPercent: type === 'percentage' || (!type && promo.type === 'percentage')
        ? Math.min(Math.max(Number(discountPercent ?? promo.discountPercent) || 0, 0), 100)
        : promo.discountPercent,
      discountValue: type === 'fixed' || (!type && promo.type === 'fixed')
        ? Math.max(Number(discountValue ?? promo.discountValue) || 0, 0)
        : promo.discountValue,
      productIds: productIds !== undefined ? (Array.isArray(productIds) ? productIds.map(Number) : []) : promo.productIds,
      bannerText: bannerText !== undefined ? bannerText.trim() : promo.bannerText,
      bannerColor: bannerColor || promo.bannerColor,
      startDate: startDate !== undefined ? startDate : promo.startDate,
      endDate: endDate !== undefined ? endDate : promo.endDate,
      active: active !== undefined ? active : promo.active,
      updatedAt: new Date().toISOString(),
    };

    saveDB(db);
    res.json(db.promotions[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar promoção' });
  }
}

export async function deletePromotion(req, res) {
  try {
    const { id } = req.params;
    const db = await readDB();
    if (!db.promotions) return res.status(404).json({ error: 'Promoção não encontrada' });
    const idx = db.promotions.findIndex(p => p.id === parseInt(id));
    if (idx < 0) return res.status(404).json({ error: 'Promoção não encontrada' });
    db.promotions.splice(idx, 1);
    saveDB(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar promoção' });
  }
}

export async function getCategories(req, res) {
  try {
    const db = await readDB();
    const categories = db.settings?.categories || [
      { name: 'Feijão', emoji: '🫘', description: 'Feijão carioca, preto, fradinho, verde e mais', color: 'from-amber-700 to-amber-800' },
      { name: 'Cereais', emoji: '🌾', description: 'Arroz, milho, canjica, farinha e grãos', color: 'from-yellow-600 to-yellow-700' },
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
}

export async function updateCategories(req, res) {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'Formato inválido. Envie { categories: [...] }' });
    }
    for (const cat of categories) {
      if (!cat.name || typeof cat.name !== 'string') {
        return res.status(400).json({ error: 'Cada categoria precisa ter um nome' });
      }
    }
    const db = await readDB();
    if (!db.settings) db.settings = {};
    db.settings.categories = categories.map(cat => ({
      name: cat.name.trim(),
      emoji: cat.emoji || '📦',
      description: cat.description || '',
      color: cat.color || 'from-gray-600 to-gray-700',
    }));
    saveDB(db);
    res.json(db.settings.categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar categorias' });
  }
}

export async function getSettings(req, res) {
  try {
    const db = await readDB();
    res.json(db.settings || {
      pixKey: '64330427000130',
      pixKeyType: 'cnpj',
      pixName: 'EMPORIO FILHO DE DEUS',
      pixCity: 'SAO PAULO',
      pixBank: 'C6 Bank',
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
}

export async function updateSettings(req, res) {
  try {
    const { pixKey, pixKeyType, pixName, pixCity, pixBank, mpAccessToken, c6ClientId, c6ClientSecret, c6ApiUrl,
            pagbemClientId, pagbemClientSecret, pagbemApiUrl, pagbemPixKey, pagbemWebhookSecret } = req.body;
    const db = await readDB();
    db.settings = {
      ...(db.settings || {}),
      pixKey: pixKey !== undefined ? pixKey : (db.settings?.pixKey || ''),
      pixKeyType: pixKeyType !== undefined ? pixKeyType : (db.settings?.pixKeyType || 'cnpj'),
      pixName: pixName !== undefined ? pixName : (db.settings?.pixName || ''),
      pixCity: pixCity !== undefined ? pixCity : (db.settings?.pixCity || ''),
      pixBank: pixBank !== undefined ? pixBank : (db.settings?.pixBank || ''),
      mpAccessToken: mpAccessToken !== undefined ? mpAccessToken : (db.settings?.mpAccessToken || ''),
      c6ClientId: c6ClientId !== undefined ? c6ClientId : (db.settings?.c6ClientId || ''),
      c6ClientSecret: c6ClientSecret !== undefined ? c6ClientSecret : (db.settings?.c6ClientSecret || ''),
      c6ApiUrl: c6ApiUrl !== undefined ? c6ApiUrl : (db.settings?.c6ApiUrl || ''),
      pagbemClientId: pagbemClientId !== undefined ? pagbemClientId : (db.settings?.pagbemClientId || ''),
      pagbemClientSecret: pagbemClientSecret !== undefined ? pagbemClientSecret : (db.settings?.pagbemClientSecret || ''),
      pagbemApiUrl: pagbemApiUrl !== undefined ? pagbemApiUrl : (db.settings?.pagbemApiUrl || ''),
      pagbemPixKey: pagbemPixKey !== undefined ? pagbemPixKey : (db.settings?.pagbemPixKey || ''),
      pagbemWebhookSecret: pagbemWebhookSecret !== undefined ? pagbemWebhookSecret : (db.settings?.pagbemWebhookSecret || ''),
      updatedAt: new Date().toISOString(),
    };
    saveDB(db);
    // Return settings without secrets in full
    const safe = { ...db.settings };
    if (safe.mpAccessToken) safe.mpAccessToken = safe.mpAccessToken.substring(0, 8) + '••••••••';
    if (safe.c6ClientSecret) safe.c6ClientSecret = safe.c6ClientSecret.substring(0, 4) + '••••••••';
    if (safe.pagbemClientSecret) safe.pagbemClientSecret = safe.pagbemClientSecret.substring(0, 4) + '••••••••';
    if (safe.pagbemWebhookSecret) safe.pagbemWebhookSecret = safe.pagbemWebhookSecret.substring(0, 4) + '••••••••';
    res.json(db.settings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar configurações' });
  }
}

// ============ PRODUCTS ============

export async function getProducts(req, res) {
  try {
    const db = await readDB();
    res.json(db.products || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

export async function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;
    const db = await readDB();
    const products = (db.products || []).filter(p => p.category === category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const db = await readDB();
    const product = (db.products || []).find(p => p.id === parseInt(id));
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description, category, price, image_url } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Nome, categoria e preço são obrigatórios' });
    }

    const db = await readDB();
    if (!db.products) db.products = [];
    const newId = db.products.length > 0 ? Math.max(...db.products.map(p => Number(p.id) || 0)) + 1 : 1;
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: 'Preço inválido' });
    }
    
    const newProduct = {
      id: newId,
      name,
      description: description || '',
      category,
      price: parsedPrice,
      image_url: image_url || 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(name),
      created_at: new Date().toISOString()
    };

    db.products.push(newProduct);
    saveDB(db);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category, price, image_url } = req.body;

    const db = await readDB();
    if (!db.products) db.products = [];
    const productIndex = db.products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ error: 'Preço inválido' });
      }
    }

    db.products[productIndex] = {
      ...db.products[productIndex],
      name: name || db.products[productIndex].name,
      description: description !== undefined ? description : db.products[productIndex].description,
      category: category || db.products[productIndex].category,
      price: price !== undefined ? parseFloat(price) : db.products[productIndex].price,
      image_url: image_url || db.products[productIndex].image_url
    };

    saveDB(db);
    res.json(db.products[productIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const db = await readDB();
    if (!db.products) return res.status(404).json({ error: 'Produto não encontrado' });
    const productIndex = db.products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    db.products.splice(productIndex, 1);
    saveDB(db);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
}

// ============ ADMIN AUTH ============

export async function loginAdmin(req, res) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    const db = await readDB();
    const adminPassword = db.settings?.adminPassword || (process.env.ADMIN_PASSWORD || '').trim();

    if (!adminPassword) {
      return res.status(500).json({ error: 'Senha de admin não configurada. Defina ADMIN_PASSWORD nas variáveis de ambiente.' });
    }

    let valid = false;
    if (adminPassword.includes(':')) {
      valid = await verifyPassword(password, adminPassword);
    } else {
      valid = password === adminPassword;
      // Migrate to hashed on first successful login
      if (valid) {
        if (!db.settings) db.settings = {};
        db.settings.adminPassword = await hashPassword(password);
        saveDB(db);
      }
    }

    if (!valid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = createAdminToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
}
