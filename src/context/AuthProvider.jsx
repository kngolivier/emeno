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

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Fonction utilitaire pour souscrire au Push
  const registerPushSubscription = async (user) => {
    if (!('serviceWorker' in navigator)) return;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      // On s'abonne avec la clé publique VAPID
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
      });

      // Envoi au backend
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, userId: user._id, role: user.role })
      });
    } catch (err) {
      console.error("Erreur d'abonnement Push:", err);
    }
  };

  // Correction de la fonction logout dans AuthProvider.jsx
  const logout = useCallback(async () => {
    if (user) {
      try {
        // On attend la suppression côté serveur avant de vider le local
        await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/unsubscribe`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id })
        });
      } catch (err) {
        console.error("Erreur désabonnement:", err);
      }
    }
    localStorage.removeItem("user");
    setUser(null);
  }, [user]);
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
    // 💡 AUTOMATISATION : On s'abonne dès le login
    registerPushSubscription(user);
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