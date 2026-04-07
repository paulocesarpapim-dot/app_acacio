import { Card } from "@/components/ui/card";

export default function PromocaoCliente() {
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
