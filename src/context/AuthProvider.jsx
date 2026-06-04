// FILE: src/context/AuthProvider.jsx

import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getMe } from "../api/auth.api"; // Importez la nouvelle fonction

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [loading, setLoading] = useState(true); // Initialisez à true

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);
  // 💡 Effet de synchronisation au chargement
  useEffect(() => {
    const syncUser = async () => {
      const token = localStorage.getItem("user"); // Vérifie si on a une session
      if (token) {
        try {
          const freshData = await getMe();
          // Mise à jour avec les données réelles du serveur (incluant le driverState/PAUSE)
          localStorage.setItem("user", JSON.stringify(freshData.data));
          setUser(freshData.data);
        } catch (err) {
          // Si le token est expiré ou invalide
          logout();
        }
      }
      setLoading(false);
    };

    syncUser();
  }, [logout]);

  const login = ({ user }) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}