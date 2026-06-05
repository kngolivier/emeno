// FILE: src/api/companySettings.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Récupère les paramètres de l'entreprise
 */
export const fetchCompanySettings = () => {
  return API.get(ENDPOINTS.COMPANY_SETTINGS);
};

/**
 * Met à jour les paramètres de l'entreprise (Admin)
 */
export const updateCompanySettings = (payload) => {
  return API.patch(ENDPOINTS.COMPANY_SETTINGS, payload);
};