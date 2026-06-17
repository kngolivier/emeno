// FILE: src/api/feedback.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * SOUMETTRE UN FEEDBACK (Client ou Livreur)
 * @param {Object} payload 
 * @param {string} payload.deliveryId - ID de la livraison
 * @param {number} payload.rating - Note de 1 à 5
 * @param {string} [payload.comment] - Commentaire libre
 * @param {string[]} [payload.tags] - Liste de tags (ex: ["Rapide", "Poli"])
 */
export const submitFeedback = (payload) => {
  return API.post(ENDPOINTS.FEEDBACKS, payload);
};

/**
 * RÉCUPÉRER TOUS LES FEEDBACKS (Admin)
 * @param {Object} params - { page, limit, status, minRating, sort }
 */
export const fetchAllFeedbacks = (params = {}) => {
  const { page = 1, limit = 10, status, minRating, sort } = params;

  // Construction dynamique de la query string
  let url = `${ENDPOINTS.FEEDBACKS}?page=${page}&limit=${limit}`;

  if (status && status !== "ALL") url += `&status=${status}`;
  if (minRating > 0) url += `&minRating=${minRating}`;
  if (sort) url += `&sort=${sort}`;

  return API.get(url);
};

/**
 * MODIFIER LE STATUT D'UN AVIS
 * @param {string} id 
 * @param {Object} payload - { status: "RESOLVED" }
 */
export const updateFeedbackStatus = (id, payload) => {
  return API.patch(`${ENDPOINTS.FEEDBACKS}/${id}/status`, payload);
};

/**
 * RÉCUPÉRER LES FEEDBACKS D'UNE LIVRAISON PRÉCISE
 * @param {string} deliveryId 
 */
export const fetchFeedbacksByDelivery = (deliveryId) => {
  return API.get(`${ENDPOINTS.FEEDBACKS}/delivery/${deliveryId}`);
};