import { useState } from "react";
import { Settings, X, Eye, Zap, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/context/AccessibilityContext";

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, setFontSize, highContrast, setHighContrast, reducedMotion, setReducedMotion } =
    useAccessibility();

  const fontSizeOptions = [
    { label: "Normal", value: "normal" },
    { label: "Grande", value: "large" },
    { label: "Muito Grande", value: "xlarge" },
  ];

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Abrir configurações de acessibilidade"
        title="Acessibilidade"
      >
        <Settings className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      {/* Modal de Acessibilidade */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Painel */}
          <div className="relative w-full sm:w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl p-8 sm:p-10 max-h-[90vh] sm:max-h-auto overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
                <Settings className="w-8 h-8 sm:w-10 sm:h-10" />
                Acessibilidade
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Tamanho da Fonte */}
            <div className="mb-10 pb-8 border-b-2 border-border">
              <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Eye className="w-7 h-7 text-primary" />
                Tamanho da Letra
              </h3>

              <div className="space-y-4">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFontSize(option.value)}
                    className={`w-full p-6 sm:p-8 rounded-2xl border-3 transition-all text-left ${
                      fontSize === option.value
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          fontSize === option.value ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                        } text-foreground`}
                      >
                        {option.label}
                      </span>
                      {fontSize === option.value && (
                        <span className="text-2xl">✓</span>
                      )}
                    </div>
                    <p className={`mt-2 text-muted-foreground ${
                      fontSize === option.value ? "text-lg sm:text-xl" : "text-base sm:text-lg"
                    }`}>
                      Visualizar exemplo
                    </p>
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-slate-50 border-2 border-border">
                <p className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  Exemplo de texto
                </p>
                <p className={`${
                  fontSize === "normal"
                    ? "text-base"
                    : fontSize === "large"
                    ? "text-lg"
                    : "text-2xl"
                } text-muted-foreground`}>
                  Você está vendo como o site ficará com este tamanho de letra.
                </p>
              </div>
            </div>

            {/* Alto Contraste */}
            <div className="mb-10 pb-8 border-b-2 border-border">
              <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Zap className="w-7 h-7 text-primary" />
                Alto Contraste
              </h3>

              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full p-6 sm:p-8 rounded-2xl border-3 transition-all flex items-center justify-between ${
                  highContrast
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="text-2xl sm:text-3xl font-semibold text-foreground text-left">
                    {highContrast ? "Ativado" : "Desativado"}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground text-left mt-2">
                    {highContrast
                      ? "Cores mais fortes para melhor legibilidade"
                      : "Ativar para cores mais fortes"}
                  </p>
                </div>
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                    highContrast ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {highContrast ? "ON" : "OFF"}
                </div>
              </button>

              {highContrast && (
                <div className="mt-4 p-4 bg-yellow-100 border-2 border-yellow-500 rounded-xl">
                  <p className="text-sm sm:text-base text-yellow-900 font-semibold">
                    ✓ Alto contraste ativado. As cores agora são mais fortes e o texto mais fácil
                    de ler.
                  </p>
                </div>
              )}
            </div>

            {/* Animações Reduzidas */}
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <Music className="w-7 h-7 text-primary" />
                Menos Animações
              </h3>

              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-full p-6 sm:p-8 rounded-2xl border-3 transition-all flex items-center justify-between ${
                  reducedMotion
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="text-2xl sm:text-3xl font-semibold text-foreground text-left">
                    {reducedMotion ? "Ativado" : "Desativado"}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground text-left mt-2">
                    {reducedMotion
                      ? "Animações reduzidas para melhor conforto"
                      : "Ativar para menos movimento na tela"}
                  </p>
                </div>
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                    reducedMotion ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {reducedMotion ? "ON" : "OFF"}
                </div>
              </button>
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t-2 border-border">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="text-lg sm:text-xl py-3 sm:py-4 rounded-xl h-auto"
              >
                Fechar
              </Button>
              <Button
                onClick={() => {
                  setFontSize("normal");
                  setHighContrast(false);
                  setReducedMotion(false);
                }}
                className="text-lg sm:text-xl py-3 sm:py-4 rounded-xl h-auto"
              >
                Restaurar Padrão
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
