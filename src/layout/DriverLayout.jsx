// FILE: src/layout/DriverLayout.jsx

import { useState, useMemo } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, X, Home, Package, MapPin, User as UserIcon, Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications"; 
import { useDriver } from "../hooks/useDriver";

export default function DriverLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleDuty, isOnline } = useDriver();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

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
    <div className="min-h-screen bg-slate-50 dark:bg-primary-dark pb-32 transition-colors duration-300">
      
      {/* --- HEADER AMÉLIORÉ --- */}
      <header className="h-24 bg-white/80 dark:bg-primary-light/80 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-primary dark:text-white italic tracking-tighter leading-none">
              EMENO<span className="text-secondary">.</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted">
                Driver App
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Toggle de service rapide dans le header */}
          <button 
            onClick={toggleDuty}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all active:scale-95 ${
              isOnline 
              ? 'bg-success/10 border-success text-success shadow-lg shadow-success/10' 
              : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-white/5 dark:border-white/10'
            }`}
          >
            <Power size={14} className={isOnline ? 'animate-pulse' : ''} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {isOnline ? 'On' : 'Off'}
            </span>
          </button>

          <div className="h-8 w-[1px] bg-slate-100 dark:bg-white/10 mx-1" />

          <button onClick={handleToggleNotifs} className="relative p-2.5 bg-slate-50 dark:bg-white/5 rounded-2xl text-primary dark:text-white active:scale-90 transition-all">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-primary-light">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- DRAWER DE NOTIFICATIONS (Identique mais stylisé) --- */}
      <AnimatePresence>
        {showNotifDrawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifDrawer(false)} className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[60]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-primary-dark z-[70] shadow-2xl p-8 flex flex-col rounded-l-[3rem]">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Flux</p>
                  <h3 className="text-2xl font-black text-primary dark:text-white italic tracking-tighter">Notifications</h3>
                </div>
                <button onClick={() => setShowNotifDrawer(false)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl active:rotate-90 transition-transform"><X size={20}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {displayNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20">
                    <Bell size={48} className="mb-4" />
                    <p className="text-center text-xs font-black uppercase tracking-widest">Tout est calme</p>
                  </div>
                ) : (
                  displayNotifications.map((notif, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      key={notif._id || i} 
                      className="p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5"
                    >
                      <p className="text-[9px] font-black text-secondary uppercase mb-2 tracking-widest">{notif.title}</p>
                      <p className="text-xs font-bold text-primary dark:text-slate-200 leading-relaxed">{notif.message}</p>
                    </motion.div>
                  ))
                )}
              </div>

              <button 
                onClick={() => logout().then(() => navigate("/login"))}
                className="mt-6 flex items-center justify-center gap-3 p-5 bg-red-50 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest active:bg-red-500 active:text-white transition-all"
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-md mx-auto">
        <Outlet />
      </main>

      {/* --- BARRE DE NAVIGATION FLOTTANTE --- */}
      <nav className="fixed bottom-8 left-6 right-6 h-20 bg-primary dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around z-50 border border-white/10 backdrop-blur-xl px-4">
        <NavIcon to="/driver" icon={<Home size={22} />} label="Home" active={location.pathname === "/driver"} />
        <NavIcon to="/driver/deliveries" icon={<Package size={22} />} label="Orders" active={location.pathname === "/driver/deliveries"} />
        <NavIcon to="/driver/map" icon={<MapPin size={22} />} label="Map" active={location.pathname === "/driver/map"} />
        <NavIcon to="/driver/profile" icon={<UserIcon size={22} />} label="User" active={location.pathname === "/driver/profile"} />
      </nav>
    </div>
  );
}

function NavIcon({ to, icon, label, active }) {
  return (
    <NavLink 
      to={to} 
      end={to === "/driver"}
      className="relative flex flex-col items-center justify-center w-16 h-16 transition-all"
    >
      {/* Background indicateur pour l'icône active */}
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-white/10 dark:bg-secondary/20 rounded-2xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      <div className={`relative z-10 transition-colors duration-300 ${active ? 'text-secondary' : 'text-white/40'}`}>
        {icon}
      </div>
      
      <span className={`relative z-10 text-[7px] font-black uppercase tracking-tighter mt-1 transition-colors duration-300 ${active ? 'text-white' : 'text-white/20'}`}>
        {label}
      </span>

      {/* Point de focus sous l'icône active */}
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="absolute -bottom-1 w-1 h-1 bg-secondary rounded-full"
        />
      )}
    </NavLink>
  );
}