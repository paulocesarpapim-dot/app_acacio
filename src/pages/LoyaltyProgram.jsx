import { Gift, Crown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data - Em produção, virá da API
const LOYALTY_DATA = {
  member_since: "2024-01-15",
  level: "silver", // bronze, silver, gold
  total_points: 2850,
  available_points: 2850,
  current_level_progress: 75, // % para próximo nível
  lifetime_spent: 2850,
};

const LOYALTY_LEVELS = {
  bronze: {
    name: "Cliente Bronze",
    min_spend: 0,
    discount: "5%",
    benefits: ["5% de desconto em toda compra", "Brinde no aniversário"],
    badge: "🥉",
    color: "from-amber-700 to-amber-600",
  },
  silver: {
    name: "Cliente Prata",
    min_spend: 1000,
    discount: "10%",
    benefits: [
      "10% de desconto em toda compra",
      "Brinde no aniversário",
      "Frete grátis a partir de R$50",
      "Acesso a promoções exclusivas",
    ],
    badge: "🥈",
    color: "from-slate-400 to-slate-500",
  },
  gold: {
    name: "Cliente Ouro",
    min_spend: 3000,
    discount: "15%",
    benefits: [
      "15% de desconto permanente",
      "Brinde no aniversário + R$50 em pontos",
      "Frete grátis em qualquer pedido",
      "Atendimento prioritário",
      "Convite para eventos exclusivos",
    ],
    badge: "🏆",
    color: "from-yellow-500 to-yellow-600",
  },
};

export default function LoyaltyProgram() {
  const currentLevel = LOYALTY_LEVELS[LOYALTY_DATA.level];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl sm:text-6xl mb-4">{currentLevel.badge}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Programa Casa do Norte Amigos
          </h1>
          <p className="text-xl sm:text-2xl text-white/90">
            Acumule pontos em cada compra e ganhe recompensas exclusivas!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Card Principal - Saldo de Pontos */}
        <div className={`rounded-3xl p-8 sm:p-12 text-white shadow-lg bg-gradient-to-r ${currentLevel.color}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div>
              <p className="text-lg sm:text-xl opacity-90 mb-2">Seu Saldo</p>
              <p className="text-5xl sm:text-6xl font-bold">{LOYALTY_DATA.total_points.toLocaleString()}</p>
              <p className="text-sm sm:text-base opacity-75 mt-2">pontos disponíveis</p>
            </div>
            <div className="hidden sm:block border-l border-white/30" />
            <div>
              <p className="text-lg sm:text-xl opacity-90 mb-2">Seu Nível</p>
              <p className="text-4xl sm:text-5xl font-bold">{currentLevel.name}</p>
              <p className="text-sm sm:text-base opacity-75 mt-2">
                {currentLevel.discount} de desconto
              </p>
            </div>
            <div className="hidden sm:block border-l border-white/30" />
            <div>
              <p className="text-lg sm:text-xl opacity-90 mb-2">Total Gasto</p>
              <p className="text-5xl sm:text-6xl font-bold">
                R${LOYALTY_DATA.lifetime_spent.toLocaleString()}
              </p>
              <p className="text-sm sm:text-base opacity-75 mt-2">desde {LOYALTY_DATA.member_since.split('-')[0]}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {currentLevel !== LOYALTY_LEVELS.gold && (
            <div className="mt-8 pt-8 border-t border-white/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Progresso para próximo nível</span>
                <span className="text-2xl font-bold">{LOYALTY_DATA.current_level_progress}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${LOYALTY_DATA.current_level_progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Benefícios */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Gift className="w-10 h-10 text-primary" />
            Seus Benefícios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {currentLevel.benefits.map((benefit, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 border-2 border-primary/20"
              >
                <div className="flex gap-4">
                  <div className="text-3xl">✨</div>
                  <div>
                    <p className="text-lg sm:text-xl font-semibold text-foreground">{benefit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Como Funciona */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-primary" />
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Compre",
                description: "Faça suas compras normalmente",
                icon: "🛒",
              },
              {
                step: "2",
                title: "Ganhe Pontos",
                description: "1 real = 1 ponto",
                icon: "⭐",
              },
              {
                step: "3",
                title: "Acumule",
                description: "Acumule pontos em sua conta",
                icon: "📈",
              },
              {
                step: "4",
                title: "Resgate",
                description: "100 pontos = R$10 desconto",
                icon: "🎁",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-white border-2 border-primary/20 p-8 text-center hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <p className="text-5xl sm:text-6xl font-bold text-primary mb-3">{item.step}</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-lg sm:text-xl text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Níveis de Cliente */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Crown className="w-10 h-10 text-primary" />
            Nossos Níveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(LOYALTY_LEVELS).map(([key, level]) => (
              <div
                key={key}
                className={`rounded-3xl p-8 border-3 transition-all ${
                  key === LOYALTY_DATA.level
                    ? `border-primary bg-gradient-to-br ${level.color} text-white shadow-xl scale-105`
                    : "border-border bg-white hover:shadow-lg"
                }`}
              >
                <div className="text-6xl mb-4">{level.badge}</div>
                <h3 className={`text-3xl sm:text-4xl font-bold mb-4 ${
                  key === LOYALTY_DATA.level ? "text-white" : "text-foreground"
                }`}>
                  {level.name}
                </h3>
                <p className={`text-xl sm:text-2xl font-semibold mb-6 ${
                  key === LOYALTY_DATA.level ? "text-white/90" : "text-primary"
                }`}>
                  {level.discount} desconto
                </p>
                <div className={`text-lg mb-6 ${
                  key === LOYALTY_DATA.level ? "text-white/80" : "text-muted-foreground"
                }`}>
                  <p className="mb-4">
                    {key === "bronze"
                      ? "Seu primeiro passo"
                      : `Gaste a partir de R$${level.min_spend}`}
                  </p>
                  <ul className="space-y-3">
                    {level.benefits.map((benefit, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="mt-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {key === LOYALTY_DATA.level && (
                  <div className="bg-white/20 text-white font-bold text-center py-3 rounded-xl">
                    Seu Nível Atual ⭐
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border-2 border-primary/20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Pronto para ganhar mais recompensas?
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
            Comece a acumular pontos em sua próxima compra!
          </p>
          <Link to="/produtos">
            <Button className="text-xl sm:text-2xl px-12 py-4 sm:py-6 rounded-full h-auto">
              Ir para Produtos
            </Button>
          </Link>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8">
            Dúvidas Frequentes
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "Como me cadastro no programa?",
                answer:
                  "Você já é membro automaticamente ao fazer sua primeira compra conosco!",
              },
              {
                question: "Meus pontos expiram?",
                answer:
                  "Não! Seus pontos nunca expiram enquanto sua conta estiver ativa.",
              },
              {
                question: "Posso transferir pontos?",
                answer:
                  "Não, os pontos são pessoais e não podem ser transferidos para outra pessoa.",
              },
              {
                question: "Quanto tempo para chegar ao próximo nível?",
                answer:
                  "Depende do seu gasto! Com R$20 por semana, você chegaria ao Silver em ~1 ano.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border-2 border-border p-8 hover:shadow-lg transition-all"
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 flex gap-3 items-start">
                  <span className="text-primary">❓</span>
                  {faq.question}
                </h3>
                <p className="text-lg sm:text-xl text-muted-foreground pl-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
