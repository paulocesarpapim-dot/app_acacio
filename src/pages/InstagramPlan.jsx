import { Calendar, Camera, ShoppingBag, MessageCircle, Heart, Star, Utensils, Sun, Users } from "lucide-react";

const ICON_MAP = {
  produto: ShoppingBag,
  receita: Utensils,
  bastidores: Camera,
  engajamento: MessageCircle,
  depoimento: Star,
  dica: Sun,
  comunidade: Users,
  emocional: Heart,
};

const contentPlan = [
  // Semana 1
  { day: 1, weekday: "Seg", type: "produto", title: "Foto do produto mais vendido", caption: "🫘 Nosso campeão de vendas! Feijão carioca selecionado, direto do sertão pra sua mesa.\n\nQualidade que faz diferença no sabor do seu prato.\n\n📲 Peça pelo WhatsApp!\n\n#EmpórioFilhoDeDeus #FeijãoCarioca #ProdutosNordestinos #SaborDoSertão", format: "Carrossel (3 fotos do produto)" },
  { day: 2, weekday: "Ter", type: "bastidores", title: "Bastidores: recebendo mercadoria", caption: "📦 Chegou mercadoria nova direto do sertão!\n\nCada produto é selecionado com carinho para garantir a melhor qualidade pra você.\n\n#Bastidores #EmpórioFilhoDeDeus #QualidadeNordestina", format: "Reels (30s mostrando pacotes chegando)" },
  { day: 3, weekday: "Qua", type: "receita", title: "Receita: Feijão Tropeiro", caption: "👨‍🍳 RECEITA: Feijão Tropeiro Tradicional\n\nIngredientes simples, sabor incrível! Todos os grãos você encontra aqui no Empório.\n\nReceita completa no nosso blog (link na bio).\n\n#ReceitaNordestina #FeijãoTropeiro #ComidaCaseira", format: "Carrossel (ingredientes + passo a passo)" },
  { day: 4, weekday: "Qui", type: "engajamento", title: "Enquete: qual feijão favorito?", caption: "🤔 E aí, qual é o seu feijão favorito?\n\nA) Carioca 🫘\nB) Preto ⚫\nC) Fradinho 🟡\nD) Mulatinho 🟤\n\nComenta aqui! 👇\n\n#Enquete #Feijão #EmpórioFilhoDeDeus", format: "Post estático com fundo colorido" },
  { day: 5, weekday: "Sex", type: "produto", title: "3 produtos para o final de semana", caption: "🛒 Kit final de semana!\n\n1️⃣ Feijão carioca\n2️⃣ Farinha de mandioca\n3️⃣ Tempero caseiro\n\nMonte o seu pedido via WhatsApp! Link na bio 📲\n\n#KitCozinha #ProdutosNordestinos #FinalDeSemana", format: "Carrossel (1 foto por produto)" },
  { day: 6, weekday: "Sáb", type: "depoimento", title: "Depoimento de cliente", caption: "⭐⭐⭐⭐⭐\n\n\"Feijão de primeiríssima qualidade! Parece que voltei pro sertão da minha avó.\" — Maria S.\n\nObrigado pela confiança! 🙏\n\n#DepoimentoReal #ClienteFeliz #EmpórioFilhoDeDeus", format: "Post com fundo texturizado + aspas" },
  { day: 7, weekday: "Dom", type: "emocional", title: "Frase do sertão", caption: "\"Quem tem saudade do sertão, tem saudade de casa.\" 🌵\n\nO sabor da nossa terra, mais perto de você.\n\nBom domingo! ☀️\n\n#SertãoNordestino #Saudade #DomingoDePaz", format: "Story com foto bonita + texto" },

  // Semana 2
  { day: 8, weekday: "Seg", type: "produto", title: "Produto em destaque: cereais", caption: "🌾 Cereais selecionados: aveia, granola, quinoa!\n\nCafé da manhã nutritivo começa aqui.\n\nEntrega rápida em São Paulo 🚚\n\n#Cereais #CaféDaManhã #VidaSaudável", format: "Foto flat lay dos cereais" },
  { day: 9, weekday: "Ter", type: "dica", title: "Dica: como conservar grãos", caption: "💡 DICA: Como conservar seus grãos por mais tempo?\n\n✅ Pote de vidro com tampa\n✅ Local seco e arejado\n✅ Longe da luz solar\n✅ Folha de louro dentro afasta carunchos\n\nSalva esse post! 📌\n\n#DicaDeCozinha #ConservaçãoDeAlimentos", format: "Carrossel educativo (1 dica por slide)" },
  { day: 10, weekday: "Qua", type: "receita", title: "Receita: Arroz com feijão perfeito", caption: "🍚🫘 A dupla imbatível: Arroz com feijão PERFEITO!\n\nSegredo? Feijão bem temperado e cozido com amor.\n\nPasso a passo nos stories! ☝️\n\n#ArrozComFeijão #ComidaBrasileira #ReceitaFácil", format: "Reels (60s time-lapse cozinhando)" },
  { day: 11, weekday: "Qui", type: "engajamento", title: "Isso ou aquilo?", caption: "🔥 ISSO ou AQUILO?\n\nFeijão tropeiro 🆚 Baião de dois\n\nQual é o melhor? Comenta! 👇\n\n#IssoOuAquilo #ComidaNordestina #Debate", format: "Post dividido ao meio com as opções" },
  { day: 12, weekday: "Sex", type: "produto", title: "Novidade: produto novo", caption: "🆕 NOVIDADE no Empório!\n\n[Nome do produto novo] acabou de chegar!\n\nSeja o primeiro a experimentar 📲\n\nPeça pelo WhatsApp (link na bio)\n\n#Novidade #ProdutoNovo #EmpórioFilhoDeDeus", format: "Foto do produto com banner 'NOVO'" },
  { day: 13, weekday: "Sáb", type: "comunidade", title: "Clientes preparando receitas", caption: "📸 VOCÊ fez, a gente mostra!\n\nManda sua foto fazendo receita com produtos do Empório que a gente posta aqui!\n\nUse #EmpórioFilhoDeDeus 💛\n\n#ComunidadeEmpório #ClientesCozinheiros", format: "Repost de cliente (pedir permissão antes)" },
  { day: 14, weekday: "Dom", type: "emocional", title: "Raízes nordestinas", caption: "🌵 De família nordestina pra família nordestina.\n\nCada grão que vendemos carrega a história de quem planta com amor lá no sertão.\n\nConheça nossa história: link na bio.\n\n#Nordeste #Raízes #OrgulhoNordestino", format: "Vídeo curto ou foto com texto emocional" },

  // Semana 3
  { day: 15, weekday: "Seg", type: "produto", title: "Combo da semana", caption: "📢 COMBO DA SEMANA!\n\n🫘 Feijão carioca 1kg\n🌽 Farinha de milho 500g\n🧄 Alho roxo 200g\n\nTudo por R$ XX,XX!\n\nVálido até sexta. Peça agora! 📲\n\n#ComboDaSemana #PromoçãoEmpório #Economia", format: "Post com preço destacado" },
  { day: 16, weekday: "Ter", type: "bastidores", title: "Dia a dia no empório", caption: "🏪 Um dia no Empório Filho de Deus!\n\nOrganizando prateleiras, separando pedidos e preparando tudo com carinho pra você.\n\n#DiaADia #Bastidores #TrabalhoComAmor", format: "Reels com música (30s do cotidiano)" },
  { day: 17, weekday: "Qua", type: "receita", title: "Receita: Cuscuz nordestino", caption: "🌽 CUSCUZ NORDESTINO com manteiga e ovo!\n\nO café da manhã que alimenta a alma.\n\nIngredientes:\n- Flocos de milho\n- Água e sal\n- Manteiga e ovo\n\nReceita completa no blog!\n\n#Cuscuz #CaféNordestino #ComidaDeVerdade", format: "Carrossel com fotos do preparo" },
  { day: 18, weekday: "Qui", type: "dica", title: "Benefícios dos grãos", caption: "💪 Por que comer grãos todo dia?\n\n✅ Ricos em fibra\n✅ Proteína vegetal\n✅ Baixo custo\n✅ Versáteis nas receitas\n✅ Saciam a fome por mais tempo\n\nInclua na sua dieta! 🫘\n\n#Saúde #Nutrição #GrãosNordestinos", format: "Infográfico simples" },
  { day: 19, weekday: "Sex", type: "produto", title: "Presente para quem cozinha", caption: "🎁 Presente perfeito pra quem ama cozinhar!\n\nMonte uma cesta com produtos do Empório:\n🫘 Feijão especial\n🌿 Ervas finas\n🧂 Tempero caseiro\n\nA gente monta pra você! 📲\n\n#CestaPresente #PresenteCriativo", format: "Foto de cesta montada" },
  { day: 20, weekday: "Sáb", type: "depoimento", title: "Vídeo de cliente satisfeito", caption: "🎥 Olha o que o João falou!\n\n\"Compro toda semana, os grãos são frescos e o preço é justo!\"\n\nObrigado, João! Clientes assim fazem tudo valer a pena 🙏\n\n#ClienteFeliz #Depoimento #Confiança", format: "Reels com vídeo do cliente (pedir)" },
  { day: 21, weekday: "Dom", type: "emocional", title: "Família reunida na cozinha", caption: "👨‍👩‍👧‍👦 Domingo é dia de família reunida na cozinha.\n\nE quando tem feijão bom, o almoço fica ainda melhor.\n\nBom apetite! 🍽️\n\n#FamíliaReunida #AlmoçoDeDomingo #Tradição", format: "Foto aconchegante de mesa posta" },

  // Semana 4
  { day: 22, weekday: "Seg", type: "produto", title: "Reposição: mais vendidos da semana", caption: "🔥 REPOSIÇÃO! Os mais vendidos da semana:\n\n1️⃣ Feijão carioca\n2️⃣ Farinha de mandioca\n3️⃣ Milho de pipoca\n\nGaranta o seu antes que acabe! 📲\n\n#MaisVendidos #Reposição #CorreQueAcaba", format: "Post com ranking visual" },
  { day: 23, weekday: "Ter", type: "dica", title: "Dica: tempo de cozimento", caption: "⏱️ TABELA: Tempo de cozimento dos grãos\n\n🫘 Feijão carioca: 25min (pressão)\n⚫ Feijão preto: 30min\n🟡 Grão-de-bico: 20min\n🟤 Lentilha: 15min\n🫛 Ervilha: 20min\n\nSalva pra consultar depois! 📌\n\n#DicaÚtil #Cozinha #TempoCerto", format: "Infográfico tabela" },
  { day: 24, weekday: "Qua", type: "receita", title: "Receita: Baião de dois", caption: "🍛 BAIÃO DE DOIS — prato completo!\n\nArroz + feijão de corda + queijo coalho + calabresa.\n\nO prato mais amado do Nordeste agora na sua cozinha em SP!\n\nReceita no blog 📖\n\n#BaiãoDeDois #ReceitaNordestina #SaborDoCeará", format: "Reels de preparo (45s)" },
  { day: 25, weekday: "Qui", type: "engajamento", title: "Complete a frase", caption: "✍️ Complete a frase:\n\n\"Feijão bom é feijão que ___________\"\n\nAs melhores respostas vão pro stories! 🏆\n\n#Complete #Brincadeira #EmpórioFilhoDeDeus", format: "Post interativo com fundo divertido" },
  { day: 26, weekday: "Sex", type: "produto", title: "Oferta relâmpago sexta", caption: "⚡ OFERTA RELÂMPAGO DE SEXTA!\n\n[Produto] com XX% de desconto!\n\nSó hoje, até acabar o estoque!\n\nPeça agora 📲 WhatsApp na bio\n\n#OfertaRelâmpago #SextaFeira #Desconto", format: "Post com timer visual e preço" },
  { day: 27, weekday: "Sáb", type: "comunidade", title: "Perguntas e respostas", caption: "❓ PERGUNTAS & RESPOSTAS\n\nVocê pergunta, a gente responde!\n\nManda sua dúvida nos comentários sobre:\n🫘 Produtos\n🚚 Entrega\n📦 Pedidos\n💰 Preços\n\n#PerguntaEResponde #FAQ #Atendimento", format: "Stories - caixa de perguntas" },
  { day: 28, weekday: "Dom", type: "emocional", title: "Agradecimento mensal", caption: "🙏 OBRIGADO!\n\nMais um mês incrível graças a vocês.\n\nCada pedido, cada mensagem, cada receita compartilhada faz o Empório Filho de Deus crescer.\n\nSomos família! 💛\n\n#Gratidão #Obrigado #FamíliaEmpório", format: "Vídeo do dono agradecendo (15s)" },
  { day: 29, weekday: "Seg", type: "produto", title: "Preview do próximo mês", caption: "👀 SPOILER: O que vem por aí no Empório?\n\nNovos produtos chegando...\n\nFica de olho! Ativa o sininho 🔔\n\n#Spoiler #Novidades #FiqueLigado", format: "Post com imagem borrada/mistério" },
  { day: 30, weekday: "Ter", type: "dica", title: "Resumão do mês", caption: "📊 RESUMÃO DO MÊS:\n\n🫘 Produto mais vendido: [X]\n👨‍🍳 Receita favorita: [X]\n⭐ Nota dos clientes: 5/5\n📦 Pedidos entregues: [X]\n\nMês que vem tem mais! 🚀\n\n#ResumoDoMês #Resultados #Crescendo", format: "Carrossel com dados visuais" },
];

