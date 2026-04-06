import { Gift, TrendingUp, Award, Calendar, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Mock data - Em produção, virá da API/autenticação do usuário
const USER_LOYALTY = {
  name: "João Silva",
  level: "silver",
  points: 2850,
  points_available_for_redemption: 2800,
  next_reward_at: 100,
  lifetime_spent: 2850,
  member_since: "2024-01-15",
  birthday: "2024-06-15",
  last_purchases: [
    { date: "2024-04-05", amount: 125.50, points_earned: 125 },
    { date: "2024-03-28", amount: 89.90, points_earned: 89 },
    { date: "2024-03-15", amount: 245.00, points_earned: 245 },
  ],
};

export default function LoyaltyCard() {
  const pointsUntilReward = USER_LOYALTY.points - USER_LOYALTY.points_available_for_redemption;
  const redeemableRewards = Math.floor(USER_LOYALTY.points_available_for_redemption / 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Cartão Principal */}
      <div className="rounded-3xl gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 p-8 sm:p-12 mb-12 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-muted-foreground text-lg sm:text-xl mb-2">Bem-vindo,</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
              {USER_LOYALTY.name}
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-4xl">🥈</span>
              <span className="text-xl sm:text-2xl font-semibold text-foreground">
                Cliente Prata
              </span>
            </div>
          </div>

          {/* Pontos Principais */}
          <div className="rounded-2xl bg-gradient-to-br from-primary to-accent text-white p-8">
            <p className="text-lg sm:text-xl opacity-90 mb-2">Seus Pontos</p>
            <p className="text-5xl sm:text-6xl font-bold">
              {USER_LOYALTY.points.toLocaleString()}
            </p>
            <p className="text-sm sm:text-base opacity-75 mt-4">
              {redeemableRewards} recompensas de R$10 disponíveis
            </p>
          </div>
        </div>

        {/* Progresso para Próximo Resgate */}
        <div className="rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-yellow-600" />
              <span className="text-lg sm:text-xl font-semibold text-foreground">
                Próxima Recompensa
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {pointsUntilReward}/100
            </span>
          </div>
          <div className="w-full bg-yellow-500/20 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${(pointsUntilReward / 100) * 100}%` }}
            />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-3">
            Faltam apenas {USER_LOYALTY.next_reward_at - pointsUntilReward} pontos para sua próxima recompensa!
          </p>
        </div>
      </div>

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {/* Total Gasto */}
        <div className="rounded-2xl bg-white border-2 border-border p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm sm:text-base mb-2">Total Gasto</p>
              <p className="text-4xl sm:text-5xl font-bold text-foreground">
                R${USER_LOYALTY.lifetime_spent.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-primary/50" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Desde {USER_LOYALTY.member_since.split('-')[0]}
          </p>
        </div>

        {/* Membro Desde */}
        <div className="rounded-2xl bg-white border-2 border-border p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm sm:text-base mb-2">Membro Desde</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {new Date(USER_LOYALTY.member_since).toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-primary/50" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Há {Math.floor((Date.now() - new Date(USER_LOYALTY.member_since).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses
              </p>
        </div>

        {/* Próximo Benefício */}
        <div className="rounded-2xl bg-white border-2 border-border p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm sm:text-base mb-2">Próximo Benefício</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                Aniversário
              </p>
            </div>
            <Star className="w-12 h-12 text-primary/50" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Você receberá R$50 em pontos no seu aniversário!
          </p>
        </div>
      </div>

      {/* Últimas Compras e Pontos Ganhos */}
      <div className="rounded-3xl bg-white border-2 border-border p-8 sm:p-12 mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Award className="w-8 h-8" />
          Últimas Compras
        </h2>
        <div className="space-y-4">
          {USER_LOYALTY.last_purchases.map((purchase, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-slate-50 to-transparent border border-border hover:shadow-md transition-all"
            >
              <div>
                <p className="text-lg sm:text-xl font-semibold text-foreground">
                  {new Date(purchase.date).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Compra realizada
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  R${purchase.amount.toFixed(2)}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  +{purchase.points_earned} pontos
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link to="/fidelidade">
          <Button className="w-full text-lg sm:text-xl py-6 sm:py-8 rounded-2xl h-auto">
            Ver Programa Completo
          </Button>
        </Link>
        <Link to="/produtos">
          <Button
            variant="outline"
            className="w-full text-lg sm:text-xl py-6 sm:py-8 rounded-2xl h-auto"
          >
            Continuar Comprando
          </Button>
        </Link>
      </div>
    </div>
  );
}
