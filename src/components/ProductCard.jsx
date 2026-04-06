import { Plus, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    toast.success(`${product.name} adicionado ao carrinho!`);
    setTimeout(() => setAdded(false), 1500);
  };

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
          {!product.in_stock && (
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
          <h3 className="font-display text-base font-semibold mt-1 text-foreground leading-tight hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {product.unit && (
              <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!product.in_stock || added}
            className={`rounded-full transition-all ${
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