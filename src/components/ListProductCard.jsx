import { Plus, Check, Package, Star, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { toast } from "sonner";
import { isKgProduct, formatQty, qtyStep, minQty } from "../utils/productUtils";

export default function ListProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const isKg = isKgProduct(product);
  const [qty, setQty] = useState(isKg ? 0.1 : 1);
  const step = qtyStep(product);
  const min = minQty(product);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    const label = isKg ? `${formatQty(product, qty)} de ${product.name}` : product.name;
    toast.success(`${label} adicionado ao carrinho!`);
    setTimeout(() => setAdded(false), 1500);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all duration-300 flex">
      {/* Imagem */}
      <Link to={`/produto/${product.id}`} className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40">
        <div className="relative w-full h-full overflow-hidden bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={`${product.name}${product.category ? ` — ${product.category}` : ''} | Empório Filho de Deus`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-secondary"><span class="text-3xl">📦</span></div>'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <Package className="w-8 h-8 text-muted-foreground/40" />
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
              ⭐
            </span>
          )}
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {product.category}
          </span>
          <Link to={`/produto/${product.id}`}>
            <h3 className="text-base sm:text-lg font-bold mt-1 text-foreground leading-tight hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
          )}
          
          {/* Avaliação (opcional) */}
          {product.rating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(product.rating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              {product.reviews_count && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviews_count})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Preço e Botão */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div>
            <span className="text-lg sm:text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {isKg ? (
              <span className="text-xs text-muted-foreground ml-2">/ kg</span>
            ) : product.unit ? (
              <span className="text-xs text-muted-foreground ml-2">/ {product.unit}</span>
            ) : null}
          </div>
          {isKg && (
            <div className="flex items-center gap-1 mr-2">
              <button onClick={() => setQty(q => Math.max(min, parseFloat((q - step).toFixed(2))))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold min-w-[40px] text-center">{formatQty(product, qty)}</span>
              <button onClick={() => setQty(q => parseFloat((q + step).toFixed(2)))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={product.in_stock === false || added}
            className={`rounded-lg transition-all ${
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
