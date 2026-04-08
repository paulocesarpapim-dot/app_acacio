import { Clock, Users, ChefHat, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    slug: "feijao-tropeiro-tradicional",
    title: "Feijão Tropeiro Tradicional do Sertão",
    date: "2026-04-08",
    readTime: "5 min",
    summary: "A receita clássica do feijão tropeiro, feita com ingredientes que você encontra no Empório Filho de Deus.",
    image: null,
    content: {
      intro: "O feijão tropeiro é um dos pratos mais emblemáticos da culinária sertaneja. Originado nas tropas que cruzavam o interior do Brasil, essa receita combina praticidade, sabor e tradição em um único prato. E o melhor: todos os ingredientes você encontra aqui no Empório Filho de Deus!",
      prepTime: "15 minutos",
      cookTime: "40 minutos",
      servings: "6 porções",
      ingredients: [
        "500g de feijão carioca (Empório Filho de Deus)",
        "200g de linguiça calabresa picada",
        "200g de bacon em cubos",
        "300g de farinha de mandioca torrada",
        "4 ovos",
        "1 cebola grande picada",
        "4 dentes de alho picados",
        "1/2 maço de couve cortada em tiras finas",
        "1/2 maço de cebolinha picada",
        "Sal e pimenta-do-reino a gosto",
        "2 folhas de louro",
      ],
      steps: [
        "Cozinhe o feijão na panela de pressão com as folhas de louro até ficar macio (~25 min). Escorra bem e reserve (o caldo pode virar sopa!).",
        "Em uma panela grande, frite o bacon até dourar. Adicione a linguiça e refogue até ficar bem corada.",
        "Acrescente a cebola e o alho, refogue por 2 minutos até perfumar.",
        "Adicione os ovos mexidos direto na panela, mexendo rapidamente para ficarem em pedacinhos.",
        "Junte o feijão cozido e escorrido, misture bem.",
        "Acrescente a farinha de mandioca aos poucos, mexendo sempre para incorporar.",
        "Finalize com a couve e a cebolinha. Acerte sal e pimenta.",
        "Sirva quente, acompanhado de arroz branco e uma salada verde!",
      ],
      tips: [
        "Use feijão carioca do Empório para um sabor mais autêntico.",
        "A farinha de mandioca torrada dá a textura crocante perfeita — não substitua por farinha de milho.",
        "Sobrou? O tropeiro fica ainda mais gostoso no dia seguinte.",
      ],
    },
  },
];

function BlogPost({ post }) {
  const { content } = post;
  return (
    <div>
      <section className="bg-primary/5 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Blog
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{new Date(post.date).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span>{post.readTime} de leitura</span>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">{content.intro}</p>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Clock, label: "Preparo", value: content.prepTime },
            { icon: ChefHat, label: "Cozimento", value: content.cookTime },
            { icon: Users, label: "Rende", value: content.servings },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-4 text-center">
              <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">🧾 Ingredientes</h2>
          <ul className="space-y-2">
            {content.ingredients.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">👨‍🍳 Modo de Preparo</h2>
          <ol className="space-y-4">
            {content.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-muted-foreground leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Tips */}
        <div className="bg-accent/10 rounded-2xl border border-accent/20 p-6 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">💡 Dicas</h2>
          <ul className="space-y-2">
            {content.tips.map((tip, i) => (
              <li key={i} className="text-muted-foreground text-sm leading-relaxed">• {tip}</li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-6 text-center">
          <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">
            Quer os ingredientes fresquinhos?
          </h3>
          <p className="text-primary-foreground/80 text-sm mb-4">
            Todos os grãos e cereais dessa receita estão disponíveis no Empório Filho de Deus!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/produtos">
              <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 h-11 px-6">
                Ver Produtos
              </Button>
            </Link>
            <a href="https://wa.me/5511957800711?text=Olá! Vi a receita de feijão tropeiro e quero comprar os ingredientes!" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full bg-green-500 hover:bg-green-600 text-white h-11 px-6">
                <MessageCircle className="w-4 h-4 mr-2" /> Pedir pelo WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Blog() {
  // Simple client-side routing within blog
  const slug = window.location.hash?.replace("#", "");
  const post = slug ? posts.find((p) => p.slug === slug) : null;

  if (post) return <BlogPost post={post} />;

  return (
    <div>
      <section className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Blog do <span className="text-primary">Empório</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Receitas, dicas e histórias do sertão
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/blog#${post.slug}`}
              className="block bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-32 sm:h-32 w-full h-40 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {post.summary}
                  </p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{new Date(post.date).toLocaleDateString("pt-BR")}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
