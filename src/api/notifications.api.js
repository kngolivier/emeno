// FILE: src/api/notifications.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";


/**
 * Enregistrer l'appareil (Subscription Web Push) sur le backend Node.js
 * @param {Object} payload - { subscription, userId, role }
 */
export const savePushSubscription = (payload) => {
  return API.post(ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, payload);
};

/**
 * GET notifications (paginées)
 * @param {Object} params - { page, limit, role }
 */
export const fetchNotifications = (params = {}) => {
  const { page = 1, limit = 10, role } = params;

  // Détermination de l'url selon le rôle (Admin ou Personnel)
  const baseUrl = (role === "ADMIN" || role === "SUPER_ADMIN")
    ? ENDPOINTS.NOTIFICATIONS_ADMIN
    : ENDPOINTS.NOTIFICATIONS_ME;

  const url = `${baseUrl}?page=${page}&limit=${limit}`;

  return API.get(url);
};

/**
 * PATCH mark one notification as read
 */
export const markNotificationAsRead = (id) => {
  return API.patch(ENDPOINTS.NOTIFICATIONS_READ(id));
};

/**
 * PATCH mark all my notifications as read
 */
export const markAllNotificationsAsRead = () => {
  return API.patch(ENDPOINTS.NOTIFICATIONS_READ_ALL);
};