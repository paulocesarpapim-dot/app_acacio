import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CHATBOT_RESPONSES = {
  greetings: [
    'Olá! 👋 Como posso ajudá-lo hoje?',
    'Bem-vindo à Casa do Norte Filho de Deus! 🎉 Como posso servir?',
  ],
  products: [
    'Temos mais de 100 produtos nordestinos disponíveis! 🛍️ Gostaria de ver queijos, rapaduras, cereais ou outras categorias?',
  ],
  delivery: [
    'Realizamos entregas em todo Brasil! 📦 Quanto melhor a quantidade, mais vantajoso o frete!',
  ],
  payment: [
    'Aceitamos todos os cartões de crédito, débito e PIX! 💳 Parcelamento em até 12x disponível.',
  ],
  whatsapp: [
    'Você pode falar conosco pelo WhatsApp! 📱 Será um prazer atendê-lo em tempo real.',
  ],
  default: [
    'Entendi sua pergunta! 🤔 Gostaria de saber mais sobre nossos produtos, frete ou pagamento?',
    'Ótima pergunta! 💭 Posso ajudar com informações sobre produtos, entrega ou dúvidas gerais.',
  ],
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! 👋 Bem-vindo à Casa do Norte Filho de Deus. Como posso ajudá-lo?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage) => {
    const lowercaseMessage = userMessage.toLowerCase();

    if (
      lowercaseMessage.includes('oi') ||
      lowercaseMessage.includes('olá') ||
      lowercaseMessage.includes('e aí')
    ) {
      return CHATBOT_RESPONSES.greetings[
        Math.floor(Math.random() * CHATBOT_RESPONSES.greetings.length)
      ];
    }
    if (
      lowercaseMessage.includes('produto') ||
      lowercaseMessage.includes('catálogo') ||
      lowercaseMessage.includes('vend')
    ) {
      return CHATBOT_RESPONSES.products[0];
    }
    if (
      lowercaseMessage.includes('entrega') ||
      lowercaseMessage.includes('frete') ||
      lowercaseMessage.includes('envio')
    ) {
      return CHATBOT_RESPONSES.delivery[0];
    }
    if (
      lowercaseMessage.includes('paga') ||
      lowercaseMessage.includes('preço') ||
      lowercaseMessage.includes('valor')
    ) {
      return CHATBOT_RESPONSES.payment[0];
    }
    if (
      lowercaseMessage.includes('whatsapp') ||
      lowercaseMessage.includes('conversa')
    ) {
      return CHATBOT_RESPONSES.whatsapp[0];
    }
    return CHATBOT_RESPONSES.default[
      Math.floor(Math.random() * CHATBOT_RESPONSES.default.length)
    ];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response with delay
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        text: getResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 duration-300"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base">Assistente Virtual</h3>
              <p className="text-xs opacity-90">Sempre online para ajudar! 🤖</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-orange-600 p-1 rounded transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Escreva sua pergunta..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg p-2 transition"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
