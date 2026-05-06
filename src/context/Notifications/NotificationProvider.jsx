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
      // console.log("🔌 [Socket] Pas d'utilisateur, connexion annulée.");
      return;
    }

    // console.log("🔌 [Socket] Tentative de connexion pour:", user.nom, `(${user.role})`);
    socket.connect();

    socket.on("connect", () => {
      // console.log("✅ [Socket] Connecté avec ID:", socket.id);
      if (user.role === "ADMIN") {
        socket.emit("join_admin");
        console.log("👑 [Socket] Room ADMIN rejointe");
      }
      socket.emit("join_user", user._id);
      // console.log("👤 [Socket] Room USER rejointe:", user._id);
    });

    const handleNewNotification = (notif) => {
      // console.log("📩 [Socket] Signal reçu sur 'notification:new':", notif);

      const notifId = notif._id || notif.id || `notif-${Date.now()}`;
      
      if (processedIds.current.has(notifId)) {
        // console.log("🚫 [Socket] Notification ignorée (doublon détecté):", notifId);
        return;
      }
      
      processedIds.current.add(notifId);
      // console.log("✨ [Socket] Traitement nouvelle notification:", notifId);

      toast(notif.message || `Commande mise à jour`, {
        icon: '🔔',
        duration: 4000,
        style: { borderRadius: '15px', background: '#1E293B', color: '#fff', fontWeight: 'bold' },
      });

      setNotifications((prev) => {
        const updated = [{ ...notif, _id: notifId, createdAt: new Date().toISOString() }, ...prev];
        // console.log("📊 [State] Total notifications en mémoire:", updated.length);
        return updated;
      });
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNewNotification);

    socket.on("delivery:unassigned", (data) => {
      // console.log("⚠️ [Socket] Signal 'delivery:unassigned' reçu:", data);
      if (user.role === "ADMIN") {
        handleNewNotification({
          ...data,
          _id: `unassigned-${data.deliveryId || data.orderNumber}`,
          title: "ALERTE ADMIN",
          message: `Nouvelle commande disponible: #${data.orderNumber}`
        });
      }
    });

    return () => {
      // console.log("🔌 [Socket] Nettoyage des écouteurs et déconnexion.");
      socket.off("notification:new");
      socket.off("delivery:unassigned");
      socket.off("connect");
      socket.disconnect();
    };
  }, [user]);

  const markAllAsRead = () => {
    // console.log("🧹 [State] Marquage de toutes les notifications comme lues.");
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};