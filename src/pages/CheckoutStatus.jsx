import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../hooks/useCart";
import { useEffect, useRef } from "react";

const STATUS_CONFIG = {
  approved: {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-900",
    title: "Pagamento Aprovado!",
    subtitle: "Seu pedido foi confirmado com sucesso.",
    description: "Você receberá um e-mail com os detalhes do pedido. Obrigado por comprar no Empório Filho de Deus!",
  },
  rejected: {
    icon: XCircle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-900",
    title: "Pagamento Recusado",
    subtitle: "Não foi possível processar seu pagamento.",
    description: "Tente novamente com outro método de pagamento ou entre em contato conosco pelo WhatsApp.",
  },
  pending: {
    icon: Clock,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    borderColor: "border-yellow-200 dark:border-yellow-900",
    title: "Pagamento Pendente",
    subtitle: "Aguardando confirmação do pagamento.",
    description: "Se você pagou via Pix ou boleto, a confirmação pode levar alguns minutos. Você receberá uma notificação quando for aprovado.",
  },
};

export default function CheckoutStatus() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "pending";
  const paymentId = searchParams.get("payment_id");
  const { clearCart } = useCart();
  const cleared = useRef(false);

  // Clear cart on approved
  useEffect(() => {
    if (status === "approved" && !cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [status, clearCart]);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-8 mb-8`}>
        <div className="flex justify-center mb-4">
          <div className={`w-20 h-20 rounded-full bg-white dark:bg-background flex items-center justify-center shadow-sm`}>
            <Icon className={`w-10 h-10 ${config.iconColor}`} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">{config.title}</h1>
        <p className="text-lg text-muted-foreground mb-4">{config.subtitle}</p>
        <p className="text-sm text-muted-foreground">{config.description}</p>

        {paymentId && (
          <p className="mt-4 text-xs text-muted-foreground">
            ID do pagamento: <span className="font-mono font-semibold">{paymentId}</span>
          </p>
        )}
      </div>

      <div className="space-y-3">
        {status === "approved" ? (
          <Link to="/produtos">
            <Button className="w-full rounded-xl h-12 text-base font-bold">
              <ShoppingCart className="w-5 h-5 mr-2" /> Continuar Comprando
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/carrinho">
              <Button className="w-full rounded-xl h-12 text-base font-bold">
                Voltar ao Carrinho
              </Button>
            </Link>
            <a
              href="https://wa.me/5511957800711?text=Ol%C3%A1%2C%20tive%20um%20problema%20com%20meu%20pagamento"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full rounded-xl h-12 text-base mt-2">
                💬 Contato via WhatsApp
              </Button>
            </a>
          </>
        )}

        <Link to="/">
          <Button variant="ghost" className="w-full text-sm mt-2">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
