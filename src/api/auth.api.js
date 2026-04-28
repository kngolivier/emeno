// FILE: src/api/auth.api.js

// FILE: src/api/auth.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * LOGIN USER
 */
export const login = async (credentials) => {
  const res = await API.post(ENDPOINTS.LOGIN, credentials);

  return res;
};

/**
 * REGISTER
 */
export const register = async (data) => {
  const res = await API.post(ENDPOINTS.REGISTER, data);

  return res;
};

/**
 * CHANGE PASSWORD
 */
export const changePassword = async (data) => {
  const res = await API.patch(ENDPOINTS.CHANGE_PASSWORD, data);

  return res
};