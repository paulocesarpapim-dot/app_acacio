import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "@/lib/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, MessageCircle, Truck, Tag, Shield, CreditCard, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isKgProduct, formatQty, qtyStep, minQty } from "../utils/productUtils";

const PIX_DISCOUNT = 0.05; // 5% desconto no Pix
const FREE_SHIPPING_MIN = 300;

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, cartTotal } = useCart();
  const { user, isAuthenticated, register, login } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [observation, setObservation] = useState("");
  const [personType, setPersonType] = useState("fisica");
  const [authMode, setAuthMode] = useState("register"); // register | login
  const [authForm, setAuthForm] = useState({ name: "", email: "", phone: "", cpf: "", password: "", confirmPassword: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  // Cupom de desconto
  const COUPONS = {
    "BEMVINDO10": { discount: 0.10, label: "10% de desconto" },
    "FRETE0": { discount: 0, freeShipping: true, label: "Frete grátis" },
    "EMPORIO5": { discount: 0.05, label: "5% de desconto" },
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      setCouponError("");
    } else {
      setAppliedCoupon(null);
      setCouponError("Cupom inválido");
    }
  };

  const handleCalcShipping = () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    setShippingLoading(true);
    // Simulated shipping calc
    setTimeout(() => {
      if (cartTotal >= FREE_SHIPPING_MIN || appliedCoupon?.freeShipping) {
        setShipping({ value: 0, days: 3, label: "Frete Grátis" });
      } else {
        const val = cleanCep.startsWith("0") ? 15.90 : cleanCep.startsWith("1") ? 18.90 : 25.90;
        setShipping({ value: val, days: cleanCep.startsWith("0") || cleanCep.startsWith("1") ? 3 : 7, label: `Entrega em até ${cleanCep.startsWith("0") || cleanCep.startsWith("1") ? 3 : 7} dias úteis` });
      }
      setShippingLoading(false);
    }, 800);
  };

  // Cálculos
  const couponDiscount = appliedCoupon?.discount ? parseFloat((cartTotal * appliedCoupon.discount).toFixed(2)) : 0;
  const subtotalAfterCoupon = parseFloat((cartTotal - couponDiscount).toFixed(2));
  const shippingCost = shipping?.value || 0;
  const total = parseFloat((subtotalAfterCoupon + shippingCost).toFixed(2));
  const pixTotal = parseFloat((total * (1 - PIX_DISCOUNT)).toFixed(2));

  const buildWhatsAppMessage = () => {
    let msg = "🛒 *Meu Pedido - Empório Filho de Deus*\n\n";
    items.forEach((item) => {
      const isKg = isKgProduct(item.product);
      const qtyLabel = isKg ? formatQty(item.product, item.qty) : `${item.qty}x`;
      msg += `• ${qtyLabel} ${item.product.name} — ${formatPrice(parseFloat((item.product.price * item.qty).toFixed(2)))}\n`;
    });
    if (appliedCoupon) msg += `\n🏷️ Cupom: ${appliedCoupon.code} (${appliedCoupon.label})\n`;
    msg += `\n💳 Pagamento: Pix (5% desc.)`;
    msg += `\n💰 *Total: ${formatPrice(pixTotal)}*`;
    if (cep) msg += `\n📍 CEP: ${cep}`;
    if (observation.trim()) msg += `\n📝 Observação: ${observation.trim()}`;
    if (isAuthenticated && user) msg += `\n👤 Cliente: ${user.name} (${user.email})`;
    msg += "\n\nGostaria de confirmar este pedido!";
    return encodeURIComponent(msg);
  };

  const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.origin : 'http://localhost:3000';

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const discountMultiplier = 1 - PIX_DISCOUNT;
      const couponMultiplier = appliedCoupon?.discount ? (1 - appliedCoupon.discount) : 1;
      const finalAmount = parseFloat(((cartTotal * couponMultiplier * discountMultiplier) + shippingCost).toFixed(2));

      const payerData = isAuthenticated && user ? {
        name: user.name,
        email: user.email,
        phone: user.phone,
      } : undefined;

      const body = {
        amount: finalAmount,
        description: `Pedido ${items.length} itens - Empório Filho de Deus`,
        payer: payerData,
        items: items.map(({ product, qty }) => ({
          title: product.name,
          quantity: qty,
          unit_price: product.price,
        })),
        shipment_cost: shippingCost > 0 ? shippingCost : undefined,
      };

      const res = await fetch(`${API_URL}/api/pix/charge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Erro ao criar Pix');
        return;
      }

      const params = new URLSearchParams({
        txid: data.txid,
        amount: data.amount,
        exp: String(data.expiration || 3600),
      });
      if (data.qrcode) params.set('qr', data.qrcode);
      if (data.pixCopiaECola) params.set('code', data.pixCopiaECola);

      navigate(`/pix/pagamento?${params.toString()}`);
    } catch (err) {
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Carrinho Vazio</h1>
        <p className="text-muted-foreground mt-2">Adicione produtos para começar seu pedido</p>
        <Link to="/produtos">
          <Button className="mt-6 rounded-full px-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Ver Produtos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Seu Carrinho</h1>
          <p className="text-muted-foreground mt-1">{items.length} {items.length === 1 ? "item" : "itens"}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-1" /> Limpar
        </Button>
      </div>

      {/* Tabela de produtos */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-sm font-semibold text-muted-foreground border-b border-border">
          <div className="col-span-6">Produto</div>
          <div className="col-span-2 text-center">Quantidade</div>
          <div className="col-span-2 text-center">Preço</div>
          <div className="col-span-2 text-center">Excluir</div>
        </div>

        {/* Items */}
        {items.map(({ product, qty }) => {
          const isKg = isKgProduct(product);
          const step = qtyStep(product);
          const min = minQty(product);
          const itemTotal = parseFloat((product.price * qty).toFixed(2));
          return (
            <div key={product.id} className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 border-b border-border last:border-0 items-center">
              {/* Produto */}
              <div className="col-span-12 sm:col-span-6 flex gap-3 items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xl">📦</div>'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm leading-tight truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  {isKg && <p className="text-xs text-muted-foreground">{formatPrice(product.price)}/kg</p>}
                </div>
              </div>

              {/* Quantidade */}
              <div className="col-span-4 sm:col-span-2 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const newQty = parseFloat((qty - step).toFixed(2));
                      if (newQty < min) removeItem(product.id);
                      else updateQty(product.id, newQty);
                    }}
                    className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted text-foreground"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold min-w-[45px] text-center">
                    {isKg ? formatQty(product, qty) : qty}
                  </span>
                  <button
                    onClick={() => updateQty(product.id, parseFloat((qty + step).toFixed(2)))}
                    className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted text-foreground"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Preço */}
              <div className="col-span-4 sm:col-span-2 text-center">
                <span className="font-bold text-primary">{formatPrice(itemTotal)}</span>
              </div>

              {/* Excluir */}
              <div className="col-span-4 sm:col-span-2 text-center">
                <button onClick={() => removeItem(product.id)} className="text-destructive hover:text-destructive/80 transition-colors mx-auto">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Subtotal row */}
        <div className="px-6 py-3 bg-muted/30 text-right border-t border-border">
          <span className="text-muted-foreground">Subtotal: </span>
          <span className="font-bold text-lg">{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {/* ======= CHECKOUT 3-COLUMN LAYOUT (Petali Style) ======= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* ---- Column 1: Cadastro / Identifique-se ---- */}
        <div className="bg-card rounded-2xl border border-border p-5">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-bold text-sm text-green-700">Identificado como:</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
                {user?.phone && <p className="text-muted-foreground">{user.phone}</p>}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="font-bold text-sm">
                  {authMode === "register" ? "Novo cadastro" : "Identifique-se"}
                  {" ou "}
                  <button
                    type="button"
                    onClick={() => { setAuthMode(authMode === "register" ? "login" : "register"); setAuthError(""); }}
                    className="text-primary underline font-bold"
                  >
                    {authMode === "register" ? "identifique-se" : "cadastre-se"}
                  </button>
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">E-mail</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={authForm.email}
                    onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                    className="text-sm"
                  />
                </div>

                {authMode === "register" ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Criar senha</label>
                        <Input
                          type="password"
                          value={authForm.password}
                          onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Confirmar senha</label>
                        <Input
                          type="password"
                          value={authForm.confirmPassword}
                          onChange={e => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={personType === "fisica"}
                          onChange={() => setPersonType("fisica")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-primary font-medium">Pessoa Física</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={personType === "juridica"}
                          onChange={() => setPersonType("juridica")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-primary font-medium">Pessoa Jurídica</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Nome completo</label>
                      <Input
                        placeholder="Nome completo"
                        value={authForm.name}
                        onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{personType === "juridica" ? "CNPJ" : "CPF"}</label>
                      <Input
                        placeholder={personType === "juridica" ? "00.000.000/0000-00" : "000.000.000-00"}
                        value={authForm.cpf}
                        onChange={e => setAuthForm({ ...authForm, cpf: e.target.value })}
                        className="text-sm w-48"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Celular</label>
                        <Input
                          placeholder="(11) 99999-9999"
                          value={authForm.phone}
                          onChange={e => setAuthForm({ ...authForm, phone: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Telefone fixo</label>
                        <Input
                          placeholder="(11) 3333-3333"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Senha</label>
                    <Input
                      type="password"
                      value={authForm.password}
                      onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                )}

                {authError && <p className="text-xs text-destructive">{authError}</p>}

                <Button
                  size="sm"
                  disabled={authLoading}
                  className="w-full"
                  onClick={async () => {
                    setAuthError("");
                    setAuthLoading(true);
                    try {
                      if (authMode === "register") {
                        if (!authForm.name || !authForm.email || !authForm.phone || !authForm.password) {
                          setAuthError("Preencha todos os campos obrigatórios");
                          return;
                        }
                        if (authForm.password !== authForm.confirmPassword) {
                          setAuthError("As senhas não coincidem");
                          return;
                        }
                        const res = await register(authForm.name, authForm.email, authForm.phone, authForm.password);
                        if (res.error) setAuthError(res.error);
                      } else {
                        if (!authForm.email || !authForm.password) {
                          setAuthError("Preencha e-mail e senha");
                          return;
                        }
                        const res = await login(authForm.email, authForm.password);
                        if (res.error) setAuthError(res.error);
                      }
                    } finally {
                      setAuthLoading(false);
                    }
                  }}
                >
                  {authLoading ? "Aguarde..." : authMode === "register" ? "Cadastrar" : "Entrar"}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* ---- Column 2: Entrega + Mensagem ---- */}
        <div className="space-y-4">
          {/* Entrega */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">Entrega</span>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">CEP</label>
              <div className="flex gap-2">
                <Input
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="w-32 text-sm"
                  maxLength={9}
                />
                <Button size="sm" variant="outline" onClick={handleCalcShipping} disabled={shippingLoading || cep.replace(/\D/g, "").length !== 8}>
                  {shippingLoading ? "..." : "Calcular"}
                </Button>
              </div>
              {shipping && (
                <div className="mt-2 text-sm">
                  {shipping.value === 0 ? (
                    <span className="text-green-600 font-semibold">✅ Frete Grátis!</span>
                  ) : (
                    <span className="text-muted-foreground">{shipping.label} — <strong>{formatPrice(shipping.value)}</strong></span>
                  )}
                </div>
              )}
              {cartTotal < FREE_SHIPPING_MIN && (
                <p className="text-xs text-muted-foreground mt-2">
                  Frete grátis acima de {formatPrice(FREE_SHIPPING_MIN)}
                </p>
              )}
            </div>
          </div>

          {/* Cupom de desconto */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold text-sm">Cupom de desconto</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o cupom"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleApplyCoupon}>
                Aplicar
              </Button>
            </div>
            {appliedCoupon && (
              <div className="mt-2 text-sm text-green-600 font-semibold">
                ✅ {appliedCoupon.label} aplicado!
              </div>
            )}
            {couponError && (
              <div className="mt-2 text-sm text-destructive">{couponError}</div>
            )}
          </div>

          {/* Mensagem */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">Mensagem</span>
            </div>
            <textarea
              placeholder="Gostaria de enviar alguma observação?"
              value={observation}
              onChange={e => setObservation(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm resize-y"
            />
          </div>
        </div>

        {/* ---- Column 3: Pagamento ---- */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">Pagamento</span>
          </div>

          <div className="space-y-2 mb-5">
            {/* Pix C6 Bank */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-primary bg-primary/5 ring-1 ring-primary">
              <span className="text-xl">💠</span>
              <span className="font-semibold text-sm">Pix</span>
              <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Desconto de 5%</span>
            </div>
            <p className="text-xs text-muted-foreground px-1">Pagamento instantâneo via QR Code • Aprovação em segundos</p>
          </div>

          {/* Resumo de valores */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            {appliedCoupon?.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Cupom {appliedCoupon.code}</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frete</span>
              <span>{shipping ? (shipping.value === 0 ? <span className="text-green-600 font-semibold">Grátis</span> : formatPrice(shipping.value)) : <span className="text-muted-foreground text-xs">(defina acima)</span>}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Desconto Pix (5%)</span>
              <span>-{formatPrice(total * PIX_DISCOUNT)}</span>
            </div>
          </div>

          <div className="border-t border-border pt-3 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(pixTotal)}
              </span>
            </div>
          </div>

          {/* Botão FINALIZAR — Pix C6 */}
          <Button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full rounded-xl h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
          >
            {checkoutLoading ? "Processando..." : "✔ FINALIZAR COMPRA"}
          </Button>

          {/* Alternativa: WhatsApp */}
          <a
            href={`https://wa.me/5511957800711?text=${buildWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2"
          >
            <Button variant="outline" className="w-full rounded-xl h-10 text-sm">
              💬 Ou finalize pelo WhatsApp
            </Button>
          </a>

          {/* Compra Segura */}
          <div className="flex items-center justify-center gap-2 mt-4 p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
            <Shield className="w-5 h-5 text-green-600" />
            <div className="text-center">
              <p className="text-xs font-bold text-green-700 dark:text-green-400">COMPRA SEGURA</p>
              <p className="text-[10px] text-green-600 dark:text-green-500">SITE PROTEGIDO • CERTIFICADO SSL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continuar comprando */}
      <div className="text-center">
        <Link to="/produtos">
          <Button variant="outline" className="rounded-xl h-12 px-8">
            ← CONTINUAR COMPRANDO
          </Button>
        </Link>
      </div>
    </div>
  );
}