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
  DELIVERIES_BULK: "/api/deliveries/bulk",

  DELIVERY_BY_ID: (id) => `/api/deliveries/${id}`,
  ASSIGN_DRIVER: (id) => `/api/deliveries/${id}/assign`,
  VALIDATE_DELIVERY: (id) => `/api/deliveries/${id}/validate`,
  CANCEL_DELIVERY: (id) => `/api/deliveries/${id}/cancel`,
  UPDATE_STATUS: (id) => `/api/deliveries/${id}/status`,
  RESEND_DELIVERY_OTP: (id) => `/api/deliveries/${id}/resend-otp`,

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

  // ======================
  // STATS
  // ======================
  ADMIN_STATS: "/api/stats/admin",
  STATS: "/api/stats",

  // ======================
  // OTP (Vérification Téléphone)
  // ======================
  OTP_SEND: "/api/otp/send",
  OTP_VERIFY: "/api/otp/verify",

  USERS_ACTIVATE: "/api/users/activate",

  // ======================
  // DRIVER SPECIFIC (LOCATION & STATUS)
  // ======================
  DRIVER_ME_LOCATION: "/api/delivery-location/me",
  DRIVER_AVAILABILITY: "/api/delivery-location/availability",
  DRIVER_ACTIVE_DELIVERIES: "/api/deliveries/driver/active",

  // USER DEBT
  USER_DEBT: (id) => `/api/users/${id}/debt`,

  // ======================
  // COMMUNES
  // ======================
  COMMUNES: "/api/communes",
  COMMUNE_BY_ID: (id) => `/api/communes/${id}`,

  // ======================
  // FEEDBACKS
  // ======================
  FEEDBACKS: "/api/feedbacks",

  // ===================
  // NOTIFICATIONS
  // ===================
  NOTIFICATIONS_ME: "/api/notifications/me",
  NOTIFICATIONS_READ: (id) => `/api/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: "/api/notifications/read-all",
  NOTIFICATIONS_ADMIN: "/api/notifications/admin",
  NOTIFICATIONS_SUBSCRIBE: "/api/notifications/subscribe",

  // ======================
  // PARTNERS (COMMERCES)
  // ======================
  PARTNERS: "/api/partners",
  PARTNER_BY_ID: (id) => `/api/partners/${id}`,
  PARTNER_STATUS: (id) => `/api/partners/${id}/status`,

 // GESTION DES PAUSES
  DRIVER_UPDATE_STATE: "/api/users/drivers/my-state",
  DRIVER_PAUSE_STATUS: (driverId) => `/api/users/drivers/${driverId}/pause-status`,
};