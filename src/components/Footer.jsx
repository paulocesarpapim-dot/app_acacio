import { MessageCircle, Mail, MapPin, Phone, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-16 sm:mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <h3 className="font-display font-bold text-foreground">Produtos do Nordeste</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Trazemos o sabor autêntico do sertão nordestino para sua mesa. Produtos naturais, tradicionais e de qualidade.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/produtos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Produtos
                </a>
              </li>
              <li>
                <a href="/carrinho" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Carrinho
                </a>
              </li>
              <li>
                <a href="#contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <a href="/produtos?categoria=Doces%20e%20Mel" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Doces e Mel
                </a>
              </li>
              <li>
                <a href="/produtos?categoria=Produtos%20Naturais" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Produtos Naturais
                </a>
              </li>
              <li>
                <a href="/produtos?categoria=Bebidas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Bebidas
                </a>
              </li>
              <li>
                <a href="/produtos?categoria=Conservas%20e%20Molhos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Conservas
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contato</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/5511957800711?text=Olá! Gostaria de fazer um pedido."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href="mailto:contato@produtosnordeste.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                (11) 9 5780-0711
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                São Paulo, SP
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8 sm:my-12" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Produtos do Nordeste. Todos os direitos reservados.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Siga-nos:</p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
