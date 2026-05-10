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
    if (!user) {
      return;
    }

    socket.connect();

    socket.on("connect", () => {
      // Les deux rôles administratifs rejoignent la room de gestion
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        socket.emit("join_admin");
      }
      
      socket.emit("join_user", user._id);
    });

    const handleNewNotification = (notif) => {
      // 1. DÉDUPLICATION
      const notifId = notif._id || notif.id || `notif-${Date.now()}`;
      
      if (processedIds.current.has(notifId)) {
        return;
      }

      // 2. FILTRE DE SÉCURITÉ POUR LES RÔLES ADMIN & SUPER_ADMIN
      // On définit si l'utilisateur actuel possède un privilège administratif
      const hasAdminPrivileges = ["ADMIN", "SUPER_ADMIN"].includes(user.role);
      
      // On vérifie si la notification est destinée uniquement aux clients
      const isTargetClientOnly = notif.targetRoles?.includes("CLIENT") && 
                                 !notif.targetRoles?.includes("ADMIN") && 
                                 !notif.targetRoles?.includes("SUPER_ADMIN");
      
      // Si un admin/super_admin reçoit une notif "Client" (ex: suivi de commande créée pour un tiers), on bloque.
      if (hasAdminPrivileges && isTargetClientOnly) {
        return;
      }
      
      processedIds.current.add(notifId);

      // 3. AFFICHAGE ET MISE À JOUR DE L'ÉTAT
      toast(notif.message || `Commande mise à jour`, {
        icon: '🔔',
        duration: 4000,
        style: { 
          borderRadius: '15px', 
          background: '#1E293B', 
          color: '#fff', 
          fontWeight: 'bold' 
        },
      });

      setNotifications((prev) => {
        const updated = [{ ...notif, _id: notifId, createdAt: new Date().toISOString() }, ...prev];
        return updated;
      });
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNewNotification);

    socket.on("delivery:unassigned", (data) => {
      // Alertes de gestion pour les administrateurs et super-administrateurs
      if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
        handleNewNotification({
          ...data,
          _id: `unassigned-${data.deliveryId || data.orderNumber}`,
          title: "ALERTE GESTION",
          message: `Nouvelle commande disponible: #${data.orderNumber}`,
          targetRoles: ["ADMIN", "SUPER_ADMIN"] // On force les rôles pour passer le filtre
        });
      }
    });

    return () => {
      socket.off("notification:new");
      socket.off("delivery:unassigned");
      socket.off("connect");
      socket.disconnect();
    };
  }, [user]);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};