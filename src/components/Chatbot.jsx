import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, ShoppingBag, Truck, CreditCard, Phone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '@/api/productService';

const WA_NUMBER = '5511957800711';
const QUICK_ACTIONS = [
  { id: 'products', label: '🛍️ Ver Produtos', icon: ShoppingBag },
  { id: 'delivery', label: '🚚 Entrega', icon: Truck },
  { id: 'payment', label: '💳 Pagamento', icon: CreditCard },
  { id: 'whatsapp', label: '📱 Falar no Zap', icon: Phone },
];

const RESPONSES = {
  greeting: `Olá! 👋 Seja bem-vindo ao *Empório Filho de Deus*!\n\nSou o assistente virtual. Posso te ajudar com:`,
  products_list: `Aqui estão nossas categorias disponíveis:\n\n🫘 Feijão · 🌾 Cereais\n\nClique em **Ver Produtos** para ver o catálogo completo!`,
  delivery: `🚚 *Informações de Entrega:*\n\n• Entregamos em toda a cidade\n• Pedidos pelo WhatsApp ou pelo carrinho\n• Frete calculado conforme endereço\n• Prazo médio: 1 a 2 dias úteis\n\nDúvidas? Fale direto no WhatsApp! 📱`,
  payment: `💳 *Formas de Pagamento:*\n\n• PIX (desconto especial!)\n• Cartão de crédito ou débito\n• Dinheiro na entrega\n• Transferência bancária\n\nPara mais detalhes, fale conosco pelo WhatsApp!`,
  whatsapp: `📱 *Fale conosco agora!*\n\nNosso atendimento é rápido e personalizado. Clique abaixo para abrir o WhatsApp!`,
  hours: `🕐 *Horário de Atendimento:*\n\n• Segunda a Sábado: 8h às 18h\n• Domingo: 8h às 12h\n\nFora do horário? Deixe sua mensagem, retornaremos em breve! 😊`,
  promotions: `🎉 *Promoções especiais!*\n\nFale com a gente no WhatsApp para saber as ofertas do dia. Sempre temos novidades chegando!`,
  about: `🏪 *Empório Filho de Deus*\n\nTrazemos os melhores produtos nordestinos direto para sua mesa. Tudo artesanal, selecionado com carinho e qualidade garantida.\n\n🌵 Sabor autêntico do sertão!`,
  default: `Não entendi direito, mas posso te ajudar! 😊\n\nEscolha uma das opções abaixo ou fale conosco pelo WhatsApp para atendimento personalizado.`,
};

function getResponse(msg) {
  const m = msg.toLowerCase();
  if (/\b(oi|olá|ola|bom dia|boa tarde|boa noite|hey|ola|eai|e aí)\b/.test(m)) return { type: 'greeting' };
  if (/produto|catálogo|catalogo|item|vend|comprar|tem|disponível|disponivel/.test(m)) return { type: 'products' };
  if (/entrega|frete|envio|prazo|chega|receber|endereço/.test(m)) return { type: 'delivery' };
  if (/paga|preço|preco|valor|pix|cartão|cartao|dinheiro|parcel/.test(m)) return { type: 'payment' };
  if (/whatsapp|zap|zapzap|contato|falar|atend|telefone|ligar/.test(m)) return { type: 'whatsapp' };
  if (/horário|horario|hora|funciona|aberto|fechado|domingo/.test(m)) return { type: 'hours' };
  if (/promo|oferta|desconto|promoção|promocao|barato/.test(m)) return { type: 'promotions' };
  if (/quem|empresa|loja|sobre|história|historia|vocês/.test(m)) return { type: 'about' };
  return { type: 'default' };
}

