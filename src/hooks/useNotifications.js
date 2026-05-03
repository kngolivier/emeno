// src/hooks/useNotifications.js

import { useContext } from "react";
import { NotificationContext } from "../context/Notifications/notification.context";
export const useNotifications = () => {
  return useContext(NotificationContext);
};