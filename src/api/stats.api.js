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