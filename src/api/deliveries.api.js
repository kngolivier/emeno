// FILE: src/api/deliveries.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * ADMIN - create delivery
 */
export const createDelivery = (data) => {
  return API.post("/api/deliveries", data);
};

/**
 * PARTNER - Créer une vague de livraisons (Bulk B2C)
 */
export const createBulkDeliveries = (payload) => {
  return API.post( ENDPOINTS.DELIVERIES_BULK, payload );
};

/**
 * ADMIN - toutes les livraisons
 */
export const fetchAdminDeliveries = (params) => {
  return API.get(ENDPOINTS.DELIVERIES_ADMIN, { params });
};

/**
 * CLIENT - ses livraisons
 */
export const fetchClientDeliveries = (params) => {
  return API.get(ENDPOINTS.DELIVERIES_CLIENT, { params });
};
/**
 * DRIVER - ses livraisons
 */
export const fetchDriverDeliveries = (params) => {
  return API.get(ENDPOINTS.DELIVERIES_DRIVER, { params });
};

/**
 * GET by ID
 */
export const fetchDeliveryById = (id) => {
  return API.get(ENDPOINTS.DELIVERY_BY_ID(id));
};

/**
 * ASSIGN DRIVER (ADMIN)
 */
export const assignDriver = (deliveryId, driverId) => {
  return API.patch(ENDPOINTS.ASSIGN_DRIVER(deliveryId), {
    driverId,
  });
};

/**
 * VALIDATE DELIVERY (DRIVER)
 */
export const validateDelivery = (deliveryId, code) => {
  return API.patch(ENDPOINTS.VALIDATE_DELIVERY(deliveryId), {
    code,
  });
};

/**
 * CANCEL DELIVERY
 */
export const cancelDelivery = (deliveryId) => {
  return API.patch(ENDPOINTS.CANCEL_DELIVERY(deliveryId));
};

/**
 * UPDATE STATUS (DRIVER)
 */
export const updateDeliveryStatus = (deliveryId, status) => {
  return API.patch(ENDPOINTS.UPDATE_STATUS(deliveryId), {
    status,
  });
};

/**
 * PARTNER/ADMIN - Renvoyer le code de sécurité (OTP) par SMS au destinataire
 */
export const resendDeliveryOtp = (deliveryId) => {
  return API.post(ENDPOINTS.RESEND_DELIVERY_OTP(deliveryId));
};