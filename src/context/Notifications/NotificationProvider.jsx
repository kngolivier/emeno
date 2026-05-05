// src/context/NotificationProvider.jsx
import { useEffect, useState, useRef } from "react"; // Ajout de useRef
import socket from "../../services/socket";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";
import { NotificationContext } from "./notification.context";

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Utiliser un Ref pour suivre les IDs déjà toastés (évite les doublons immédiats)
  const processedIds = useRef(new Set());

  useEffect(() => {
    if (!user) return;

    socket.connect();

    if (user.role === "ADMIN") {
      socket.emit("join_admin");
    }
    
    socket.emit("join_user", user._id);

    // Fonction unique pour gérer l'affichage et l'état
    const handleNewNotification = (notif) => {
      // Si la notification a un ID et qu'on l'a déjà traitée, on stoppe
      const notifId = notif._id || notif.id || `${notif.deliveryId}-${notif.status}`;
      
      if (processedIds.current.has(notifId)) return;
      
      // Marquer comme traitée
      processedIds.current.add(notifId);

      // Toast ultra-chic unique
      toast(notif.message || `Mise à jour commande #${notif.orderNumber}`, {
        icon: '🔔',
        duration: 3000, // Augmenté un peu pour la lisibilité
        style: {
          borderRadius: '15px',
          background: '#1E293B',
          color: '#fff',
          fontWeight: 'bold',
        },
      });

      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    // Écouteur unifié
    socket.on("notification:new", handleNewNotification);

    // Écouteur spécifique (Admin) - On vérifie si ce n'est pas déjà géré par notification:new
    socket.on("delivery:unassigned", (data) => {
      if (user.role === "ADMIN") {
        // On crée un ID fictif pour le check de doublon si le backend n'envoie pas d'ID
        const checkId = `unassigned-${data.deliveryId || data.orderNumber}`;
        if (!processedIds.current.has(checkId)) {
            handleNewNotification({
                ...data,
                _id: checkId,
                message: `Alerte Admin : Nouvelle commande #${data.orderNumber}`
            });
        }
      }
    });

    return () => {
      socket.off("notification:new");
      socket.off("delivery:unassigned");
      socket.disconnect();
    };
  }, [user]);

  const markAllAsRead = () => {
    setUnreadCount(0);
    // On vide le set des IDs traités quand on nettoie pour libérer de la mémoire
    processedIds.current.clear();
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};