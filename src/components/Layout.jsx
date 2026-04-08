import { Outlet, Link, useLocation } from "react-router-dom";
import { ShoppingCart, Home, Package, MessageCircle, Menu, X, User, Star } from "lucide-react";
import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../lib/AuthContext";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Início", icon: Home },
    { to: "/produtos", label: "Produtos", icon: Package },
    { to: "/carrinho", label: "Carrinho", icon: ShoppingCart, badge: cartCount },
    { to: isAuthenticated ? "/minha-conta" : "/conta", label: isAuthenticated ? (user?.name?.split(" ")[0] || "Conta") : "Entrar", icon: isAuthenticated ? Star : User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display text-lg sm:text-xl font-bold">N</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-lg font-bold text-foreground leading-tight">Empório Filho de Deus</h1>
                <p className="text-xs text-muted-foreground">Sabor autêntico da nossa terra</p>
              </div>
              <span className="sm:hidden font-display text-base font-bold text-foreground">Empório FD</span>
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
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
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
                href="https://wa.me/5511957800711?text=Olá! Gostaria de fazer um pedido."
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
      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-display text-sm font-bold">N</span>
                </div>
                <span className="font-display text-sm font-semibold">Empório Filho de Deus</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sabor autêntico direto do sertão nordestino para sua mesa em São Paulo.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Navegação</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/produtos" className="hover:text-foreground transition-colors">Produtos</Link></li>
                <li><Link to="/sobre" className="hover:text-foreground transition-colors">Sobre Nós</Link></li>
                <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog & Receitas</Link></li>
                <li><Link to="/conta" className="hover:text-foreground transition-colors">Minha Conta</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Políticas</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><span className="font-medium text-foreground/80">Entrega:</span> Em toda São Paulo, via motoboy ou Correios. Prazo de 1 a 3 dias úteis.</li>
                <li><span className="font-medium text-foreground/80">Troca:</span> Aceitamos trocas em até 7 dias para produtos fechados e dentro da validade.</li>
                <li><span className="font-medium text-foreground/80">Pagamento:</span> Pix, dinheiro na entrega ou cartão (via link).</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Contato & Localização</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <a href="https://wa.me/5511957800711" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    📱 WhatsApp: (11) 95780-0711
                  </a>
                </li>
                <li>🕐 Seg a Sáb: 8h às 18h</li>
                <li>
                  <a href="https://maps.app.goo.gl/33PtpXDVJnyL4aY1A" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    📍 Rua Piacatu, 1130 — Munhóz, Osasco/SP
                  </a>
                </li>
                <li>🏢 CNPJ: 44.945.245/0001-67</li>
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="mb-6 rounded-xl overflow-hidden border border-border">
            <iframe
              title="Localização Empório Filho de Deus"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913!2d-46.806642!3d-23.5029766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cefe12a44803ad%3A0x3aeba69b18515985!2sEmporio%20Filho%20De%20Deus!5e0!3m2!1spt-BR!2sbr"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground text-center">
              © 2026 Empório Filho de Deus — CNPJ 44.945.245/0001-67 — Todos os direitos reservados
            </p>
            <Link to="/admin/produtos" className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5511957800711?text=Olá! Gostaria de fazer um pedido."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}