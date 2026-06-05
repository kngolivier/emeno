// FILE: src/context/Settings/SettingsProvider.jsx

import { useState, useEffect } from "react";
import { fetchCompanySettings } from "../../api/companySettings.api";
// 1. Importez le contexte que vous avez créé
import { SettingsContext } from "./SettingsContext"; 

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Ajoutez une fonction pour mettre à jour les settings localement
  // Cela sera très utile pour votre page d'admin
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetchCompanySettings();
        setSettings(res);
        console.log("Paramètres chargés:", res);
      } catch (err) {
        console.error("Erreur chargement paramètres:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // 3. Passez settings, loading ET la fonction updateSettings au provider
  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};