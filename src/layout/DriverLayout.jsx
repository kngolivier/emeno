// FILE: src/layout/DriverLayout.jsx

import { useState, useMemo, useEffect } from "react"; // 💡 Ajout de useEffect
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Bell, BellOff, LogOut, X, Home, Package, MapPin, User as UserIcon, Power, ChevronRight } from "lucide-react"; // 💡 Ajout de BellOff
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications"; 
import { useDriver } from "../hooks/useDriver";
import { savePushSubscription } from "../api/notifications.api"; // 💡 Import indispensable
import { notifySuccess, notifyError } from "../utils/notify";     // 💡 Import indispensable

export default function DriverLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleDuty, isOnline } = useDriver();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  // 💡 GESTION DU STATUT DES ALERTES PUSH
  const [pushStatus, setPushStatus] = useState("default");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "notifications" }).then((result) => {
        // Met à jour l'interface si l'utilisateur change la permission dans le cadenas du navigateur
        result.onchange = () => setPushStatus(result.state);
      });
    }
    if ("Notification" in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handlePushSubscription = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      notifyError("Les notifications ne sont pas supportées sur ce navigateur.");
      return;
    }

    try {
      setIsSubmitting(true);
      const permission = await Notification.requestPermission();
      setPushStatus(permission);

      if (permission !== "granted") {
        notifyError("Permission refusée. Active les notifications dans les réglages.");
        setIsSubmitting(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

      if (!VAPID_PUBLIC_KEY) {
        console.error("[VAPID] VITE_VAPID_PUBLIC_KEY manquante dans le .env");
        notifyError("Erreur de configuration des notifications.");
        setIsSubmitting(false);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await savePushSubscription({
        subscription,
        userId: user?.id,
        role: user?.role
      });

      notifySuccess("Notifications EMENO activées avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'abonnement push :", error);
      notifyError(error.message || "Impossible d'activer les notifications.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayNotifications = useMemo(() => {
    const seen = new Set();
    return notifications.filter(n => {
      const id = n._id || n.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [notifications]);

  const handleToggleNotifs = () => {
    if (!showNotifDrawer && unreadCount > 0) markAllAsRead();
    setShowNotifDrawer(!showNotifDrawer);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pb-32 transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <header className="h-24 bg-white/90 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between px-6 sticky top-0 z-[60] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex flex-col select-none cursor-pointer" onClick={() => navigate("/driver")}>
              <h1 className="text-2xl font-black text-primary dark:text-white tracking-tight leading-none uppercase font-sans">
                Emeno
              </h1>
              <span className="text-[7px] font-black text-secondary uppercase tracking-[0.35em] mt-0.5 pl-0.5 block leading-none">
                Livraison
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                {isOnline ? 'En service' : 'Hors ligne'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDuty}
            className={`relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-[1.2rem] border-2 transition-all active:scale-95 group
              ${isOnline 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/5' 
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              {isOnline ? 'Live' : 'Off'}
            </span>
            <div className={`p-1 rounded-lg ${isOnline ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
              <Power size={12} strokeWidth={3} />
            </div>
          </button>

          <button onClick={handleToggleNotifs} className="relative p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-primary dark:text-white active:scale-90 transition-all border border-transparent dark:border-slate-700/50">
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-secondary text-primary text-[10px] font-black flex items-center justify-center rounded-full border-4 border-white dark:border-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- NOTIFICATION DRAWER --- */}
      <AnimatePresence>
        {showNotifDrawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifDrawer(false)} className="fixed inset-0 bg-primary/60 dark:bg-black/80 backdrop-blur-md z-[70]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-[88%] max-w-md bg-white dark:bg-slate-900 z-[80] shadow-2xl p-8 flex flex-col rounded-l-[3rem] border-l border-white/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] italic block mb-2">Centre de contrôle</span>
                  <h3 className="text-3xl font-black text-primary dark:text-white italic tracking-tighter uppercase">Messages</h3>
                </div>
                <button onClick={() => setShowNotifDrawer(false)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] text-slate-400 active:rotate-90 transition-all">
                  <X size={24} strokeWidth={3}/>
                </button>
              </div>

              {/* 💡 BOUTON D'ACTIVATION DES ALERTES PUSH INTÉGRÉ ICI */}
              {"Notification" in window && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handlePushSubscription}
                    disabled={pushStatus === "granted" || isSubmitting}
                    className={`w-full flex items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300 text-xs font-black uppercase tracking-wider border active:scale-95 ${
                      pushStatus === "granted"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default"
                        : pushStatus === "denied"
                        ? "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : "border-secondary bg-secondary/5 text-secondary hover:bg-secondary hover:text-white shadow-md shadow-secondary/5"
                    }`}
                  >
                    {pushStatus === "granted" ? (
                      <>
                        <Bell size={18} className="text-emerald-500 shrink-0" />
                        <span className="normal-case font-bold text-slate-700 dark:text-emerald-300">Alertes push activées</span>
                      </>
                    ) : pushStatus === "denied" ? (
                      <>
                        <BellOff size={18} className="text-rose-500 shrink-0" />
                        <span className="normal-case font-bold text-slate-600 dark:text-rose-300">Alertes bloquées sur l'appareil</span>
                      </>
                    ) : (
                      <>
                        <Bell 
                          size={18} 
                          className={`shrink-0 ${isSubmitting ? "animate-spin" : "animate-pulse"}`} 
                        />
                        <span className="normal-case text-primary dark:text-white font-black">
                          {isSubmitting ? "Activation..." : "Recevoir les alertes de course"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {displayNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-200 dark:text-slate-800">
                    <Bell size={80} strokeWidth={1} className="mb-6 opacity-20" />
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Aucune nouvelle alerte</p>
                  </div>
                ) : (
                  displayNotifications.map((notif, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      key={notif._id || i} 
                      className="p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 group hover:border-secondary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{notif.title}</span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase italic">Maintenant</span>
                      </div>
                      <p className="text-sm font-bold text-primary dark:text-slate-200 leading-snug tracking-tight">{notif.message}</p>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="pt-8 space-y-4">
                 <button 
                  onClick={() => logout().then(() => navigate("/login"))}
                  className="w-full flex items-center justify-between p-6 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-[2rem] font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} strokeWidth={3} /> 
                    <span>Fermer la session</span>
                  </div>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-md mx-auto px-4 pt-6">
        <Outlet />
      </main>

      {/* --- FLOATING TAB BAR --- */}
      <nav className="fixed bottom-6 left-6 right-6 h-22 bg-primary dark:bg-slate-900/90 rounded-[2.8rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex items-center justify-around z-[55] border border-white/10 backdrop-blur-2xl px-4 ring-1 ring-black/5 p-5">
        <NavIcon to="/driver" icon={<Home size={24} />} label="Accueil" active={location.pathname === "/driver"} />
        <NavIcon to="/driver/deliveries" icon={<Package size={24} />} label="Courses" active={location.pathname === "/driver/deliveries"} />
        <NavIcon to="/driver/profile" icon={<UserIcon size={24} />} label="Compte" active={location.pathname === "/driver/profile"} />
      </nav>
    </div>
  );
}

function NavIcon({ to, icon, label, active }) {
  return (
    <NavLink 
      to={to} 
      end={to === "/driver"}
      className="relative flex flex-col items-center justify-center w-20 h-full transition-all"
    >
      <div className={`relative z-10 flex flex-col items-center transition-all duration-300 ${active ? 'scale-110' : 'opacity-40 hover:opacity-70'}`}>
        <div className={`mb-1 transition-colors duration-300 ${active ? 'text-secondary' : 'text-white'}`}>
          {icon}
        </div>
        <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-colors duration-300 ${active ? 'text-white' : 'text-white/60'}`}>
          {label}
        </span>
      </div>

      {active && (
        <>
          <motion.div 
            layoutId="nav-bg"
            className="absolute inset-x-2 inset-y-3 bg-white/5 dark:bg-secondary/10 rounded-[1.8rem]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
          <motion.div 
            layoutId="nav-glow"
            className="absolute -bottom-2 w-8 h-1 bg-secondary rounded-full shadow-[0_0_15px_rgba(242,201,76,0.6)]"
          />
        </>
      )}
    </NavLink>
  );
}