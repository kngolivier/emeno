// FILE: src/api/pricing.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

// ======================
// GET ALL PRICING
// ======================
export const fetchPricing = (page = 1, limit = 10) => {
  return API.get(`${ENDPOINTS.PRICING}?page=${page}&limit=${limit}`);
};

// ======================
// CREATE PRICING RULE
// ======================
export const createPricing = (payload) => {
  return API.post(ENDPOINTS.PRICING, payload);
};

// ======================
// UPDATE PRICING RULE
// ======================
export const updatePricing = (id, payload) => {
  return API.put(`${ENDPOINTS.PRICING}/${id}`, payload);
};

// ======================
// DELETE PRICING RULE
// ======================
export const deletePricing = (id) => {
  return API.delete(`${ENDPOINTS.PRICING}/${id}`);
};

// ======================
// TOGGLE STATUS (ACTIVE / INACTIVE)
// ======================
export const togglePricing = (id) => {
  return API.patch(`${ENDPOINTS.PRICING}/${id}/toggle`);
};

// ======================
// CALCULATE PRICE (OPTIONAL FRONT USE)
// ======================
export const calculatePrice = (from, to, distanceKm = null) => {
  return API.get(
    `${ENDPOINTS.PRICING}/calculate?from=${from}&to=${to}&distanceKm=${distanceKm || ""}`
  );
};