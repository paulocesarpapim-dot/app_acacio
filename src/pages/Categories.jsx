import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/productService";
import { Link } from "react-router-dom";
import { ArrowRight, Grid3x3, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

const CATEGORIES_INFO = {
  "Feijão": {
    emoji: "🫘",
    description: "Feijões tradicionais do sertão",
    color: "from-amber-600 to-amber-700"
  },
  "Farinha": {
    emoji: "🌾",
    description: "Farinha de mandioca e derivados",
    color: "from-yellow-600 to-yellow-700"
  },
  "Queijos": {
    emoji: "🧀",
    description: "Queijos artesanais nordestinos",
    color: "from-orange-600 to-orange-700"
  },
  "Manteiga": {
    emoji: "🧈",
    description: "Manteiga de garrafa sertaneja",
    color: "from-yellow-500 to-yellow-600"
  },
  "Bolachas": {
    emoji: "🍪",
    description: "Bolachas caseiras tradicionais",
    color: "from-amber-500 to-amber-600"
  },
  "Rapadura": {
    emoji: "🍯",
    description: "Rapadura artesanal nordestina",
    color: "from-amber-700 to-amber-800"
  },
  "Doces": {
    emoji: "🍬",
    description: "Doces regionais e confeitaria",
    color: "from-pink-600 to-pink-700"
  },
  "Cereais": {
    emoji: "🌽",
    description: "Cereais e grãos regionais",
    color: "from-yellow-700 to-yellow-800"
  },
  "Requeijão": {
    emoji: "🥛",
    description: "Requeijão cremoso artesanal",
    color: "from-orange-500 to-orange-600"
  },
  "Temperos": {
    emoji: "🌶️",
    description: "Temperos e especiarias amazônicas",
    color: "from-red-600 to-red-700"
  },
  "Carne de Sol": {
    emoji: "🥩",
    description: "Carne seca e de sol artesanal",
    color: "from-red-700 to-red-800"
  },
  "Outros": {
    emoji: "📦",
    description: "Outros produtos regionais",
    color: "from-gray-600 to-gray-700"
  }
};

export default function Categories() {
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchProducts(),
  });

  // Agrupar produtos por categoria e contar
  const categoriesWithCount = useMemo(() => {
    if (!products) return [];

    const counts = {};
    products.forEach(product => {
      const cat = product.category || "Outros";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Filtrar por busca
    const filtered = Object.entries(counts)
      .filter(([name]) => 
        name.toLowerCase().includes(search.toLowerCase())
      )
      .map(([name, count]) => ({
        name,
        count,
        ...CATEGORIES_INFO[name] || { emoji: "📦", description: "Produtos", color: "from-gray-600 to-gray-700" }
      }))
      .sort((a, b) => b.count - a.count);

    return filtered;
  }, [products, search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              <Grid3x3 className="inline-block w-12 h-12 mr-3 text-primary" />
              Categorias
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore nossos produtos organizados por categorias. Cada uma com produtos selecionados com qualidade garantida.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar categoria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 rounded-full text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 bg-card rounded-2xl border border-border animate-pulse" />
            ))}
          </div>
        ) : categoriesWithCount.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoriesWithCount.map((category) => (
                <Link
                  key={category.name}
                  to={`/produtos?categoria=${encodeURIComponent(category.name)}`}
                  className="group relative overflow-hidden rounded-2xl border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative p-6 h-40 flex flex-col justify-between bg-card group-hover:bg-card/50 transition-colors duration-300">
                    <div>
                      <div className="text-5xl mb-3">{category.emoji}</div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {category.count}
                      </span>
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Results Info */}
            <div className="mt-8 text-center text-muted-foreground">
              <p>
                {categoriesWithCount.length === Object.keys(CATEGORIES_INFO).length
                  ? `Total: ${categoriesWithCount.length} categorias`
                  : `Mostrando ${categoriesWithCount.length} de ${Object.keys(CATEGORIES_INFO).length} categorias`
                }
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground text-lg mb-4">Nenhuma categoria encontrada</p>
            <Button
              variant="outline"
              onClick={() => setSearch("")}
            >
              Limpar busca
            </Button>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Tudo que você precisa em um só lugar!
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore nossas categorias e descubra produtos selecionados com qualidade garantida direto do sertão nordestino.
          </p>
          <Link to="/produtos">
            <Button size="lg" className="rounded-full">
              Ver Todos os Produtos <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
