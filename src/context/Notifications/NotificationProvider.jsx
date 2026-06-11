// FILE: src/context/NotificationProvider.jsx

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
    
    // Si le socket est déjà connecté avant que le user ne soit chargé,
    // il faut forcer l'envoi de la room admin maintenant
    if (socket.connected) {
      if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
        socket.emit("join_admin", user.role);
      }
      socket.emit("join_user", user._id);
    } else {
      socket.connect();
    }

    socket.on("connect", () => {
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        socket.emit("join_admin", user.role); 
      }
      socket.emit("join_user", user._id);
    });

    const handleNewNotification = (notif) => {

      console.log("🔍 [Frontend] Notification reçue:", notif);
      console.log("🔍 [Frontend] Mon rôle:", user.role);

      // 1. DÉFINITION DU FILTRE DE SEGMENTATION
      const isForMe = notif.recipient && notif.recipient.toString() === user._id.toString();
      const targets = Array.isArray(notif.targetRoles) ? notif.targetRoles : [];
      let isForMyRole = targets.includes(user.role);
      
      // Correction rôle admin
      if (user.role === "SUPER_ADMIN" && targets.includes("ADMIN")) isForMyRole = true;

      console.log("🔍 [Frontend] Filtres:", { isForMe, isForMyRole, targets });

      if (!isForMe && !isForMyRole) {
        console.warn("🚫 Notif rejetée par filtre de segmentation");
        return;
      }

      const rawId = notif._id || notif.id;
      const safeId = rawId ? `sk-${rawId}` : `live-${Date.now()}`;
      
      if (processedIds.current.has(safeId)) return;
      
      const hasAdminPrivileges = ["ADMIN", "SUPER_ADMIN"].includes(user.role);
      
      // Cas spécifique : Changements d'état des livreurs
      if (notif.type === "DRIVER_STATE_CHANGED") {
        if (!hasAdminPrivileges) return; 
        
        processedIds.current.add(safeId);
        toast(notif.message || `Changement d'état livreur`, {
          icon: '⏳',
          style: { borderRadius: '15px', background: '#0F172A', color: '#FFF', border: '1px solid rgba(16, 185, 129, 0.2)' },
        });

        setNotifications((prev) => [{ ...notif, _id: safeId, title: notif.title || "STATUT LIVREUR" }, ...prev]);
        setUnreadCount((prev) => prev + 1);
        return;
      }

      // On autorise la notif si :
      // 1. Elle est pour moi OU mon rôle
      // 2. ET (Si je suis admin, elle n'est pas une notif purement Client/Partenaire)
      const isTargetExclusive = (notif.targetRoles?.includes("CLIENT") || notif.targetRoles?.includes("PARTNER_MANAGER")) && 
                                !notif.targetRoles?.includes("ADMIN") && 
                                !notif.targetRoles?.includes("SUPER_ADMIN");
      
      if (hasAdminPrivileges && isTargetExclusive) return;
      
      processedIds.current.add(safeId);

      // Affichage du toast EMENO immersif et stylisé
      toast(notif.message || `Mise à jour EMENO`, {
        icon: '🔔',
        style: { borderRadius: '15px', background: '#1E293B', color: '#fff', fontSize: '12px', fontWeight: 'bold' },
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
          type: "DELIVERY_UNASSIGNED",
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