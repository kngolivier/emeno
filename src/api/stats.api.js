// FILE: src/api/stats.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";


/**
 * fetchAdminStats
 * Récupère les statistiques admin globales
 */
export const fetchAdminStats = async ({ period = "TODAY" }) => {
  return API.get(ENDPOINTS.ADMIN_STATS, {
    params: { period }
  });
}

export const fetchDriverStats = async (driverId, period = "MONTH") => {
  return API.get(`${ENDPOINTS.STATS}/driver/${driverId}`, {
    params: { period }
  });
};

export const fetchDriverLifetimeStats = (driverId) => {
  return API.get(`${ENDPOINTS.STATS}/driver/lifetime/${driverId}`);
};

export const fetchMyStats = async (period = "MONTH") => {
  return API.get(`${ENDPOINTS.STATS}/me`, {
    params: { period }
  });
};

/**
 * fetchClientStats
 * Récupère les statistiques d'un client spécifique (Admin seulement)
 */
export const fetchClientStats = async (clientId, period = "MONTH") => {
  return API.get(`${ENDPOINTS.STATS}/client/${clientId}`, {
    params: { period }
  });
};