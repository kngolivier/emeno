// FILE: src/context/Settings/SettingsContext.jsx

import { createContext, useContext } from "react";

export const SettingsContext = createContext(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings doit être utilisé dans SettingsProvider");
  return context;
};