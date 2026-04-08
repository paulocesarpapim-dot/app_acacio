import { Heart, MapPin, Leaf, Users, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sobre() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Nossa <span className="text-primary">História</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Conheça o Empório Filho de Deus — onde cada produto carrega o sabor e a tradição do sertão nordestino.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Quem Somos</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O <strong className="text-foreground">Empório Filho de Deus</strong> nasceu do amor pela terra e pela vontade de levar o melhor do sertão nordestino até a mesa de cada família em São Paulo.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Selecionamos com carinho cada produto — feijão, cereais, grãos, leguminosas e especiarias — direto de produtores que cultivam com tradição e respeito pela natureza. Aqui, cada grão conta uma história de dedicação e sabor autêntico.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Mais do que um empório, somos uma ponte entre o sertão e a cidade grande, trazendo qualidade, preço justo e o gostinho de casa para quem sente saudade da nossa terra.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
            Nossos Valores
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Leaf,
                title: "Qualidade na Origem",
                desc: "Trabalhamos com produtores de confiança que cultivam com dedicação e amor pela terra.",
              },
              {
                icon: MapPin,
                title: "Do Sertão para SP",
                desc: "Encurtamos a distância entre o sertão nordestino e a sua mesa em São Paulo.",
              },
              {
                icon: Users,
                title: "Atendimento Humano",
                desc: "Cada cliente é tratado como família. Estamos sempre disponíveis pelo WhatsApp para ajudar.",
              },
              {
                icon: Star,
                title: "Preço Justo",
                desc: "Produtos de qualidade a preços acessíveis, valorizando tanto o produtor quanto o consumidor.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl bg-background border border-border">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            📍 Onde Estamos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden border border-border">
              <iframe
                title="Localização Empório Filho de Deus"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913!2d-46.806642!3d-23.5029766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cefe12a44803ad%3A0x3aeba69b18515985!2sEmporio%20Filho%20De%20Deus!5e0!3m2!1spt-BR!2sbr"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Endereço</p>
                  <p className="text-sm text-muted-foreground">Rua Piacatu, 1130 — Munhóz</p>
                  <p className="text-sm text-muted-foreground">Osasco — SP</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <a href="https://wa.me/5511957800711" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    (11) 95780-0711
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Horário</p>
                  <p className="text-sm text-muted-foreground">Segunda a Sábado: 8h às 18h</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 mt-2">
                <p className="text-xs text-muted-foreground">CNPJ: 44.945.245/0001-67</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">
          Ficou com vontade?
        </h2>
        <p className="text-muted-foreground mb-6">
          Fale com a gente pelo WhatsApp ou navegue pelo nosso catálogo!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://wa.me/5511957800711?text=Olá! Gostaria de conhecer melhor o Empório Filho de Deus."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="rounded-full bg-green-500 hover:bg-green-600 text-white h-12 px-8">
              <MessageCircle className="w-5 h-5 mr-2" /> Fale Conosco
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
