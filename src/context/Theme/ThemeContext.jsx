// FILE: src/context/Theme/ThemeContext.jsx
import { createContext, useContext } from "react";

// On crée le contexte sans valeur par défaut (ou un objet vide)
export const ThemeContext = createContext(null);

// Hook personnalisé pour consommer le thème facilement
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider");
  }
  return context;
};