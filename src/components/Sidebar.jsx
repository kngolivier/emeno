// FILE: src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingCart, Truck, Users, 
  DollarSign, Shield, PlusCircle, 
  User, LogOutIcon, X, 
  MapPin, HomeIcon, Store, Settings, Layers,
  Bell, BellOff,
  Package,
  Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/Theme/ThemeContext";
import { ROLE_LABELS } from "../constants/constants";
import { savePushSubscription } from "../api/notifications.api";
import { logoutUser } from "../api/auth.api";
import { notifySuccess, notifyError } from "../utils/notify";

export default function Sidebar({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [pushStatus, setPushStatus] = useState("default");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  const handleLogoutClick = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Erreur déconnexion", err);
    } finally {
      logout();
      navigate("/login");
    }
  };

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
      notifyError("Notifications non supportées.");
      return;
    }
    try {
      setIsSubmitting(true);
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      if (permission !== "granted") {
        notifyError("Permission refusée.");
        setIsSubmitting(false);
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!VAPID_PUBLIC_KEY) return;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await savePushSubscription({ subscription, userId: user?.id, role: user?.role });
      notifySuccess("Notifications activées !");
    } catch (error) {
      notifyError("Impossible d'activer les notifications.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 mb-1.5 font-bold text-sm tracking-wide ${
      isActive
        ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]"
        : "text-slate-500 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-white"
    }`;

  const getNavItems = () => {
    const role = user?.role;
    const adminBase = [
      { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/admin/deliveries", label: "Livraisons", icon: <ShoppingCart size={20} /> },
      { to: "/admin/drivers", label: "Livreurs", icon: <Truck size={20} /> },
      { to: "/admin/clients", label: "Clients", icon: <Users size={20} /> },
      { to: "/admin/pricing", label: "Tarifs", icon: <DollarSign size={20} /> },
      { to: "/admin/communes", label: "Zones", icon: <MapPin size={20} /> },
      { to: "/admin/partners", label: "Partenaires", icon: <Store size={20} /> },
    ];
    if (role === "PARTNER_MANAGER") return [
      { to: "/partner", label: "Accueil", icon: <HomeIcon size={20} /> },
      { to: "/partner/dashboard", label: "Vue d'ensemble", icon: <LayoutDashboard size={20} /> },
      { to: "/partner/orders", label: "Expéditions", icon: <Layers size={20} /> },
      { to: "/partner/catalog", label: "Catalogue", icon: <Package size={20} /> },
      { to: "/partner/settings", label: "Mon Établissement", icon: <Settings size={20} /> },
    ];
    if (role === "SUPER_ADMIN") return [
      ...adminBase, { to: "/admin/admins", 
      label: "Équipe", icon: <Shield size={20} /> },
      { to: "/admin/audit-logs", label: "Journal d'activité", icon: <Clock size={20} /> },
    ];
    if (role === "ADMIN") return adminBase;
    if (role === "DRIVER") return [
      { to: "/driver", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/driver/deliveries", label: "Mes courses", icon: <Truck size={20} /> },
      { to: "/driver/profile", label: "Profil", icon: <User size={20} /> },
    ];
    if (role === "CLIENT") return [
      { to: "/client", label: "Accueil", icon: <HomeIcon size={20} /> },
      { to: "/client/new-order", label: "Commande", icon: <PlusCircle size={20} /> },
      { to: "/client/orders", label: "Historique", icon: <ShoppingCart size={20} /> },
      { to: "/client/profile", label: "Mon Profil", icon: <User size={20} /> },
    ];
    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[100] lg:hidden" onClick={onClose} />}

      {/* 1. h-screen + flex-col assure une hauteur fixe de 100vh */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-white dark:bg-primary p-6 flex flex-col shadow-2xl transition-transform duration-500 ease-out h-screen
        lg:fixed lg:translate-x-0 border-r border-slate-100 dark:border-white/5
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* 2. shrink-0 empêche le header de rétrécir même si le contenu nav est long */}
        <div className="flex justify-between items-center mb-10 px-2 shrink-0">
          <img src={isDarkMode ? "/logo.png" : "/logo-dark.png"} alt="EMENO" className="h-16 w-auto object-contain" />
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* 3. flex-1 permet de prendre tout l'espace disponible, overflow-y-auto active le scroll si besoin */}
        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
          <div className="mb-6 px-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em] italic">
              Espace {ROLE_LABELS[user?.role] || user?.role?.toLowerCase()}
            </p>
          </div>
          
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end className={linkClass} onClick={() => window.innerWidth < 1024 && onClose()}>
              <span className="opacity-80 group-hover:opacity-100 transition-opacity">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* 4. shrink-0 maintient le footer collé en bas sans jamais être écrasé */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2.5 shrink-0">
          {"Notification" in window && (
            <div className="w-full px-0.5">
              <button
                type="button"
                onClick={handlePushSubscription}
                disabled={pushStatus === "granted" || isSubmitting}
                className={`w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-[11px] font-bold uppercase tracking-wider border block ${
                  pushStatus === "granted" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-secondary/30 bg-secondary/5 text-secondary hover:bg-secondary hover:text-white"
                }`}
              >
                {pushStatus === "granted" ? <Bell size={16} /> : <Bell size={16} className={isSubmitting ? "animate-spin" : ""} />}
                <span className="truncate">{pushStatus === "granted" ? "Alertes actives" : "Activer alertes"}</span>
              </button>
            </div>
          )}
          <div className="px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-xs font-black text-white shrink-0">
               {user?.prenom?.[0]}{user?.nom?.[0]}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-primary dark:text-white text-xs font-black truncate">{user?.prenom}</p>
               <p className="text-slate-400 text-[8px] font-bold uppercase">{ROLE_LABELS[user?.role]}</p>
             </div>
          </div>
          <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
            <LogOutIcon size={18} />
            <span className="font-black uppercase text-[9px]">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}