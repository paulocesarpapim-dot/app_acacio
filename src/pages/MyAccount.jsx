import { useAuth } from "@/lib/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Star, Gift, Award, LogOut, ShoppingBag, TrendingUp } from "lucide-react";

const LEVELS = {
  bronze: { name: "Bronze", emoji: "🥉", color: "from-amber-700 to-amber-900", discount: "5%", next: "silver", nextMin: 500 },
  silver: { name: "Prata", emoji: "🥈", color: "from-gray-400 to-gray-600", discount: "10%", next: "gold", nextMin: 2000 },
  gold: { name: "Ouro", emoji: "🥇", color: "from-yellow-400 to-yellow-600", discount: "15%", next: null, nextMin: null },
};

export default function MyAccount() {
  const { user, isAuthenticated, logout, redeemPoints } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/conta" replace />;
  }

  const loyalty = user.loyalty || { points: 0, totalSpent: 0, level: "bronze", history: [] };
  const level = LEVELS[loyalty.level] || LEVELS.bronze;
  const redeemValue = Math.floor(loyalty.points / 10); // 10 points = R$1

  const handleRedeem = () => {
    if (loyalty.points < 100) return;
    const result = redeemPoints(100);
    if (result.success) {
      alert(`✅ Resgate de R$${result.discount.toFixed(2)} realizado! Informe ao finalizar compra.`);
    }
  };

  const progressToNext = level.next
    ? Math.min(100, (loyalty.totalSpent / level.nextMin) * 100)
    : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Minha Conta</h1>
          <p className="text-muted-foreground">Olá, {user.name}!</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-destructive">
          <LogOut className="w-4 h-4 mr-1" /> Sair
        </Button>
      </div>

      {/* Dados do cliente */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
          </div>
        </div>
      </div>

      {/* Card de Fidelidade */}
      <div className={`bg-gradient-to-br ${level.color} rounded-2xl p-6 text-white mb-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Programa de Fidelidade</p>
              <h3 className="font-display text-xl font-bold mt-1">Empório Filho de Deus</h3>
            </div>
            <span className="text-4xl">{level.emoji}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-white/60 text-xs">Nível</p>
              <p className="font-bold text-lg">{level.name}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs">Pontos</p>
              <p className="font-bold text-lg">{loyalty.points}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs">Desconto</p>
              <p className="font-bold text-lg">{level.discount}</p>
            </div>
          </div>

          {level.next && (
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Progresso para {LEVELS[level.next].name}</span>
                <span>R$ {loyalty.totalSpent.toFixed(0)} / R$ {level.nextMin}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progressToNext}%` }} />
              </div>
            </div>
          )}
          {!level.next && (
            <p className="text-white/80 text-sm font-semibold text-center">🏆 Nível máximo atingido!</p>
          )}
        </div>
      </div>

      {/* Ações de fidelidade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="font-bold text-2xl">{loyalty.points}</p>
          <p className="text-xs text-muted-foreground">Pontos acumulados</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="font-bold text-2xl">R$ {redeemValue}</p>
          <p className="text-xs text-muted-foreground">Disponível para resgate</p>
          {redeemValue >= 10 && (
            <Button size="sm" onClick={handleRedeem} className="mt-2 text-xs">
              Resgatar R$10
            </Button>
          )}
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="font-bold text-2xl">R$ {loyalty.totalSpent.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Total em compras</p>
        </div>
      </div>

      {/* Como funciona */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" /> Como funciona
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-muted/50 rounded-xl">
            <p className="font-bold text-primary">1. Compre</p>
            <p className="text-muted-foreground">A cada R$1 gasto, ganhe 1 ponto</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-xl">
            <p className="font-bold text-primary">2. Acumule</p>
            <p className="text-muted-foreground">Suba de nível e ganhe mais descontos</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-xl">
            <p className="font-bold text-primary">3. Resgate</p>
            <p className="text-muted-foreground">100 pontos = R$10 de desconto</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2"><span>🥉</span> <strong>Bronze:</strong> <span className="text-muted-foreground">0-499 gastos • 5% desconto</span></div>
          <div className="flex items-center gap-2"><span>🥈</span> <strong>Prata:</strong> <span className="text-muted-foreground">R$500+ gastos • 10% desconto</span></div>
          <div className="flex items-center gap-2"><span>🥇</span> <strong>Ouro:</strong> <span className="text-muted-foreground">R$2.000+ gastos • 15% desconto</span></div>
        </div>
      </div>

      {/* Histórico */}
      {loyalty.history.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> Histórico
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loyalty.history.slice().reverse().map((h, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-muted-foreground">
                    {new Date(h.date).toLocaleDateString("pt-BR")}
                  </p>
                  {h.type === "resgate" ? (
                    <p className="text-orange-600 font-semibold">Resgate de pontos</p>
                  ) : (
                    <p className="text-foreground">Compra de R$ {h.amount.toFixed(2)}</p>
                  )}
                </div>
                <span className={`font-bold ${h.points > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {h.points > 0 ? '+' : ''}{h.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/produtos">
          <Button className="rounded-xl px-8">
            <ShoppingBag className="w-4 h-4 mr-2" /> Continuar Comprando
          </Button>
        </Link>
      </div>
    </div>
  );
}
