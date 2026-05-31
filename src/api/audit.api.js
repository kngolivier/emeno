// FILE: src/api/audit.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Récupérer les logs d'audit (Admin uniquement)
 * @param {Object} params - Optionnel (pour pagination future)
 */
export const fetchAuditLogs = (params) => {
  return API.get(ENDPOINTS.AUDIT, { params });
};