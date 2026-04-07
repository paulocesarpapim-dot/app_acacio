import { Plus, Check, Package, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { toast } from "sonner";
import { isKgProduct, formatQty, qtyStep, minQty } from "../utils/productUtils";

export default function ProductCard({ product, promotion }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const isKg = isKgProduct(product);
  const [qty, setQty] = useState(isKg ? 0.1 : 1);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    const label = isKg ? `${formatQty(product, qty)} de ${product.name}` : product.name;
    toast.success(`${label} adicionado ao carrinho!`);
    setTimeout(() => setAdded(false), 1500);
  };

  const step = qtyStep(product);
  const min = minQty(product);

  const handleDecrease = () => setQty(q => Math.max(min, parseFloat((q - step).toFixed(2))));
  const handleIncrease = () => setQty(q => parseFloat((q + step).toFixed(2)));

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  };

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link to={`/produto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <Package className="w-12 h-12 text-muted-foreground/40" />
            </div>
          )}
          {product.featured && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              ⭐ Destaque
            </span>
          )}
          {promotion && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
              {promotion.type === 'percentage' ? `${promotion.discountPercent}% OFF` : promotion.type === 'fixed' ? `R$${promotion.discountValue} OFF` : '🔥 Promo'}
            </span>
          )}
          {product.in_stock === false && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground text-sm font-medium px-3 py-1.5 rounded-lg">
                Esgotado
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {product.category}
        </span>
        <Link to={`/produto/${product.id}`} className="block">
          <h3 className="text-base font-bold mt-1 text-foreground leading-tight hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div>
            {promotion && promotion.type === 'percentage' ? (
              <>
                <span className="text-sm text-muted-foreground line-through mr-1">{formatPrice(product.price)}</span>
                <span className="text-lg font-bold text-red-600">{formatPrice(product.price * (1 - promotion.discountPercent / 100))}</span>
              </>
            ) : promotion && promotion.type === 'fixed' ? (
              <>
                <span className="text-sm text-muted-foreground line-through mr-1">{formatPrice(product.price)}</span>
                <span className="text-lg font-bold text-red-600">{formatPrice(Math.max(0, product.price - promotion.discountValue))}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            )}
            {isKg ? (
              <span className="text-xs text-muted-foreground ml-1">/ kg</span>
            ) : product.unit ? (
              <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
            ) : null}
          </div>
        </div>

        {isKg && (
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleDecrease}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors text-xs"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-bold min-w-[50px] text-center">{formatQty(product, qty)}</span>
            <button
              onClick={handleIncrease}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors text-xs"
            >
              <Plus className="w-3 h-3" />
            </button>
            <span className="text-xs text-muted-foreground ml-1">
              {formatPrice(parseFloat((product.price * qty).toFixed(2)))}
            </span>
          </div>
        )}

        <div className="mt-3">
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={product.in_stock === false || added}
            className={`rounded-full transition-all w-full ${
              added ? "bg-green-600 hover:bg-green-600" : ""
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 mr-1" /> Adicionado
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}