// FILE: src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // INIT (refresh page)
  // ======================
  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // TOKEN SAFE
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    } else {
      localStorage.removeItem("token");
    }

    // USER SAFE PARSE
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn("User corrompu → nettoyage");
        localStorage.removeItem("user");
      }
    } else {
      localStorage.removeItem("user");
    }

    setLoading(false);

  }, []);

  // ======================
  // LOGIN
  // ======================
  const login = ({ user, token }) => {

    if (!token) return;

    setToken(token);
    localStorage.setItem("token", token);

    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }

  };

  // ======================
  // UPDATE USER (IMPORTANT 🔥)
  // utilisé après PATCH /users/me
  // ======================
  const updateUser = (updatedUser) => {

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {

    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser, // 👈 ajouté
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}