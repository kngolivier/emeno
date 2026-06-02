// FILE: src/api/promotions.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

// ======================
// PUBLIC
// ======================

export const fetchPromotions = (params = {}) => {
  return API.get(ENDPOINTS.PROMOTIONS, { params });
};

export const fetchActivePromotions = (params = {}) => {
  return API.get(ENDPOINTS.PROMOTIONS_ACTIVE, { params });
};

export const fetchActivePromotionsList = () => {
  return API.get(ENDPOINTS.PROMOTIONS_ACTIVE_LIST);
};

export const fetchPromotionById = (id) => {
  return API.get(ENDPOINTS.PROMOTION_BY_ID(id));
};

export const fetchPromotionProducts = (promoId) => {
  return API.get(
    ENDPOINTS.PROMOTION_WITH_PRODUCTS(promoId)
  );
};

export const fetchPartnerPromotions = (
  partnerId,
  params = {}
) => {
  return API.get(
    ENDPOINTS.PROMOTIONS_BY_PARTNER(partnerId),
    { params }
  );
};

export const validatePromotionCode = (code) => {
  return API.post(
    ENDPOINTS.PROMOTIONS_VALIDATE_CODE,
    { code }
  );
};

// ======================
// WHATSAPP
// ======================

export const generateWhatsAppLink = (payload) => {
  return API.post(
    ENDPOINTS.PROMOTIONS_WHATSAPP_LINK,
    payload
  );
};

export const generateProductOrderWhatsApp = (
  payload
) => {
  return API.post(
    ENDPOINTS.PROMOTIONS_GENERATE_ORDER,
    payload
  );
};

// ======================
// TOKEN
// ======================

export const validatePromoToken = (promoToken) => {
  return API.post(
    ENDPOINTS.PROMOTIONS_VALIDATE_TOKEN,
    { promoToken }
  );
};

export const markPromoTokenUsed = (
  promoToken
) => {
  return API.post(
    ENDPOINTS.PROMOTIONS_MARK_TOKEN_USED,
    { promoToken }
  );
};

// ======================
// ADMIN
// ======================

export const createPromotion = (payload) => {
  return API.post(
    ENDPOINTS.PROMOTIONS,
    payload
  );
};

export const updatePromotion = (
  id,
  payload
) => {
  return API.patch(
    ENDPOINTS.PROMOTION_BY_ID(id),
    payload
  );
};

export const deletePromotion = (
  id,
  softDelete = true
) => {
  return API.delete(
    `${ENDPOINTS.PROMOTION_BY_ID(id)}?softDelete=${softDelete}`
  );
};

export const togglePromotionStatus = (
  id,
  isActive
) => {
  return API.patch(
    ENDPOINTS.PROMOTION_TOGGLE_STATUS(id),
    { isActive }
  );
};

export const fetchPromotionStats = (id) => {
  return API.get(
    ENDPOINTS.PROMOTION_STATS(id)
  );
};

export const fetchExpiredPromotions = (
  params = {}
) => {
  return API.get(
    ENDPOINTS.PROMOTIONS_EXPIRED,
    { params }
  );
};

export const fetchActivePromotionsCount =
  () => {
    return API.get(
      ENDPOINTS.PROMOTIONS_COUNT_ACTIVE
    );
  };