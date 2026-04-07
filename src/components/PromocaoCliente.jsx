import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Gift } from "lucide-react";

const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  ? window.location.origin : 'http://localhost:3000';

export default function PromocaoCliente() {
  const [promotions, setPromotions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/promotions/active`)
      .then(r => r.ok ? r.json() : [])
      .then(setPromotions)
      .catch(() => {});
  }, []);

  // Popup aparece 1x por sessão, após 2 segundos
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('promo_popup_shown');
    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem('promo_popup_shown', '1');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPopup) return null;

  // Conteúdo padrão se não tiver promoções ativas
  const defaultContent = (
    <>
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
          <Gift className="w-7 h-7 text-orange-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-orange-700 mb-2">Clube de Vantagens & Promoções</h2>
      <p className="text-base text-orange-900 mb-4">
        Faça parte do nosso clube de clientes e aproveite promoções exclusivas, descontos progressivos e ofertas especiais para quem compra sempre!
      </p>
      <ul className="text-left text-orange-800 text-sm mb-4 list-disc list-inside space-y-1">
        <li><b>Promoções Semanais:</b> Produtos selecionados com preços imperdíveis toda semana.</li>
        <li><b>Fidelidade:</b> A cada 10 compras, ganhe um brinde especial ou desconto extra.</li>
        <li><b>Indique e Ganhe:</b> Indique amigos e receba cupons de desconto para suas próximas compras.</li>
      </ul>
      <span className="inline-block bg-orange-200 text-orange-900 px-4 py-2 rounded-full font-semibold text-sm">
        Fique atento às novidades no WhatsApp e no site!
      </span>
    </>
  );

  // Promoções ativas
  const promoContent = promotions.length > 0 ? (
    <>
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
          <Gift className="w-7 h-7 text-red-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-orange-700 mb-3">Promoções Ativas!</h2>
      <div className="space-y-3">
        {promotions.map(promo => (
          <div key={promo.id} className={`rounded-xl bg-gradient-to-r ${promo.bannerColor || 'from-orange-500 to-red-500'} p-4 text-white text-left`}>
            <h3 className="font-bold text-lg">{promo.bannerText || promo.title}</h3>
            {promo.description && <p className="text-white/90 text-sm mt-1">{promo.description}</p>}
            <div className="flex items-center gap-3 mt-2">
              {promo.type === 'percentage' && promo.discountPercent > 0 && (
                <span className="bg-white/20 text-white px-3 py-1 rounded-full font-bold text-sm">{promo.discountPercent}% OFF</span>
              )}
              {promo.type === 'fixed' && promo.discountValue > 0 && (
                <span className="bg-white/20 text-white px-3 py-1 rounded-full font-bold text-sm">R$ {promo.discountValue.toFixed(2)} OFF</span>
              )}
              {promo.endDate && (
                <span className="text-white/70 text-xs">Até {new Date(promo.endDate).toLocaleDateString('pt-BR')}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/produtos"
        onClick={() => setShowPopup(false)}
        className="inline-block mt-4 bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-orange-700 transition-colors text-sm"
      >
        Ver Produtos em Promoção →
      </Link>
    </>
  ) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setShowPopup(false)}>
      <div
        className="relative max-w-md w-full bg-gradient-to-br from-yellow-50 to-orange-100 border-2 border-yellow-300 shadow-2xl p-6 rounded-2xl text-center animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-orange-200 hover:bg-orange-300 text-orange-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {promoContent || defaultContent}
      </div>
    </div>
  );
}
