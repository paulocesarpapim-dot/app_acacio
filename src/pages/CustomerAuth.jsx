import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Lock, LogIn, UserPlus } from "lucide-react";

export default function CustomerAuth() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/minha-conta" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!form.name || !form.email || !form.phone || !form.password) {
          setError("Preencha todos os campos");
          return;
        }
        if (form.password.length < 4) {
          setError("Senha deve ter no mínimo 4 caracteres");
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("As senhas não coincidem");
          return;
        }
        const result = await register(form.name, form.email, form.phone, form.password);
        if (result.error) {
          setError(result.error);
        } else {
          navigate("/minha-conta");
        }
      } else {
        if (!form.email || !form.password) {
          setError("Preencha e-mail e senha");
          return;
        }
        const result = await login(form.email, form.password);
        if (result.error) {
          setError(result.error);
        } else {
          navigate("/minha-conta");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
        {/* Tabs */}
        <div className="flex mb-6 bg-muted rounded-xl p-1">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
          >
            <LogIn className="w-4 h-4 inline mr-1" /> Entrar
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "register" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
          >
            <UserPlus className="w-4 h-4 inline mr-1" /> Cadastrar
          </button>
        </div>

        <h1 className="font-display text-2xl font-bold text-center mb-1">
          {mode === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "login" ? "Entre para acessar seus benefícios" : "Cadastre-se e ganhe pontos de fidelidade"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Telefone/WhatsApp"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="pl-10"
                />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="pl-10"
            />
          </div>
          {mode === "register" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Confirmar senha"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base font-bold">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar Conta"}
          </Button>
        </form>

        {mode === "register" && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-center text-primary font-semibold">
              🎁 Ao se cadastrar, você entra automaticamente no programa de fidelidade e acumula pontos a cada compra!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
