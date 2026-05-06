// FILE: src/context/Theme/ThemeProvider.jsx
import { useMemo, useState, useEffect } from "react";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js'; 
import { ThemeContext } from "./ThemeContext";

// On résout la configuration Tailwind une seule fois en dehors du rendu
const fullConfig = resolveConfig(tailwindConfig);

export const ThemeProvider = ({ children }) => {
  // Initialisation de l'état depuis le localStorage ou les préférences système
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Effet pour appliquer la classe 'dark' au document et sauvegarder le choix
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
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