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
 * DELETE user
 */
export const deleteUser = (id) => {
  return API.delete(`${ENDPOINTS.USERS}/${id}`);
};
