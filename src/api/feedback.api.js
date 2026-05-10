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
 * @param {Object} params - Pagination et filtres éventuels
 */
export const fetchAllFeedbacks = () => {
  return API.get(ENDPOINTS.FEEDBACKS);
};

/**
 * RÉCUPÉRER LES FEEDBACKS D'UNE LIVRAISON PRÉCISE
 * @param {string} deliveryId 
 */
export const fetchFeedbacksByDelivery = (deliveryId) => {
  return API.get(`${ENDPOINTS.FEEDBACKS}/delivery/${deliveryId}`);
};