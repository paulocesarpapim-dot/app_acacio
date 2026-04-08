import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Star, DollarSign, Wrench, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const platforms = [
  {
    name: "App Atual (Vite + React)",
    logo: "⚛️",
    highlight: true,
    monthlyPrice: "R$ 0 (hospedagem Vercel gratuita)",
    transactionFee: "0%",
    pros: [
      "Sem custo mensal fixo",
      "100% customizado para o Empório",
      "WhatsApp integrado em todo o site",
      "Programa de fidelidade incluído",
      "Chatbot IA incluído",
      "Painel admin completo",
      "Sem limite de produtos",
      "SEO controlável",
    ],
    cons: [
      "Precisa de desenvolvedor para mudanças maiores",
      "Sem gateway de pagamento nativo (usa Pix manual)",
      "Backups manuais do banco JSON",
      "Hospedagem pode ter limites de uso no plano free",
    ],
    bestFor: "Empórios que querem custo zero e já tem suporte técnico disponível.",
    verdict: "recommended",
  },
  {
    name: "Nuvemshop",
    logo: "☁️",
    highlight: false,
    monthlyPrice: "R$ 0 a R$ 389/mês",
    transactionFee: "Plano grátis: 2% por venda | Pagos: 0%",
    pros: [
      "Plano gratuito disponível (Começo)",
      "Plataforma brasileira, suporte em PT-BR",
      "Integração com Mercado Pago, Pix, boleto",
      "Temas prontos e responsivos",
      "Calculadora de frete integrada (Correios, Jadlog)",
      "App para gestão pelo celular",
      "Instagram Shopping nativo",
    ],
    cons: [
      "Plano gratuito muito limitado (10 produtos, sem domínio próprio)",
      "Temas premium custam R$ 200+",
      "Customização visual limitada",
      "Programa de fidelidade requer app pago adicional (R$ 50-100/mês)",
      "Sem chatbot IA incluso",
    ],
    bestFor: "Quem quer começar rápido com cartão/pix automático e não precisa de muita customização.",
    verdict: "alternative",
  },
  {
    name: "Shopify",
    logo: "🟢",
    highlight: false,
    monthlyPrice: "US$ 39 a US$ 399/mês (~R$ 200 a R$ 2.000)",
    transactionFee: "2% se não usar Shopify Payments",
    pros: [
      "Plataforma mais robusta do mundo",
      "Milhares de apps e integrações",
      "Checkout profissional e seguro",
      "Recuperação de carrinho abandonado",
      "Relatórios avançados de vendas",
      "Multi-idioma e multi-moeda",
    ],
    cons: [
      "Custo alto em dólar (mínimo ~R$ 200/mês)",
      "Shopify Payments não disponível no Brasil (taxa extra)",
      "Customização avançada requer Liquid (linguagem própria)",
      "Maioria dos apps úteis são pagos (US$ 10-50/mês cada)",
      "Migração complexa",
      "Suporte em inglês na maioria",
    ],
    bestFor: "Lojas com faturamento acima de R$ 10.000/mês que precisam de checkout robusto e automação.",
    verdict: "overkill",
  },
  {
    name: "WordPress + WooCommerce",
    logo: "📝",
    highlight: false,
    monthlyPrice: "R$ 30 a R$ 100/mês (hospedagem)",
    transactionFee: "0% (depende do gateway)",
    pros: [
      "Open source e gratuito (software)",
      "Milhões de plugins disponíveis",
      "SEO excelente (Yoast SEO)",
      "Blog nativo e poderoso",
      "Controle total do código",
      "Comunidade enorme em PT-BR",
      "Muitos temas gratuitos para e-commerce",
    ],
    cons: [
      "Requer hospedagem e manutenção (atualizações, segurança)",
      "Performance pode ser ruim com muitos plugins",
      "Vulnerável a ataques se não atualizado",
      "Precisa configurar SSL, cache, CDN manualmente",
      "Curva de aprendizado para administrar",
      "Sem suporte oficial (depende de comunidade/freelancer)",
    ],
    bestFor: "Quem quer blog forte + loja virtual e tem alguém para manter.",
    verdict: "alternative",
  },
];

const VERDICT_BADGE = {
  recommended: { label: "✅ Recomendado", class: "bg-green-100 text-green-800 border-green-200" },
  alternative: { label: "🔄 Alternativa", class: "bg-blue-100 text-blue-800 border-blue-200" },
  overkill: { label: "⚠️ Excessivo", class: "bg-yellow-100 text-yellow-800 border-yellow-200" },
};

export default function PlataformaAnalise() {
  return (
    <div>
      <section className="bg-primary/5 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            🔍 Análise de <span className="text-primary">Plataformas</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comparação detalhada entre manter o app atual ou migrar para Shopify, Nuvemshop ou WordPress.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {platforms.map((p) => {
          const badge = VERDICT_BADGE[p.verdict];
          return (
            <div
              key={p.name}
              className={`bg-card rounded-2xl border-2 overflow-hidden ${
                p.highlight ? "border-primary shadow-lg" : "border-border"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.logo}</span>
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">{p.name}</h2>
                      {p.highlight && (
                        <span className="text-xs text-primary font-semibold">← Plataforma atual</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badge.class}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-5 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Custo mensal:</span>
                    <span className="font-semibold text-foreground">{p.monthlyPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Taxa por venda:</span>
                    <span className="font-semibold text-foreground">{p.transactionFee}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Vantagens
                    </h3>
                    <ul className="space-y-1.5">
                      {p.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Desvantagens
                    </h3>
                    <ul className="space-y-1.5">
                      {p.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Ideal para:</span> {p.bestFor}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Final Recommendation */}
        <div className="bg-primary rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground mb-3">
            💡 Nossa Recomendação
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed mb-4">
            <strong>Manter o app atual</strong> é a melhor opção neste momento. O custo é zero, já tem todas as funcionalidades essenciais (WhatsApp, fidelidade, chatbot, admin), e pode ser evoluído conforme necessário.
          </p>
          <p className="text-primary-foreground/80 text-sm max-w-2xl mx-auto leading-relaxed">
            Considere migrar para <strong>Nuvemshop (plano pago)</strong> somente quando o faturamento ultrapassar R$ 5.000/mês e você precisar de checkout com cartão de crédito automático e emissão de nota fiscal integrada.
          </p>
        </div>
      </section>
    </div>
  );
}
