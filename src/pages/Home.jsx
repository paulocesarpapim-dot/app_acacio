import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "@/api/productService";

const CATEGORIES = ["Feijão", "Farinha", "Queijos", "Manteiga", "Bolachas", "Rapadura", "Doces", "Cereais", "Requeijão"];

export default function Home() {
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const products = allProducts?.slice(0, 8) || [];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1600&h=800&fit=crop"
            alt="Produtos nordestinos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 lg:py-40">
          <div className="max-w-xl">
            <span className="inline-block bg-accent/90 text-accent-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Direto do Nordeste 🌵
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Sabores autênticos do{" "}
              <span className="text-accent">Sertão</span>
            </h1>
            <p className="text-white/80 text-lg mt-4 leading-relaxed">
              Feijão, farinha, requeijão, queijo coalho, rapadura, doces e muito mais.
              Produtos selecionados com o gosto de nossa terra.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/produtos">
                <Button size="lg" className="rounded-full text-base px-8 h-12">
                  Ver Produtos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a
                href="https://wa.me/5511957800711?text=Olá! Gostaria de saber mais sobre os produtos."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                  <MessageCircle className="w-4 h-4 mr-2" /> Fale Conosco
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Entrega Rápida", sub: "Em toda a cidade" },
              { icon: Shield, label: "Qualidade", sub: "Produtos selecionados" },
              { icon: Clock, label: "Atendimento", sub: "Seg a Sáb" },
              { icon: MessageCircle, label: "WhatsApp", sub: "Peça pelo Zap" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Categorias</h2>
            <p className="text-muted-foreground mt-1">Encontre tudo que precisa</p>
          </div>
          <Link to="/produtos" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            Ver tudo <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat} category={cat} />
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {featuredProducts?.length > 0 ? "Destaques" : "Nossos Produtos"}
            </h2>
            <p className="text-muted-foreground mt-1">Os mais pedidos pelos nossos clientes</p>
          </div>
          <Link to="/produtos" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            Ver catálogo <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-8 bg-muted rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground text-lg">Produtos em breve! 🌵</p>
            <p className="text-sm text-muted-foreground mt-2">Estamos preparando nosso catálogo</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
            Faça seu pedido agora!
          </h2>
          <p className="text-primary-foreground/80 mt-2 max-w-md mx-auto">
            Peça pelo WhatsApp ou monte seu carrinho e envie direto pelo app
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a
              href="https://wa.me/5511957800711?text=Olá! Gostaria de fazer um pedido."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="rounded-full bg-green-500 hover:bg-green-600 text-white h-12 px-8 text-base">
                <MessageCircle className="w-5 h-5 mr-2" /> Pedir pelo WhatsApp
              </Button>
            </a>
            <Link to="/produtos">
              <Button size="lg" variant="outline" className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-12 px-8 text-base">
                Ver Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}