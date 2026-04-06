import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/productService";
import { useState, useMemo } from "react";
import { Search, X, ChevronDown, Filter, Grid3x3, List, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/ProductCard";
import ListProductCard from "../components/ListProductCard";

const CATEGORIES = ["Feijão", "Farinha", "Queijos", "Manteiga", "Bolachas", "Rapadura", "Doces", "Cereais", "Requeijão", "Temperos", "Carne de Sol", "Bebidas"];

const PRICE_RANGES = [
  { label: "Todos os preços", min: 0, max: Infinity },
  { label: "Até R$20", min: 0, max: 20 },
  { label: "R$20 a R$50", min: 20, max: 50 },
  { label: "R$50 a R$100", min: 50, max: 100 },
  { label: "Acima de R$100", min: 100, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Relevância", value: "default" },
  { label: "Menor Preço", value: "price-asc" },
  { label: "Maior Preço", value: "price-desc" },
  { label: "Mais Antigos", value: "newest" },
];

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("categoria") || "";

  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchProducts(),
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = products;

    // Filtrar por categorias
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Filtrar por preço
    result = result.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Filtrar por busca
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Ordenar resultados
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "default":
      default:
        break;
    }

    return result;
  }, [products, selectedCategories, priceRange, search, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(PRICE_RANGES[0]);
    setSearch("");
  };

  const toggleFilter = (filter) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Nossos Produtos</h1>
              <p className="text-muted-foreground mt-2">O melhor da Casa do Norte para sua mesa</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 rounded-xl h-12 text-base"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-foreground"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden lg:block"} w-full lg:w-56 flex-shrink-0`}>
            <div className="sticky top-4 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <Filter className="w-5 h-5" /> Filtrar por
                </h2>
                {(selectedCategories.length > 0 || priceRange !== PRICE_RANGES[0]) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div className="border border-border rounded-lg p-4">
                <button
                  onClick={() => toggleFilter("categories")}
                  className="w-full flex items-center justify-between font-semibold text-foreground mb-4"
                >
                  Categorias
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedFilters.categories ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFilters.categories && (
                  <div className="space-y-3">
                    {CATEGORIES.map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 rounded border-border text-primary"
                        />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border border-border rounded-lg p-4">
                <button
                  onClick={() => toggleFilter("price")}
                  className="w-full flex items-center justify-between font-semibold text-foreground mb-4"
                >
                  Preço
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedFilters.price ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFilters.price && (
                  <div className="space-y-3">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === range}
                          onChange={() => setPriceRange(range)}
                          className="w-4 h-4 rounded-full border-border text-primary"
                        />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Toggle Filters (Mobile) */}
            <Button
              variant="outline"
              className="lg:hidden mb-6 w-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>

            {/* Results Info + Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
              </p>

              {/* Controles de Ordenação e Visualização */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Ordenação */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none pr-10"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-border rounded-lg p-1 bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-all ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Visualizar em grade"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-all ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Visualizar em lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" : "space-y-4"}>
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
              viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((product) => (
                    <ListProductCard key={product.id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-lg font-medium text-foreground">Nenhum produto encontrado</p>
                <p className="text-sm text-muted-foreground mt-1">Tente mudar os filtros ou buscar outro termo</p>
                <Button variant="outline" className="mt-4 rounded-full" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}