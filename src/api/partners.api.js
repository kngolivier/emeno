// FILE: src/api/partners.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * PUBLIC / PARTNER / ADMIN - Récupérer la liste paginée de tous les partenaires
 * Gère les filtres : page, limit, status, search
 */
export const fetchPartners = (params = {}) => {
  return API.get(ENDPOINTS.PARTNERS, { params });
};

/**
 * PUBLIC / PARTNER / ADMIN - Obtenir les détails d'un partenaire par son ID
 */
export const fetchPartnerById = (id) => {
  return API.get(ENDPOINTS.PARTNER_BY_ID(id));
};

/**
 * ADMIN / SUPER_ADMIN - Créer un nouveau partenaire commercial
 */
export const createPartner = (payload) => {
  return API.post(ENDPOINTS.PARTNERS, payload);
};

/**
 * ADMIN / SUPER_ADMIN / PARTNER_MANAGER - Mettre à jour les coordonnées d'un partenaire
 * Le manager est limité par le backend à son propre établissement lié.
 */
export const updatePartner = (id, payload) => {
  return API.put(ENDPOINTS.PARTNER_BY_ID(id), payload);
};

/**
 * ADMIN / SUPER_ADMIN - Suspendre ou réactiver un compte partenaire (Toggle Status)
 * @param {string} id - ID du partenaire
 * @param {string} status - "ACTIVE" ou "SUSPENDED"
 */
export const updatePartnerStatus = (id, status) => {
  return API.patch(ENDPOINTS.PARTNER_STATUS(id), { status });
};