import { Plus, Check, Package, Star } from "lucide-react";
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

  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{rating}</span>
      </div>
    );
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
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              ⭐ Destaque
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
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

        {/* Rating */}
        <div className="mt-2">
          {renderStars(product.rating)}
        </div>

        {/* Pricing */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatPrice(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add button */}
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!product.in_stock || added}
          className={`w-full mt-4 rounded-lg transition-all ${
            added ? "bg-green-600 hover:bg-green-600" : ""
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 mr-1" /> Adicionado
            </>
          ) : !product.in_stock ? (
            <>Esgotado</>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}