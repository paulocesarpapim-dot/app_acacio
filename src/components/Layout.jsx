import { Outlet, Link, useLocation } from "react-router-dom";
import { ShoppingCart, Home, Package, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import Footer from "./Footer";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Início", icon: Home },
    { to: "/produtos", label: "Produtos", icon: Package },
    { to: "/carrinho", label: "Carrinho", icon: ShoppingCart, badge: cartCount },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display text-lg sm:text-xl font-bold">N</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-lg font-bold text-foreground leading-tight">Produtos do Nordeste</h1>
                <p className="text-xs text-muted-foreground">Sabor autêntico da nossa terra</p>
              </div>
              <span className="sm:hidden font-display text-base font-bold text-foreground">Nordeste</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon, badge }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground rounded-full text-xs flex items-center justify-center font-bold">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
              <a
                href="https://wa.me/5511957800711?text=Olá! Gostaria de fazer um pedido."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all ml-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </nav>

            {/* Mobile menu + cart */}
            <div className="flex md:hidden items-center gap-2">
              <Link to="/carrinho" className="relative p-2">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <a
                href="https://wa.me/5500000000000?text=Olá! Gostaria de fazer um pedido."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-green-600 text-white"
              >
                <MessageCircle className="w-4 h-4" />
                Pedir via WhatsApp
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5511957800711?text=Olá! Gostaria de fazer um pedido."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}