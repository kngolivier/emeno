// FILE: src/api/driver.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * 1. GESTION DES MISSIONS
 */
export const fetchActiveDeliveries = () => {
  return API.get(ENDPOINTS.DRIVER_ACTIVE_DELIVERIES);
};

export const fetchDriverHistory = (params = {}) => {
  const { page = 1, limit = 10 } = params;
  return API.get(`${ENDPOINTS.DELIVERIES_DRIVER}?page=${page}&limit=${limit}`);
};

export const updateDeliveryStatus = (id, status) => {
  return API.patch(ENDPOINTS.UPDATE_STATUS(id), { status });
};

export const validateDeliveryAction = (id, code) => {
  return API.patch(ENDPOINTS.VALIDATE_DELIVERY(id), { code });
};

/**
 * 2. GÉOLOCALISATION & DISPONIBILITÉ
 */

// Met à jour la position GPS (Ajout de isAvailable pour le contrôleur backend)
export const updateDriverLocation = (latitude, longitude, isAvailable = true) => {
  return API.post(ENDPOINTS.DRIVER_ME_LOCATION, {
    latitude,
    longitude,
    isAvailable
  });
};

// Change l'état de service (isAvailable requis par ton backend)
export const toggleAvailability = (isOnline) => {
  return API.patch(ENDPOINTS.DRIVER_AVAILABILITY, { isAvailable: isOnline });
};

/**
 * 3. FINANCES & PROFIL
 */
export const fetchMyDebt = (userId) => {
  return API.get(ENDPOINTS.USER_DEBT(userId));
};

// export const fetchMyProfile = () => {
//   return API.get(`${ENDPOINTS.USERS}/me`);
// };

// GESTION DU CYCLE DE PAUSE EMENO
export const updateMyStateAction = (newState) => {
  return API.patch(ENDPOINTS.DRIVER_UPDATE_STATE, { newState });
};

/**
 * Récupération des livreurs actifs pour la carte
 */
export const fetchDriversForMap = () => {
  return API.get(ENDPOINTS.DRIVER_MAP_ACTIVE);
};


const driverApi = {
  fetchDriversForMap,
  fetchActiveDeliveries,
  fetchDriverHistory,
  updateDeliveryStatus,
  validateDeliveryAction,
  updateDriverLocation,
  toggleAvailability,
  fetchMyDebt,
//   fetchMyProfile
  updateMyStateAction,
};

export default driverApi;