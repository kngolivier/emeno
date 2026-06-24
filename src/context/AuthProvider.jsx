// FILE: src/context/AuthProvider.jsx

import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getMe, logoutUser } from "../api/auth.api";
import { savePushSubscription } from "../api/notifications.api"
import API from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Fonction de souscription sécurisée
  const registerPushSubscription = async (currentUser) => {
    if (!('serviceWorker' in navigator) || !currentUser) return;
    
    // 💡 SÉCURITÉ : Si l'utilisateur a bloqué les notifications, on n'exécute rien
    if (window.Notification && Notification.permission === 'denied') return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
      });

      await savePushSubscription({
         subscription, 
        userId: currentUser._id, 
        role: currentUser.role 
      })
    } catch (err) {
      console.error("Erreur d'abonnement Push:", err);
    }
  };

  // Déconnexion propre (Session + Push désactivé sur le terminal)
  const logout = useCallback(async () => {
    try {
      // 💡 OPTIMISATION : Désabonnement propre côté client (évite les jetons fantômes)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          // await subscription.unsubscribe();
          await API.delete(ENDPOINTS.NOTIFICATIONS_UNSUBSCRIBE);
        }
      }

      // Révocation de la session côté serveur (le cookie est détruit)
      await logoutUser();
    } catch (err) {
      console.error("Erreur lors de la déconnexion complète:", err);
    } finally {
      // Nettoyage de l'état même si une requête réseau échoue
      setUser(null);
    }
  }, []); // 💡 Dépendance vide car l'identité est gérée par le cookie côté serveur maintenant !

  // Synchronisation unique au chargement initial
  useEffect(() => {
    const syncUser = async () => {
      try {
        const freshData = await getMe();
        setUser(freshData.data);
        
        // On ne déclenche la synchronisation push invisible que si la permission est déjà accordée.
        // Cela évite un pop-up agressif au rafraîchissement si l'user avait ignoré la demande.
        if (window.Notification && Notification.permission === 'granted') {
          registerPushSubscription(freshData.data);
        }
      } catch (err) {
        console.warn("Utilisateur non authentifié ou session expirée");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Au moment du login explicite, on peut déclencher la demande d'abonnement push
    registerPushSubscription(userData);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}