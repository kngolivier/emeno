// FILE: src/context/AuthContext.jsx

import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

/**
 * Hook central d'accès à l'auth
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }

  return context;
};