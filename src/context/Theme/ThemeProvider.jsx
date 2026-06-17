// FILE: src/context/Theme/ThemeProvider.jsx
import { useMemo, useState, useEffect } from "react";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js'; 
import { ThemeContext } from "./ThemeContext";

// On résout la configuration Tailwind une seule fois en dehors du rendu
const fullConfig = resolveConfig(tailwindConfig);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Lecture sécurisée du localStorage
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
    } catch (e) {
      console.warn("localStorage inaccessible");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const theme = isDarkMode ? "dark" : "light";
    
    root.classList.toggle("dark", isDarkMode);
    root.classList.toggle("light", !isDarkMode);
    
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.error("Impossible de sauvegarder le thème");
    }
  }, [isDarkMode]);

  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Mémorisation de la valeur du contexte pour éviter les rendus inutiles
  const themeValue = useMemo(() => ({
    // Accès direct aux jetons de design de tailwind.config
    colors: fullConfig.theme.colors,
    borderRadius: fullConfig.theme.borderRadius,
    spacing: fullConfig.theme.spacing,
    shadows: fullConfig.theme.boxShadow,
    
    // État et contrôle du mode sombre
    isDarkMode,
    toggleTheme
  }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {/* Conteneur principal avec transition fluide pour le changement de thème */}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-primary dark:text-slate-200 transition-colors duration-300">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};