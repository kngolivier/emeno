// FILE: src/context/AuthProvider.jsx

import { useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  // 💡 SOLUTION : Initialisation synchrone immédiate pour éviter le décalage de render
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });
  
  // On passe loading à false directement si le user est déjà connu (ou absent) au démarrage
  const [loading, setLoading] = useState(false);

  // ======================
  // LOGIN
  // ======================
  const login = ({ user }) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }
  };

  // ======================
  // UPDATE USER
  // ======================
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
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