// FILE: src/api/users.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * GET all drivers
 */
export const fetchDrivers = (page = 1, limit = 10) => {
  return API.get(`${ENDPOINTS.DRIVERS}?page=${page}&limit=${limit}`);
};

/**
 * GET all customers
 */
export const fetchClients = (page = 1, limit = 10) => {
  return API.get(`${ENDPOINTS.CLIENTS}?page=${page}&limit=${limit}`);
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
