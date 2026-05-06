// FILE: src/components/layout/Header.jsx
import { Bell, Search, Menu, ChevronRight, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/Theme/ThemeContext";
import { useNotifications } from "../hooks/useNotifications";
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { unreadCount, notifications, markAllAsRead } = useNotifications();
  const [openNotif, setOpenNotif] = useState(false);
  const location = useLocation();

  const role = user?.role;

  const validNotifications = useMemo(() => {
    const seen = new Set();
    return notifications.filter(n => {
      const id = n._id || n.data?.deliveryId;
      if (seen.has(id)) return false;
      seen.add(id);
      return n.deliveryId ?? n?.data?.deliveryId;
    });
  }, [notifications]);

  return (
    <header className="h-20 lg:h-24 bg-white/90 dark:bg-primary backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-4 lg:px-10 flex justify-between items-center sticky top-0 z-[90] transition-colors duration-300">
      
      <div className="flex items-center gap-4 flex-1">
        {/* BOUTON HAMBURGER MOBILE */}
        <button 
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-3 text-primary dark:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all active:scale-95 flex items-center justify-center"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>

        {/* BREADCRUMB CHIC */}
        <div className="hidden xl:flex items-center gap-2 text-slate-300 dark:text-secondary">
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{role}</span>
           <ChevronRight size={14} />
           <span className="text-primary dark:text-white/80 font-black italic capitalize tracking-tighter">
             {location.pathname.split('/').pop() || 'Dashboard'}
           </span>
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative w-full max-w-[280px] group hidden md:block ml-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-slate-50/50 dark:bg-white rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold text-primary dark:text-black outline-none border-2 border-transparent focus:border-secondary/10 focus:bg-white dark:focus:bg-secondary-light transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4 relative">
        
        {/* BOUTON THEME SWITCHER */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90 flex items-center justify-center border border-transparent dark:border-slate-700"
          title={isDarkMode ? "Mode Clair" : "Mode Sombre"}
        >
          {isDarkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
        </button>

        {/* NOTIFICATIONS */}
        <div className="relative">
          <button 
            onClick={() => { setOpenNotif(!openNotif); if(!openNotif) markAllAsRead(); }}
            className={`relative p-3 rounded-2xl transition-all ${openNotif ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Bell size={20} strokeWidth={2.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-black bg-rose-500 text-white rounded-full ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 top-16 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-50 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h4 className="font-black text-primary dark:text-white uppercase text-[10px] tracking-widest">Activités</h4>
                <span className="bg-primary dark:bg-secondary text-white text-[10px] px-2.5 py-1 rounded-full font-black">{validNotifications.length}</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {validNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-300 dark:text-slate-600 text-xs font-bold uppercase italic tracking-widest">Vide</div>
                ) : (
                  validNotifications.map((n, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl transition-colors cursor-pointer mb-1 group">
                       <p className="text-xs font-bold text-primary dark:text-slate-300 group-hover:text-secondary transition-colors line-clamp-2">
                         {n.message || "Notification sans message"}
                       </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFIL UTILISATEUR */}
        <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-slate-100 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] lg:text-xs font-black text-primary dark:text-white leading-none uppercase italic tracking-tighter">
              {user?.nom}
            </p>
            <p className="text-[8px] font-black text-secondary uppercase opacity-60 tracking-[0.2em] mt-1">
              {role}
            </p>
          </div>
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/90 text-primary flex items-center justify-center rounded-2xl font-black text-sm shadow-lg border-2 border-white dark:border-slate-800 ring-4 ring-slate-50 dark:ring-slate-800/50">
            {user?.nom?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}