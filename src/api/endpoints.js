// FILE: src/api/endpoints.js

export const ENDPOINTS = {
  // ======================
  // AUTH
  // ======================
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  CHANGE_PASSWORD: "/api/auth/change-password",

  // ======================
  // DELIVERIES (ADMIN)
  // ======================
  DELIVERIES_ADMIN: "/api/deliveries/admin",
  DELIVERIES_CLIENT: "/api/deliveries/client",
  DELIVERIES_DRIVER: "/api/deliveries/driver",

  DELIVERY_BY_ID: (id) => `/api/deliveries/${id}`,
  ASSIGN_DRIVER: (id) => `/api/deliveries/${id}/assign`,
  VALIDATE_DELIVERY: (id) => `/api/deliveries/${id}/validate`,
  CANCEL_DELIVERY: (id) => `/api/deliveries/${id}/cancel`,
  UPDATE_STATUS: (id) => `/api/deliveries/${id}/status`,

  // ======================
  // USERS
  // ======================
  USERS: "/api/users",
  DRIVERS: "/api/users/drivers",
  CLIENTS: "/api/users/clients",
  AVAILABLE_DRIVERS: "/api/users/drivers/available",

  // ======================
  // PRICING
  // ======================
  PRICING: "/api/pricing",

};