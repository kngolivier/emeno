// FILE: src/api/deliveries.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * ADMIN - toutes les livraisons
 */
export const fetchAdminDeliveries = () => {
  return API.get(ENDPOINTS.DELIVERIES_ADMIN);
};

/**
 * CLIENT - ses livraisons
 */
export const fetchClientDeliveries = () => {
  return API.get(ENDPOINTS.DELIVERIES_CLIENT);
};

/**
 * DRIVER - ses livraisons
 */
export const fetchDriverDeliveries = () => {
  return API.get(ENDPOINTS.DELIVERIES_DRIVER);
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