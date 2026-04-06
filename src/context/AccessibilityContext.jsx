import React, { createContext, useContext, useState, useEffect } from "react";

// Tamanhos de fonte para diferentes modos
const FONT_SIZES = {
  normal: {
    base: "text-base",
    sm: "text-sm",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  },
  large: {
    base: "text-lg",
    sm: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
    "2xl": "text-3xl",
    "3xl": "text-4xl",
    "4xl": "text-5xl",
    "5xl": "text-6xl",
    "6xl": "text-7xl",
  },
  xlarge: {
    base: "text-xl",
    sm: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
    "2xl": "text-4xl",
    "3xl": "text-5xl",
    "4xl": "text-6xl",
    "5xl": "text-7xl",
    "6xl": "text-8xl",
  },
};

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("accessibility-fontSize") || "normal";
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("accessibility-highContrast") === "true";
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem("accessibility-reducedMotion") === "true";
  });

  // Salvar preferências no localStorage
  useEffect(() => {
    localStorage.setItem("accessibility-fontSize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("accessibility-highContrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("accessibility-reducedMotion", reducedMotion);
  }, [reducedMotion]);

  // Aplicar classes ao documento raiz
  useEffect(() => {
    const doc = document.documentElement;
    
    // Remove classes antigas
    doc.classList.remove("font-normal", "font-large", "font-xlarge");
    doc.classList.remove("high-contrast", "reduced-motion");

    // Adiciona novas classes
    doc.classList.add(`font-${fontSize}`);
    if (highContrast) doc.classList.add("high-contrast");
    if (reducedMotion) doc.classList.add("reduced-motion");
  }, [fontSize, highContrast, reducedMotion]);

  const value = {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    fontSizeMap: FONT_SIZES[fontSize],
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility deve ser usado dentro de AccessibilityProvider");
  }
  return context;
};
