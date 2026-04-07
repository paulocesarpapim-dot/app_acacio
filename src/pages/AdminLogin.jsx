import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, AlertCircle } from "lucide-react";
import { ADMIN_TOKEN_KEY } from "@/lib/admin-session";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Senha incorreta. Tente novamente.");
        setPassword("");
      } else {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        navigate("/admin");
      }
    } catch {
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Área Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Digite a senha para continuar</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 flex gap-2 items-center">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verificando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
