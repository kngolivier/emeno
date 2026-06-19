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
 * RÉCUPÉRER LE PROFIL ACTUEL
 */
export const getMe = async () => {
  const res = await API.get("/api/auth/me");
  return res;
};

/**
 * LOGOUT USER (Nettoie le cookie HTTP-Only côté serveur)
 */
export const logoutUser = async () => {
  const res = await API.post(ENDPOINTS.LOGOUT);
  return res;
};

/**
 * REGISTER
 */
export const registerClient = async (data) => {
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

/**
 * DEMANDE DE RÉINITIALISATION (Envoie l'OTP)
 */
export const forgotPassword = async (telephone) => {
  const res = await API.post(ENDPOINTS.FORGOT_PASSWORD, { telephone });
  return res;
};

/**
 * CONFIRMATION DE RÉINITIALISATION (Vérifie OTP + Nouveau mot de passe)
 */
export const resetPassword = async (data) => {
  // data doit contenir: { telephone, otpCode, newPassword }
  const res = await API.post(ENDPOINTS.RESET_PASSWORD, data);
  return res;
};