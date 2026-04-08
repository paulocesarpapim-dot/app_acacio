import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/productService";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Clock, MessageCircle, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import capa from "../assets/capa.jpg";
// PromocaoCliente movido para App.jsx (popup global)
import { useState, useEffect } from "react";

const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? window.location.origin : 'http://localhost:3000';

export default function Home() {
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchProducts(),
  });

  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/api/categories`).then(r => r.ok ? r.json() : []).then(setCategories).catch(() => {});
    fetch(`${API_URL}/api/promotions/active`).then(r => r.ok ? r.json() : []).then(setPromotions).catch(() => {});
  }, []);

  const getPromoForProduct = (productId) => promotions.find(p => p.productIds?.includes(productId));

  const featuredProducts = allProducts?.slice(0, 8) || [];

  const products = featuredProducts?.length > 0 ? featuredProducts : allProducts?.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={capa} alt="Empório Filho de Deus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-36 lg:py-44">
          <div className="max-w-2xl">
            <h2
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-2 leading-none tracking-tight"
              style={{textShadow: '3px 3px 12px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)'}}
            >
              Empório
            </h2>
            <h2
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-accent mb-6 leading-none tracking-tight"
              style={{textShadow: '3px 3px 12px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)'}}
            >
              Filho de Deus
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-6" />
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              <span className="text-white/60">Sabores autênticos do</span>{" "}
              <span className="text-white font-extrabold">Sertão</span>
            </h1>
            <p className="text-white/70 text-lg mt-4 leading-relaxed max-w-lg">
              Feijão, cereais, grãos e leguminosas.
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
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat.name} />
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
              <ProductCard key={product.id} product={product} promotion={getPromoForProduct(product.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground text-lg">Produtos em breve! 🌵</p>
            <p className="text-sm text-muted-foreground mt-2">Estamos preparando nosso catálogo</p>
          </div>
        )}
      </section>

      {/* Best Sellers */}
      {(() => {
        const bestSellers = allProducts?.filter(p => p.featured)?.slice(0, 4) || [];
        if (bestSellers.length === 0) return null;
        return (
          <section className="bg-primary/5 border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
              <div className="text-center mb-8">
                <span className="text-primary text-sm font-bold uppercase tracking-widest">⭐ Top Vendas</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2">Mais Vendidos</h2>
                <p className="text-muted-foreground mt-1">Os favoritos dos nossos clientes</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} promotion={getPromoForProduct(product.id)} />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">O que dizem nossos clientes</h2>
          <p className="text-muted-foreground mt-1">Avaliações reais de quem compra com a gente</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Maria S.", city: "São Paulo", stars: 5, text: "Feijão de primeiríssima qualidade! Parece que voltei pro sertão da minha avó. Entrega rápida e atendimento nota 10." },
            { name: "João P.", city: "Guarulhos", stars: 5, text: "Compro toda semana. Os grãos são frescos, bem selecionados e o preço é justo. Recomendo demais!" },
            { name: "Ana L.", city: "São Paulo", stars: 5, text: "Atendimento pelo WhatsApp super atencioso. Tirou todas as minhas dúvidas e entregou no dia seguinte. Virei cliente fiel!" },
          ].map((review, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 relative">
              <Quote className="w-8 h-8 text-primary/10 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{review.text}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.city}</p>
              </div>
            </div>
          ))}
        </div>
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