import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[admin-auth] ERRO FATAL: variável ADMIN_PASSWORD não definida em produção. Defina-a antes de iniciar o servidor.');
    process.exit(1);
  } else {
    console.warn('[admin-auth] AVISO: ADMIN_PASSWORD não definida. Usando senha padrão para desenvolvimento.');
  }
}
const PASSWORD = ADMIN_PASSWORD || 'acacio@admin';

const TOKEN_VALIDITY_MS = 24 * 60 * 60 * 1000; // 24 horas
const HMAC_ALG = 'sha256';
// sha256 hex digest is always 64 hex chars (32 bytes * 2)
const SIG_HEX_LEN = 64;

// Derive salt from the password so it is unique per deployment and not hardcoded
const PW_SALT = crypto.createHash('sha256').update('app-acacio-' + PASSWORD).digest();
const PW_KEYLEN = 32;

function hashPassword(pw) {
  return crypto.scryptSync(String(pw), PW_SALT, PW_KEYLEN);
}

// Pre-compute expected hash once at startup
const EXPECTED_HASH = hashPassword(PASSWORD);

// --- Simple in-memory rate limiter ---
function makeRateLimiter(maxRequests, windowMs, message) {
  const store = new Map(); // ip -> { count, resetAt }
  return function rateLimiter(req, res, next) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= maxRequests) {
      return res.status(429).json({ error: message });
    }
    entry.count += 1;
    next();
  };
}

export const loginRateLimit = makeRateLimiter(
  5, 15 * 60 * 1000, 'Muitas tentativas. Tente novamente em 15 minutos.'
);

export const writeRateLimit = makeRateLimiter(
  60, 60 * 1000, 'Muitas requisições. Tente novamente em breve.'
);

// --- HMAC token ---
function sign(expires) {
  return crypto
    .createHmac(HMAC_ALG, PASSWORD)
    .update(String(expires))
    .digest('hex');
}

export function generateToken() {
  const expires = Date.now() + TOKEN_VALIDITY_MS;
  return `${expires}.${sign(expires)}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;
  const expires = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (Date.now() > parseInt(expires, 10)) return false;
  if (signature.length !== SIG_HEX_LEN) return false;
  const expected = sign(expires);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

export function adminLoginHandler(req, res) {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: 'Senha obrigatória' });
  }

  const inputHash = hashPassword(password);
  const correct = crypto.timingSafeEqual(inputHash, EXPECTED_HASH);

  if (!correct) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  res.json({ token: generateToken() });
}

export function requireAdmin(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }
  next();
}
