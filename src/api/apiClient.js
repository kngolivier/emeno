// FILE: src/api/apiClient.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// ======================
// REQUEST INTERCEPTOR
// ======================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (!token && !config.url.includes("auth")) {
      console.warn("[AUTH] Appel API sans token:", config.url);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("[API] Aucun token trouvé");
    }

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
    const message =
      error.response?.data?.message || "Erreur serveur";

    console.error("[API ERROR]", message);
    // cas token expiré
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(new Error(message));
  }
);

export default API;