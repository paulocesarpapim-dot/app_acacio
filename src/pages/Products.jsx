import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Todos", "Feijão", "Farinha", "Queijos", "Manteiga", "Bolachas", "Rapadura", "Doces", "Cereais", "Requeijão", "Outros"];

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("categoria") || "Todos";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => base44.entities.Product.list("-created_date", 200),
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = products;
    if (selectedCategory !== "Todos") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, selectedCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Nossos Produtos</h1>
        <p className="text-muted-foreground mt-2">O melhor do Nordeste para sua mesa</p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-11"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          className="rounded-xl h-11 md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories */}
      <div className={`mb-8 ${showFilters ? "block" : "hidden md:block"}`}>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
        {selectedCategory !== "Todos" && (
          <span>
            {" "}em <strong>{selectedCategory}</strong>
            <button onClick={() => setSelectedCategory("Todos")} className="text-primary ml-2 hover:underline">
              Limpar
            </button>
          </span>
        )}
      </p>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
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
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-medium text-foreground">Nenhum produto encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">Tente mudar os filtros ou buscar outro termo</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={() => { setSearch(""); setSelectedCategory("Todos"); }}>
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}