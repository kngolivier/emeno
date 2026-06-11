// FILE: src/pages/Notifications.jsx

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  PackageCheck,
  Truck,
  AlertCircle,
  Info,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../context/AuthContext";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { Pagination } from "../components/Pagination";
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "../api/notifications.api";
import { fetchDeliveryById } from "../api/deliveries.api"; // Import pour charger la fiche dynamique du partenaire
import PartnerOrderDetailModal from "./partner-portal/PartnerOrderDetailModal"; // Modale responsive importée

export default function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  
  // États locaux additionnels pour le cas d'usage Partenaire
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loadingDelivery, setLoadingDelivery] = useState(false);

  const {
    notifications: liveNotifications,
    markAllAsRead: markLiveAllAsRead,
  } = useNotifications();

  /* ==========================================================================
     FETCH & MERGE LOGIC
     ========================================================================== */
  const fetchWithRole = useCallback(
    (params) => {
      if (!user?._id) return Promise.resolve({ data: { data: [], meta: {} } });
      return fetchNotifications({ ...params, role: user?.role });
    },
    [user?._id, user?.role]
  );

  const { data: dbNotifications = [], meta, loading, setPage, refresh } = usePaginatedFetch(fetchWithRole, 10);

  const allNotifications = useMemo(() => {
    const uniqueMap = new Map();
    dbNotifications.forEach((n) => {
      const cleanId = n._id?.toString();
      if (cleanId) uniqueMap.set(cleanId, n);
    });
    liveNotifications.forEach((n) => {
      const rawId = n._id || n.id;
      const cleanId = rawId?.toString().replace('sk-', '');
      if (cleanId) uniqueMap.set(cleanId, n);
    });
    return Array.from(uniqueMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [liveNotifications, dbNotifications]);

  // Remplacez votre useMemo actuel par celui-ci
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((n) => {
      // 1. VÉRIFICATION DE SÉCURITÉ (Qui a le droit de voir ça ?)
      const isOwner = n.recipient && n.recipient.toString() === user?._id.toString();
      const isTargetedRole = n.targetRoles?.includes(user?.role);
      
      // Si la notif n'est ni pour moi, ni pour mon rôle, on la masque totalement
      if (!isOwner && !isTargetedRole) return false;

      // 2. FILTRAGE D'ÉTAT (Lu / Non lu)
      const isRead = n.readBy?.includes(user?._id);
      if (filter === "unread") return !isRead;
      if (filter === "read") return isRead;
      
      return true;
    });
  }, [allNotifications, filter, user]);

  /* ==========================================================================
     ACTIONS
     ========================================================================== */
  const handleMarkAsRead = async (id) => {
    const cleanId = id.toString().replace('sk-', '');
    try {
      await markNotificationAsRead(cleanId);
      refresh(); 
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      markLiveAllAsRead(); 
      refresh();
      toast.success("Mise à jour effectuée");
    } catch (err) { toast.error("Erreur"); }
  };

  // Intercepteur spécifique au gestionnaire de commerce partenaire
  const handlePartnerMissionClick = async (notificationId, deliveryId) => {
    // 1. Marquer la notification comme lue en arrière-plan
    await handleMarkAsRead(notificationId);
    
    // 2. Charger les détails de la livraison ciblée pour alimenter le composant modale
    try {
      setLoadingDelivery(true);
      const res = await fetchDeliveryById(deliveryId);
      setSelectedDelivery(res.data?.data || res.data);
    } catch (err) {
      console.error("Impossible de récupérer la course :", err);
      toast.error("Données de livraison introuvables.");
    } finally {
      setLoadingDelivery(false);
    }
  };

  const getNotifStyles = (message = "") => {
    const msg = message.toLowerCase();
    if (msg.includes("confirmé") || msg.includes("livré")) return { icon: PackageCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (msg.includes("attention") || msg.includes("annulé")) return { icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" };
    if (msg.includes("livraison") || msg.includes("route")) return { icon: Truck, color: "text-amber-500", bg: "bg-amber-500/10" };
    return { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] pb-32">
      
      {/* HEADER MOBILE-OPTIMIZED */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#080B14]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-primary dark:text-white leading-none">Inbox</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {meta?.total || 0} Notifications
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleMarkAllRead}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 active:scale-90 transition-transform"
          >
            <CheckCheck size={20} />
          </button>
        </div>
      </header>

      {/* FILTER PILLS (Scroll horizontal sur mobile) */}
      <div className="sticky top-[73px] z-30 bg-slate-50/95 dark:bg-[#080B14]/95 backdrop-blur-md py-4 shadow-sm">
        <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar max-w-5xl mx-auto">
          {[
            { id: "all", label: "Tout" },
            { id: "unread", label: "Non lues" },
            { id: "read", label: "Archives" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === f.id 
                  ? "bg-secondary text-white shadow-md shadow-secondary/20" 
                  : "bg-white dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-4 space-y-3">
        {(loading || loadingDelivery) && dbNotifications.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <RefreshCw className="animate-spin text-secondary mx-auto" size={24} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mise à jour...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-white/5">
              <Sparkles size={32} className="text-slate-200" />
            </div>
            <p className="text-sm font-bold text-slate-400 italic">Rien à signaler pour le moment</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((n) => {
                const { icon: Icon, color, bg } = getNotifStyles(n.message);
                const isRead = n.readBy?.includes(user?._id);
                const deliveryId = n.deliveryId || n.data?.deliveryId;

                return (
                  <motion.div
                    key={n._id || n.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`relative rounded-[1.5rem] p-4 transition-all ${
                      isRead 
                        ? "bg-white/40 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5" 
                        : "bg-white dark:bg-[#121826] border-l-4 border-l-secondary shadow-md border-y border-r border-slate-100 dark:border-white/5"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>
                        <Icon size={20} className={color} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            {new Date(n.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          {!isRead && <div className="w-2 h-2 rounded-full bg-secondary shadow-sm shadow-secondary/50" />}
                        </div>

                        <h3 className={`text-sm font-black uppercase tracking-tight mb-1 truncate ${isRead ? "text-slate-500" : "text-primary dark:text-white"}`}>
                          {n.title || "EMENO Update"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                          {n.message}
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                          {deliveryId && (
                            user?.role === "PARTNER_MANAGER" ? (
                              // Rendu spécifique pour le partenaire (Ouvre le modal au lieu de changer d'URL)
                              <button
                                type="button"
                                onClick={() => handlePartnerMissionClick(n._id, deliveryId)}
                                className="flex-1 py-3 bg-primary dark:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center active:scale-95 transition-transform"
                              >
                                {loadingDelivery ? "Chargement..." : "Voir la mission"}
                              </button>
                            ) : (
                              // Rendu par défaut pour l'admin et le client standard (Redirection par URL)
                              <Link
                                to={user?.role === "CLIENT" ? `/client/orders/${deliveryId}` : `/admin/deliveries/${deliveryId}`}
                                onClick={() => !isRead && handleMarkAsRead(n._id)}
                                className="flex-1 py-3 bg-primary dark:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center active:scale-95 transition-transform"
                              >
                                Voir la mission
                              </Link>
                            )
                          )}
                          {!isRead && (
                            <button
                              onClick={() => handleMarkAsRead(n._id)}
                              className={`py-3 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 active:bg-slate-50 ${deliveryId ? "px-4" : "flex-1"}`}
                            >
                              Lu
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* MOBILE PAGINATION */}
            {meta?.pages > 1 && (
              <div className="py-8 space-y-4">
                <div className="flex justify-center">
                  <Pagination meta={meta} setPage={setPage} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* OVERLAY DE SÉCURITÉ : La modale s'ouvre si un partenaire consulte une alerte de course */}
      {selectedDelivery && (
        <PartnerOrderDetailModal 
          delivery={selectedDelivery} 
          onClose={() => setSelectedDelivery(null)} 
        />
      )}
    </div>
  );
}