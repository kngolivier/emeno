// FILE: src/api/apiClient.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  withCredentials: true, // 💡 FONDAMENTAL : Autorise le passage automatique des cookies HTTP-Only
  headers: {
    // 💡 Indispensable pour éviter que ngrok ne bloque les requêtes de l'application mobile
    'ngrok-skip-browser-warning': 'true' 
  }
});

// ======================
// REQUEST INTERCEPTOR
// ======================
API.interceptors.request.use(
  (config) => {
    // Plus besoin de manipuler localStorage ni d'injecter les Headers Authorization !
    // Le navigateur s'occupe d'inclure le cookie sécurisé en tâche de fond.
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================
// RESPONSE INTERCEPTOR
// ======================
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Erreur serveur";

    console.error("[API ERROR]", message);
    
    // Cas session/cookie expiré ou invalide
    if (error.response?.status === 401) {
      localStorage.removeItem("user"); // On nettoie l'état miroir de l'user
      window.location.href = "/login";
    }

    return Promise.reject(new Error(message));
  }
);

export default API;