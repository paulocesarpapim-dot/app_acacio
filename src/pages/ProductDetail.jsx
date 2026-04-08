// @ts-nocheck
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById, fetchProducts } from "@/api/productService";
import { useCart } from "../hooks/useCart";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/ProductCard";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Package,
  Tag,
  Info,
  MessageCircle,
  Truck,
  Shield,
} from "lucide-react";
import { isKgProduct, formatQty, qtyStep, minQty } from "../utils/productUtils";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, cartCount } = useCart();
  const [qty, setQty] = useState(null);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  const { data: allProducts } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchProducts(),
  });

  const relatedProducts = allProducts
    ?.filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4) || [];

  const isKg = product ? isKgProduct(product) : false;
  const step = product ? qtyStep(product) : 1;
  const min = product ? minQty(product) : 1;
  const currentQty = qty ?? min;

  const formatPrice = (price) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const handleAdd = () => {
    addItem(product, currentQty);
    setAdded(true);
    const label = isKg ? `${formatQty(product, currentQty)} de ${product.name}` : product.name;
    toast.success(`${label} adicionado ao carrinho!`);
    setTimeout(() => setAdded(false), 1800);
  };

  const buildWhatsAppMessage = () => {
    const qtyLabel = isKg ? formatQty(product, currentQty) : currentQty;
    const msg = `Olá! Tenho interesse no produto:\n\n*${product.name}*\nCategoria: ${product.category}\nPreço: ${formatPrice(product.price)}${isKg ? '/kg' : ''}\nQuantidade: ${qtyLabel}\n\nGostaria de confirmar disponibilidade!`;
    return encodeURIComponent(msg);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-muted rounded-3xl" />
          <div className="space-y-5 pt-4">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-10 bg-muted rounded w-32 mt-6" />
            <div className="h-12 bg-muted rounded w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Produto não encontrado</h1>
        <p className="text-muted-foreground mt-2">O produto que você procura não existe ou foi removido.</p>
        <Button className="mt-6 rounded-full px-8" onClick={() => navigate("/produtos")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Ver Produtos
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
        <span>/</span>
        <Link to="/produtos" className="hover:text-foreground transition-colors">Produtos</Link>
        <span>/</span>
        <Link
          to={`/produtos?categoria=${encodeURIComponent(product.category)}`}
          className="hover:text-foreground transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[180px]">{product.name}</span>
      </nav>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Foto do Produto */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={`${product.name}${product.category ? ` — ${product.category}` : ''} | Empório Filho de Deus`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-6xl">📦</span></div>'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-muted-foreground/30" />
              </div>
            )}
            {product.featured && (
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow">
                ⭐ Destaque
              </span>
            )}
            {product.in_stock === false && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                <span className="bg-destructive text-destructive-foreground text-base font-semibold px-5 py-2 rounded-xl shadow-lg">
                  Produto Esgotado
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Detalhes do Produto */}
        <div className="flex flex-col">
          {/* Categoria */}
          <Link
            to={`/produtos?categoria=${encodeURIComponent(product.category)}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary hover:underline mb-3"
          >
            <Tag className="w-3 h-3" />
            {product.category}
          </Link>

          {/* Nome */}
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Preço */}
          <div className="mt-5 flex items-end gap-3">
            <span className="text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.unit && (
              <span className="text-sm text-muted-foreground mb-1">/ {product.unit}</span>
            )}
          </div>

          {/* Linha separadora */}
          <div className="h-px bg-border my-6" />

          {/* Descrição */}
          {product.description && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Info className="w-4 h-4 text-primary" />
                Descrição
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>
          )}

          {/* Ficha técnica */}
          <div className="bg-muted/50 rounded-2xl border border-border p-5 mb-6 space-y-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">Informações do Produto</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-muted-foreground">Nome</span>
              <span className="font-medium text-foreground">{product.name}</span>

              <span className="text-muted-foreground">Categoria</span>
              <span className="font-medium text-foreground">{product.category}</span>

              <span className="text-muted-foreground">Preço</span>
              <span className="font-bold text-primary">{formatPrice(product.price)}</span>

              {product.unit && (
                <>
                  <span className="text-muted-foreground">Unidade</span>
                  <span className="font-medium text-foreground">{product.unit}</span>
                </>
              )}

              <span className="text-muted-foreground">Disponibilidade</span>
              <span className={`font-medium ${product.in_stock === false ? "text-destructive" : "text-green-600"}`}>
                {product.in_stock === false ? "Esgotado" : "Em estoque"}
              </span>

              {product.created_at && (
                <>
                  <span className="text-muted-foreground">Cadastrado em</span>
                  <span className="font-medium text-foreground">
                    {new Date(product.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Seletor de quantidade */}
          {product.in_stock !== false && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">{isKg ? 'Peso:' : 'Quantidade:'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty((q) => Math.max(min, parseFloat(((q ?? min) - step).toFixed(2))))}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-bold min-w-[60px] text-center">{isKg ? formatQty(product, currentQty) : currentQty}</span>
                <button
                  onClick={() => setQty((q) => parseFloat(((q ?? min) + step).toFixed(2)))}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground ml-1">
                Total: <span className="font-semibold text-primary">{formatPrice(parseFloat((product.price * currentQty).toFixed(2)))}</span>
              </span>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={handleAdd}
              disabled={product.in_stock === false || added}
              className={`flex-1 rounded-xl h-12 text-base transition-all ${
                added ? "bg-green-600 hover:bg-green-600" : ""
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 mr-2" /> Adicionado!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" /> Adicionar ao Carrinho
                </>
              )}
            </Button>

            <a
              href={`https://wa.me/5511957800711?text=${buildWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-xl h-12 text-base border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <MessageCircle className="w-5 h-5 mr-2" /> Pedir pelo WhatsApp
              </Button>
            </a>
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-primary flex-shrink-0" />
              Entrega em toda a cidade
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              Produto selecionado
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Produtos Relacionados</h2>
              <p className="text-muted-foreground mt-1 text-sm">Outros produtos de {product.category}</p>
            </div>
            <Link
              to={`/produtos?categoria=${encodeURIComponent(product.category)}`}
              className="text-primary text-sm font-medium hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
