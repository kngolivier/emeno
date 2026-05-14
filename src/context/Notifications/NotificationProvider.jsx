// src/context/NotificationProvider.jsx

import { useEffect, useState, useRef } from "react";
import socket from "../../services/socket";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";
import { NotificationContext } from "./notification.context";

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const processedIds = useRef(new Set());

  useEffect(() => {
    if (!user) return;
    socket.connect();

    socket.on("connect", () => {
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") socket.emit("join_admin");
      socket.emit("join_user", user._id);
    });

    const handleNewNotification = (notif) => {
      const rawId = notif._id || notif.id;
      
      // FIX ULTIME : On préfixe TOUJOURS les IDs venant du socket pour éviter
      // que React ne les confonde avec les clés de pagination (1, 2, 3...)
      const safeId = rawId ? `sk-${rawId}` : `live-${Date.now()}`;
      
      if (processedIds.current.has(safeId)) return;
      
      const hasAdminPrivileges = ["ADMIN", "SUPER_ADMIN"].includes(user.role);
      const isTargetClientOnly = notif.targetRoles?.includes("CLIENT") && 
                                 !notif.targetRoles?.includes("ADMIN") && 
                                 !notif.targetRoles?.includes("SUPER_ADMIN");
      
      if (hasAdminPrivileges && isTargetClientOnly) return;
      
      processedIds.current.add(safeId);

      toast(notif.message || `Mise à jour EMENO`, {
        icon: '🔔',
        style: { borderRadius: '15px', background: '#1E293B', color: '#fff' },
      });

      setNotifications((prev) => [{ ...notif, _id: safeId }, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("delivery:unassigned", (data) => {
      if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
        handleNewNotification({
          ...data,
          _id: `unassigned-${data.deliveryId || data.orderNumber}`,
          title: "ALERTE GESTION",
          message: `Nouvelle commande: #${data.orderNumber}`,
        });
      }
    });

    return () => {
      socket.off("notification:new");
      socket.off("delivery:unassigned");
      socket.disconnect();
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead: () => setUnreadCount(0) }}>
      {children}
    </NotificationContext.Provider>
  );
};