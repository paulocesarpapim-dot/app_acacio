import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Copy, Clock, QrCode, AlertCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../hooks/useCart";

export default function PixPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const txid = searchParams.get("txid");
  const qrcode = searchParams.get("qr"); // base64 image
  const pixCode = searchParams.get("code"); // copia e cola
  const amount = searchParams.get("amount");
  const expSecs = parseInt(searchParams.get("exp") || "3600");

  const [status, setStatus] = useState("pending");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expSecs);
  const pollingRef = useRef(null);
  const cleared = useRef(false);

  const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? window.location.origin : 'http://localhost:3000';

  const checkStatus = useCallback(async () => {
    if (!txid || status === 'approved') return;
    try {
      const res = await fetch(`${API_URL}/api/pix/status/${txid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'approved') {
          setStatus('approved');
          if (!cleared.current) {
            cleared.current = true;
            clearCart();
          }
        } else if (data.status === 'rejected') {
          setStatus('rejected');
        }
      }
    } catch { /* ignore */ }
  }, [txid, status, API_URL, clearCart]);

  // Poll every 3 seconds
  useEffect(() => {
    if (!txid || status !== 'pending') return;
    checkStatus();
    pollingRef.current = setInterval(checkStatus, 3000);
    return () => clearInterval(pollingRef.current);
  }, [txid, status, checkStatus]);

  // Countdown timer
  useEffect(() => {
    if (status !== 'pending' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = async () => {
    if (pixCode) {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatPrice = (v) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  if (!txid) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
        <h1 className="text-xl font-bold mb-2">Erro no pagamento</h1>
        <p className="text-muted-foreground mb-6">Nenhuma cobrança Pix encontrada.</p>
        <Link to="/carrinho"><Button>Voltar ao Carrinho</Button></Link>
      </div>
    );
  }

  // APPROVED
  if (status === 'approved') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-8 mb-6">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-background flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">Pagamento Confirmado!</h1>
          <p className="text-green-700 dark:text-green-400 text-lg mb-1">{formatPrice(parseFloat(amount || 0))}</p>
          <p className="text-sm text-green-600 dark:text-green-500">Pix recebido com sucesso.</p>
          <p className="text-xs text-muted-foreground mt-2">Pedido: {txid}</p>
        </div>
        <div className="space-y-3">
          <Link to="/produtos">
            <Button className="w-full rounded-xl h-12 font-bold">Continuar Comprando</Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="w-full">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  // EXPIRED / REJECTED
  if (status === 'expired' || status === 'rejected') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-8 mb-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h1 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            {status === 'expired' ? 'Pix Expirado' : 'Pagamento Recusado'}
          </h1>
          <p className="text-sm text-red-600 dark:text-red-400">
            {status === 'expired' ? 'O tempo para pagamento expirou.' : 'O pagamento não foi processado.'}
          </p>
        </div>
        <Link to="/carrinho">
          <Button className="w-full rounded-xl h-12 font-bold">Tentar Novamente</Button>
        </Link>
      </div>
    );
  }

  // PENDING — show QR Code
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Link to="/carrinho" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar ao carrinho
      </Link>

      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Pague com Pix</h1>
        </div>
        <p className="text-2xl font-bold text-primary mb-4">{formatPrice(parseFloat(amount || 0))}</p>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 mb-4 text-sm">
          <Clock className="w-4 h-4 text-yellow-600" />
          <span className="text-muted-foreground">Expira em:</span>
          <span className={`font-bold font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-foreground'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* QR Code */}
        {qrcode ? (
          <div className="bg-white rounded-xl p-4 inline-block mb-4 border border-border">
            <img
              src={qrcode.startsWith('http') ? qrcode : `data:image/png;base64,${qrcode}`}
              alt="QR Code Pix"
              className="w-56 h-56 mx-auto"
            />
          </div>
        ) : (
          <div className="bg-muted rounded-xl p-8 mb-4">
            <QrCode className="w-24 h-24 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-2">QR Code indisponível</p>
          </div>
        )}

        {/* Pix Copia e Cola */}
        {pixCode && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Pix Copia e Cola:</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={pixCode}
                className="flex-1 px-3 py-2 text-xs border border-input rounded-lg bg-muted font-mono truncate"
              />
              <Button size="sm" variant="outline" onClick={handleCopy} className="flex-shrink-0">
                <Copy className="w-4 h-4 mr-1" />
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-muted/50 rounded-xl p-4 text-left text-sm space-y-2 mb-4">
          <p className="font-semibold text-foreground">Como pagar:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Abra o app do seu banco</li>
            <li>Escolha pagar com <strong>Pix</strong></li>
            <li>Escaneie o QR Code ou cole o código</li>
            <li>Confirme o pagamento</li>
            <li>Clique no botão abaixo para <strong>confirmar pelo WhatsApp</strong></li>
          </ol>
        </div>

        {/* WhatsApp confirmation */}
        <a
          href={`https://wa.me/5511999999999?text=${encodeURIComponent(`✅ Paguei o Pix!\n\n📋 Pedido: ${txid}\n💰 Valor: R$ ${parseFloat(amount || 0).toFixed(2)}\n\nPor favor, confirme meu pagamento!`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4"
        >
          <Button className="w-full rounded-xl h-12 font-bold bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="w-5 h-5 mr-2" />
            Já paguei! Confirmar via WhatsApp
          </Button>
        </a>

        {/* Polling indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Aguardando confirmação...
        </div>
      </div>
    </div>
  );
}