const TYPE_COLORS = {
  produto: "bg-blue-100 text-blue-800",
  receita: "bg-orange-100 text-orange-800",
  bastidores: "bg-purple-100 text-purple-800",
  engajamento: "bg-green-100 text-green-800",
  depoimento: "bg-yellow-100 text-yellow-800",
  dica: "bg-cyan-100 text-cyan-800",
  comunidade: "bg-pink-100 text-pink-800",
  emocional: "bg-red-100 text-red-800",
};

const TYPE_LABELS = {
  produto: "Produto",
  receita: "Receita",
  bastidores: "Bastidores",
  engajamento: "Engajamento",
  depoimento: "Depoimento",
  dica: "Dica",
  comunidade: "Comunidade",
  emocional: "Emocional",
};

export default function InstagramPlan() {
  return (
    <div>
      <section className="bg-primary/5 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            📱 Plano de Conteúdo <span className="text-primary">Instagram</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            30 dias de conteúdo planejado para o Instagram do Empório Filho de Deus. 
            Copie as legendas e adapte conforme necessário!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <span key={key} className={`text-xs font-medium px-3 py-1 rounded-full ${TYPE_COLORS[key]}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-4">
          {contentPlan.map((item) => {
            const Icon = ICON_MAP[item.type] || Calendar;
            return (
              <details key={item.day} className="group bg-card rounded-xl border border-border overflow-hidden">
                <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {item.day}
                  </span>
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{item.weekday}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type]}`}>
                        {TYPE_LABELS[item.type]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mt-0.5 truncate">{item.title}</h3>
                  </div>
                  <span className="text-muted-foreground text-xs group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">📝 Legenda:</p>
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 font-sans leading-relaxed">
                      {item.caption}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">🎨 Formato:</p>
                    <p className="text-sm text-muted-foreground">{item.format}</p>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
