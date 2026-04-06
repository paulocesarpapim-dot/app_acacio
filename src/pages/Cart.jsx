import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, cartTotal } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const buildWhatsAppMessage = () => {
    let msg = "🛒 *Meu Pedido - Casa do Norte Filho de Deus*\n\n";
    items.forEach((item) => {
      msg += `• ${item.qty}x ${item.product.name} — ${formatPrice(item.product.price * item.qty)}\n`;
    });
    msg += `\n💰 *Total: ${formatPrice(cartTotal)}*\n`;
    msg += "\nGostaria de confirmar este pedido!";
    return encodeURIComponent(msg);
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Seu Carrinho</h1>
          <p className="text-muted-foreground mt-1">{items.length} {items.length === 1 ? "item" : "itens"}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-1" /> Limpar
        </Button>
      </div>

      {/* Items */}
      <div className="space-y-4 mb-8">
        {items.map(({ product, qty }) => (
          <div key={product.id} className="flex gap-4 bg-card rounded-2xl border border-border p-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <p className="text-primary font-bold mt-1">{formatPrice(product.price)}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(product.id, qty - 1)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-semibold w-6 text-center">{qty}</span>
                <button
                  onClick={() => updateQty(product.id, qty + 1)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <span className="text-lg font-bold text-foreground">Total</span>
          <span className="text-xl font-bold text-primary">{formatPrice(cartTotal)}</span>
        </div>

        <div className="space-y-3">
          <a
            href={`https://wa.me/5511957800711?text=${buildWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full rounded-xl h-12 text-base bg-green-600 hover:bg-green-700">
              <MessageCircle className="w-5 h-5 mr-2" /> Enviar Pedido pelo WhatsApp
            </Button>
          </a>
          <Link to="/produtos" className="block">
            <Button variant="outline" className="w-full rounded-xl h-12">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}