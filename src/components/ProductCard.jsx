import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

      <div className="p-4">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="font-display text-base font-semibold mt-1 text-foreground leading-tight">
          {product.name}
        </h3>
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
            disabled={(product.in_stock === false) || added}
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

function Package({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}