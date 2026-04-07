import { Gift, Zap, Crown, Award, TrendingUp, Sparkles, Phone, Mail, MessageCircle, MapPin, Rocket, Users, Lightbulb, Bell } from "lucide-react";
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
      "Brinde no aniversário + R$20 em cupom",
      "Frete grátis em compras acima de R$50",
      "Acesso a promoções exclusivas",
      "Dobro de pontos em datas especiais",
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
      "Brinde especial no aniversário + R$50 em pontos extras",
      "Frete grátis em qualquer compra",
      "Atendimento prioritário por telefone",
      "Convite para eventos exclusivos do Empório",
      "Triplicado de pontos em períodos promocionais",
    ],
    badge: "🏆",
    color: "from-yellow-500 to-yellow-600",
  },
};

export default function LoyaltyProgram() {
  const currentLevel = LOYALTY_LEVELS[LOYALTY_DATA.level];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-5xl sm:text-6xl mb-4">{currentLevel.badge}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Programa Empório Amigos
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

        {/* Resgate de Pontos */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-primary" />
            Resgate de Pontos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { points: "100", discount: "R$10", icon: "🎫" },
              { points: "500", discount: "R$50", icon: "🎟️" },
              { points: "1.000", discount: "R$100", icon: "🏷️" },
            ].map((item) => (
              <div
                key={item.points}
                className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-8 text-center hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <p className="text-4xl sm:text-5xl font-bold text-green-700 mb-2">{item.points}</p>
                <p className="text-lg text-muted-foreground mb-2">pontos</p>
                <div className="text-3xl mb-2">=</div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{item.discount}</p>
                <p className="text-lg text-muted-foreground">de desconto</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefícios Especiais */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Gift className="w-10 h-10 text-primary" />
            Benefícios Especiais
          </h2>

          {/* Bônus de Aniversário */}
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">🎂 Bônus de Aniversário</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { level: "🥉 Bronze", bonus: "Brinde surpresa", color: "from-amber-50 to-amber-100 border-amber-200" },
                { level: "🥈 Prata", bonus: "Brinde surpresa + R$20 em cupom", color: "from-slate-50 to-slate-100 border-slate-300" },
                { level: "🏆 Ouro", bonus: "Brinde especial + R$50 em pontos extras", color: "from-yellow-50 to-yellow-100 border-yellow-300" },
              ].map((item) => (
                <div key={item.level} className={`rounded-2xl bg-gradient-to-br ${item.color} border-2 p-6`}>
                  <p className="text-xl font-bold text-foreground mb-2">{item.level}</p>
                  <p className="text-lg text-muted-foreground">{item.bonus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Promoções Sazonais */}
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">📅 Promoções Sazonais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { event: "Black Friday", bonus: "2x pontos para todos", icon: "🖤" },
                { event: "Natal", bonus: "2x pontos para todos + Brinde", icon: "🎄" },
                { event: "Dia da Mãe/Pai", bonus: "1.5x pontos", icon: "💝" },
                { event: "Aniversário do Empório", bonus: "3x pontos para clientes Ouro", icon: "🎉" },
              ].map((item) => (
                <div key={item.event} className="rounded-2xl bg-white border-2 border-primary/20 p-6 flex gap-4 items-center hover:shadow-md transition-all">
                  <span className="text-4xl">{item.icon}</span>
                  <div>
                    <p className="text-xl font-bold text-foreground">{item.event}</p>
                    <p className="text-lg text-muted-foreground">{item.bonus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primeira Compra */}
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 p-8 flex gap-6 items-center">
            <span className="text-5xl">🎁</span>
            <div>
              <p className="text-2xl font-bold text-foreground">Primeira Compra</p>
              <p className="text-lg text-muted-foreground">Novos clientes ganham <strong className="text-primary">50 pontos bônus</strong> na primeira compra!</p>
            </div>
          </div>
        </div>

        {/* Dicas para Ganhar Mais Pontos */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Lightbulb className="w-10 h-10 text-primary" />
            Dicas para Ganhar Mais Pontos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { tip: "Programe suas compras", desc: "Compre mais em períodos de 2x/3x de pontos", icon: "📋" },
              { tip: "Indique amigos", desc: "Você e seu amigo ganham 100 pontos extras na primeira compra do amigo", icon: "👥" },
              { tip: "Combine promoções", desc: "Use descontos do nível + dobro de pontos", icon: "🔄" },
              { tip: "Acompanhe eventos", desc: "Fique atento a promoções especiais via WhatsApp", icon: "📱" },
            ].map((item) => (
              <div key={item.tip} className="rounded-2xl bg-white border-2 border-border p-8 hover:shadow-lg transition-all">
                <div className="flex gap-4 items-start">
                  <span className="text-4xl">{item.icon}</span>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-2">{item.tip}</p>
                    <p className="text-lg text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
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
                question: "Preciso fazer algo especial para ser membro?",
                answer: "Não! Você já é membro automaticamente. Basta fazer sua primeira compra!",
              },
              {
                question: "Meus pontos expiram?",
                answer: "Não! Seus pontos nunca expiram enquanto sua conta estiver ativa.",
              },
              {
                question: "Posso usar pontos e desconto do nível juntos?",
                answer: "Sim! O desconto do nível é automático em todas as compras, e você pode resgatar pontos adicionais.",
              },
              {
                question: "Quanto tempo para chegar ao nível Prata?",
                answer: "Comprando R$50 por semana, você chegaria ao Prata em aproximadamente 20 semanas (5 meses).",
              },
              {
                question: "Posso transferir pontos para outra pessoa?",
                answer: "Não, os pontos são pessoais e intransferíveis.",
              },
              {
                question: "Como vejo meus pontos?",
                answer: 'Acesse sua conta e clique em "Minha Fidelidade" para ver saldo, histórico e próximos benefícios.',
              },
              {
                question: "Posso trocar pontos por produtos específicos?",
                answer: "Atualmente oferecemos apenas conversão em desconto. Em breve, teremos catálogo de produtos e brindes resgatáveis!",
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

        {/* Acompanhe Seus Pontos */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Bell className="w-10 h-10 text-primary" />
            Acompanhe Seus Pontos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { method: "Portal Online", desc: "Acesse sua conta no site", icon: "🌐" },
              { method: "WhatsApp", desc: "Envie \"Meus pontos\" para nosso atendimento", icon: "📱" },
              { method: "Email", desc: "Receba extrato mensal", icon: "📧" },
              { method: "Telefone", desc: "(86) 99999-9999", icon: "☎️" },
            ].map((item) => (
              <div key={item.method} className="rounded-2xl bg-white border-2 border-border p-6 text-center hover:shadow-lg transition-all">
                <span className="text-4xl block mb-3">{item.icon}</span>
                <p className="text-lg font-bold text-foreground mb-1">{item.method}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas Melhorias */}
        <div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Rocket className="w-10 h-10 text-primary" />
            Próximas Melhorias
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { feature: "Catálogo de Brindes", desc: "Resgate pontos por itens exclusivos" },
              { feature: "Programa de Referência", desc: "Ganhe mais pontos indicando amigos" },
              { feature: "App Móvel Dedicado", desc: "Acompanhe pontos via smartphone" },
              { feature: "Parcerias", desc: "Use pontos em lojas parceiras" },
              { feature: "Convites a Eventos", desc: "Clientes Ouro terão acesso a eventos especiais" },
            ].map((item) => (
              <div key={item.feature} className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/10 p-6 flex gap-4 items-center">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="text-lg font-bold text-foreground">{item.feature}</p>
                  <p className="text-base text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contato e Suporte */}
        <div className="rounded-3xl bg-gradient-to-r from-primary to-accent text-white p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">📞 Contato e Suporte</h2>
          <p className="text-xl text-center text-white/90 mb-8">Dúvidas sobre o programa?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: "WhatsApp", value: "(86) 99999-9999", icon: "📱" },
              { label: "Telefone", value: "(86) 3222-1111", icon: "☎️" },
              { label: "Email", value: "fidelidade@casadonorte.com.br", icon: "📧" },
              { label: "Chat ao Vivo", value: "Disponível no site", icon: "💬" },
              { label: "Visite a Loja", value: "Rua Principal, Teresina-PI", icon: "📍" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-5 text-center">
                <span className="text-3xl block mb-2">{item.icon}</span>
                <p className="font-bold text-lg">{item.label}</p>
                <p className="text-white/80 text-sm">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/80 mt-8 text-lg">Empório Amigos: Porque você merece ser recompensado! 💚</p>
        </div>
      </div>
    </div>
  );
}