function BotMessage({ text, products, showWA, showProducts }) {
  const lines = text.split('\n');
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 text-sm max-w-[85%] leading-relaxed whitespace-pre-line shadow-sm">
        {lines.map((line, i) => {
          const bold = line.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
          return <span key={i} dangerouslySetInnerHTML={{ __html: bold }} className="block" />;
        })}
      </div>

      {/* Produtos em miniatura */}
      {products && products.length > 0 && (
        <div className="flex flex-col gap-1.5 max-w-[90%]">
          {products.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to={`/produto/${p.id}`}
              className="flex items-center gap-2 bg-white border border-orange-100 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors shadow-sm"
            >
              {p.image_url && (
                <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-orange-600 font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                </p>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </Link>
          ))}
          <Link
            to="/produtos"
            className="text-xs text-orange-600 font-semibold hover:underline text-center py-1"
          >
            Ver todos os produtos →
          </Link>
        </div>
      )}

      {/* Botão WhatsApp */}
      {showWA && (
        <a
          href={`https://wa.me/${WA_NUMBER}?text=Olá! Gostaria de mais informações sobre os produtos.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors w-fit shadow"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Abrir WhatsApp agora
        </a>
      )}

      {/* Link catálogo */}
      {showProducts && (
        <Link
          to="/produtos"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors w-fit shadow"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Ver catálogo completo
        </Link>
      )}
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', responseType: 'greeting', text: RESPONSES.greeting, showQuickActions: true },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProducts().then(setAllProducts).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotMessage = (responseType, userText = '') => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let text = RESPONSES[responseType] || RESPONSES.default;
      let products = null;
      let showWA = false;
      let showProducts = false;

      if (responseType === 'products') {
        // Busca produtos relacionados ao que o usuário digitou
        const query = userText.toLowerCase();
        const matched = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
        );
        products = matched.length > 0 ? matched : allProducts.slice(0, 3);
        text = matched.length > 0
          ? `Encontrei ${matched.length} produto(s) para você! 🛍️`
          : RESPONSES.products_list;
        showProducts = true;
      }
      if (responseType === 'whatsapp') showWA = true;
      if (responseType === 'default') showWA = true;
      if (responseType === 'promotions') showWA = true;

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: 'bot', responseType, text, products, showWA, showProducts },
      ]);
    }, 700);
  };

  const handleQuickAction = (actionId) => {
    const labels = { products: '🛍️ Ver Produtos', delivery: '🚚 Entrega', payment: '💳 Pagamento', whatsapp: '📱 Falar no Zap' };
    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', text: labels[actionId] }]);
    const map = { products: 'products', delivery: 'delivery', payment: 'payment', whatsapp: 'whatsapp' };
    addBotMessage(map[actionId]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', text }]);
    setInputValue('');
    const { type } = getResponse(text);
    addBotMessage(type, text);
  };

  return (
    <>
      {/* Botão flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 duration-300"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Janela do chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 h-[32rem] bg-gray-50 rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm leading-tight">Assistente Empório FD</h3>
              <p className="text-xs opacity-80">🟢 Online agora</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1.5 rounded-lg transition"
              aria-label="Fechar chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'user' ? (
                  <div className="bg-orange-600 text-white rounded-2xl rounded-br-none px-4 py-2.5 text-sm max-w-[80%] shadow-sm">
                    {msg.text}
                  </div>
                ) : (
                  <BotMessage
                    text={msg.text}
                    products={msg.products}
                    showWA={msg.showWA}
                    showProducts={msg.showProducts}
                  />
                )}
              </div>
            ))}

            {/* Ações rápidas após a saudação */}
            {messages[messages.length - 1]?.showQuickActions && (
              <div className="flex flex-col gap-2 pl-0">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex items-center gap-2 bg-white border border-orange-200 hover:bg-orange-50 hover:border-orange-400 text-gray-700 text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm text-left"
                  >
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Indicador de digitação */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Digite sua pergunta..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl p-2 transition"
                aria-label="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              Empório Filho de Deus · Atendimento via chat
            </p>
          </div>
        </div>
      )}
    </>
  );
}
