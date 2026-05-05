// src/api/otp.api.js
import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * ENVOYER UN CODE OTP
 * @param {Object} data - { phone: "+241XXXXXXXX" }
 */
export const sendOTP = async (data) => {
  return await API.post(ENDPOINTS.OTP_SEND, data);
};

/**
 * VÉRIFIER UN CODE OTP
 * @param {Object} data - { phone: "+241XXXXXXXX", code: "123456" }
 */
export const verifyOTP = async (data) => {
  return await API.post(ENDPOINTS.OTP_VERIFY, data);
};