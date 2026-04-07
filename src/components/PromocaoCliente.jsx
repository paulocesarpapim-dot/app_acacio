import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? window.location.origin : 'http://localhost:3000';

export default function PromocaoCliente() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/promotions/active`)
      .then(r => r.ok ? r.json() : [])
      .then(setPromotions)
      .catch(() => {});
  }, []);

  // Se não tem promoções ativas, mostra o card padrão
  if (promotions.length === 0) {
    return (
      <section className="w-full flex justify-center py-6 px-2">
        <Card className="max-w-2xl w-full bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-300 shadow-lg p-6 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-orange-700 mb-2">Clube de Vantagens & Promoções</h2>
          <p className="text-lg text-orange-900 mb-4">
            Faça parte do nosso clube de clientes e aproveite promoções exclusivas, descontos progressivos e ofertas especiais para quem compra sempre!
          </p>
          <ul className="text-left text-orange-800 text-base mb-4 list-disc list-inside">
            <li><b>Promoções Semanais:</b> Produtos selecionados com preços imperdíveis toda semana.</li>
            <li><b>Fidelidade:</b> A cada 10 compras, ganhe um brinde especial ou desconto extra.</li>
            <li><b>Indique e Ganhe:</b> Indique amigos e receba cupons de desconto para suas próximas compras.</li>
          </ul>
          <div className="mt-4">
            <span className="inline-block bg-orange-200 text-orange-900 px-4 py-2 rounded-full font-semibold text-sm">
              Fique atento às novidades no WhatsApp e no site!
            </span>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full py-6 px-2">
      <div className="max-w-4xl mx-auto space-y-4">
        {promotions.map(promo => (
          <div key={promo.id} className={`rounded-2xl bg-gradient-to-r ${promo.bannerColor || 'from-orange-500 to-red-500'} p-6 shadow-lg text-white`}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                {promo.bannerText ? (
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">{promo.bannerText}</h2>
                ) : (
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">{promo.title}</h2>
                )}
                {promo.description && (
                  <p className="text-white/90 text-sm sm:text-base">{promo.description}</p>
                )}
                {promo.type === 'percentage' && promo.discountPercent > 0 && (
                  <span className="inline-block mt-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-bold text-lg">
                    {promo.discountPercent}% OFF
                  </span>
                )}
                {promo.type === 'fixed' && promo.discountValue > 0 && (
                  <span className="inline-block mt-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-bold text-lg">
                    R$ {promo.discountValue.toFixed(2)} OFF
                  </span>
                )}
                {promo.endDate && (
                  <p className="text-white/70 text-xs mt-2">
                    Válido até {new Date(promo.endDate).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              {promo.productIds?.length > 0 && (
                <Link to="/produtos" className="bg-white text-gray-900 font-semibold px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors text-sm whitespace-nowrap">
                  Ver Produtos →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
