// FILE: src/api/users.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * GET all users
 */
export const fetchUsers = (params = {}) => {
  const { page = 1, limit = 10, role, status } = params;

  let url = `${ENDPOINTS.USERS}?page=${page}&limit=${limit}`;

  if (role) url += `&role=${role}`;
  if (status && status !== "ALL") url += `&status=${status}`;

  return API.get(url);
};

/**
 * GET all admins
 */
export const fetchAdmins = (params = {}) => {
  return fetchUsers({ ...params, role: "ADMIN" });
};
/**
 * GET all drivers
 */
export const fetchDrivers = (params = {}) => {
  return fetchUsers({ ...params, role: "DRIVER" });
};
/**
 * GET all customers
 */
export const fetchClients = (params = {}) => {
  return fetchUsers({ ...params, role: "CLIENT" });
};

/**
 * GET client by ID
 */
export const fetchClientById = (id) => {
  return API.get(`${ENDPOINTS.USERS}/${id}`);
};

/**
 * CREATE client
 */

export const createClient = (payload) => {
  return API.post(ENDPOINTS.USERS, {
    ...payload,
    role: "CLIENT"
  });
};

/**
 * CREATE client
 */

export const createAdmin = (payload) => {
  return API.post(ENDPOINTS.USERS, {
    ...payload,
    role: "ADMIN"
  });
};

/**
 *  GET available drivers (pour assignation livraison)
 */
export const fetchAvailableDrivers = () => {
  return API.get(ENDPOINTS.AVAILABLE_DRIVERS);
};

/**
 * CREATE driver
 */
export const createDriver = (payload) => {
  return API.post(ENDPOINTS.USERS, payload);
};

/**
 * GET driver by ID
 */
export const fetchDriverById = (id) => {
  return API.get(`${ENDPOINTS.USERS}/${id}`);
};

/**
 * PATCH user status (ACTIVE / INACTIVE / BLOCKED / DELETED)
 */
export const updateUserStatus = (id, status) => {
  return API.patch(`${ENDPOINTS.USERS}/${id}/status`, { status });
};

/**
 * UPDATE current user profile (/me)
 */
export const updateMyProfile = (payload) => {
  return API.patch(`${ENDPOINTS.USERS}/me`, payload);
};

/**
 * UPDATE user profile (/:id)
 */
export const updateUser = (id, payload) => {
  return API.put(`${ENDPOINTS.USERS}/${id}`, payload);
};

/**
 * DELETE user
 */
export const deleteUser = (id) => {
  return API.delete(`${ENDPOINTS.USERS}/${id}`);
};

/**
 * ACTIVER UN COMPTE CLIENT (Validation OTP)
 * @param {Object} payload - { telephone: "+241...", code: "1234" }
 */
export const activateUserAccount = (payload) => {
  return API.post(`${ENDPOINTS.USERS}/activate`, payload);
};

/**
 * CREATE Partner Manager (Gestionnaire de commerce)
 * @param {Object} payload - { nom, telephone, email, partnerId, ... }
 */
export const createPartnerManager = (payload) => {
  if (!payload.partnerId) {
    return Promise.reject(new Error("Le partnerId est obligatoire pour un gestionnaire."));
  }
  return API.post(ENDPOINTS.USERS, {
    ...payload,
    role: "PARTNER_MANAGER"
  });
};