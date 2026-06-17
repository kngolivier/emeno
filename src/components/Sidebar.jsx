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
  Clock,
  Gift,
  Layers2,
  MessageSquareHeart
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/Theme/ThemeContext";
import { ROLE_LABELS } from "../constants/constants";
import { savePushSubscription } from "../api/notifications.api";
import { logoutUser } from "../api/auth.api";
import { notifySuccess, notifyError } from "../utils/notify";
// import { usePwaInstall } from "../hooks/usePwaInstall";


export default function Sidebar({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [pushStatus, setPushStatus] = useState("default");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Remplacez votre useEffect actuel par celui-ci
  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "notifications" }).then((result) => {
        // Met à jour l'interface si l'utilisateur change la permission dans le cadenas du navigateur
        result.onchange = () => setPushStatus(result.state);
      });
    }
    const checkPushStatus = async () => {
      if ("Notification" in window && "serviceWorker" in navigator) {
        // 1. Mise à jour initiale du statut de permission
        setPushStatus(Notification.permission);
        
        // 2. Vérification si une souscription existe déjà
        try {
          const registration = await navigator.serviceWorker.ready;
          const sub = await registration.pushManager.getSubscription();
          if (sub && Notification.permission === "granted") {
            setPushStatus("granted");
          }
        } catch (err) {
          console.error("Erreur vérification push:", err);
        }
      }
    };
    checkPushStatus();
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
      notifyError("Notifications non supportées par votre navigateur.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Demander la permission si ce n'est pas déjà fait
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      
      if (permission !== "granted") {
        notifyError("Veuillez autoriser les notifications dans vos paramètres.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Nettoyer toute ancienne souscription invalide avant d'en créer une nouvelle
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) await existingSub.unsubscribe();

      const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Envoi au backend
      await savePushSubscription({ subscription, userId: user?.id, role: user?.role });
      notifySuccess("Alertes activées avec succès !");
    } catch (error) {
      console.error("Push Error:", error);
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

  const getNavGroups = () => {
    const role = user?.role;
    const groups = [];

    // --- ADMINISTRATION (ADMIN / SUPER_ADMIN) ---
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      groups.push(
        { title: "Principal", items: [
          { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
          { to: "/admin/deliveries", label: "Livraisons", icon: <ShoppingCart size={18} /> },
        ]},
        { title: "Opérations", items: [
          { to: "/admin/drivers", label: "Livreurs", icon: <Truck size={18} /> },
          { to: "/admin/clients", label: "Clients", icon: <Users size={18} /> },
          { to: "/admin/partners", label: "Partenaires", icon: <Store size={18} /> },
        ]},
        { title: "Configuration", items: [
          { to: "/admin/pricing", label: "Tarifs", icon: <DollarSign size={18} /> },
          { to: "/admin/communes", label: "Zones", icon: <MapPin size={18} /> },
          { to: "/admin/promotions", label: "Promotions", icon: <Gift size={18} /> },
          { to: "/admin/services", label: "Services", icon: <Layers2 size={18} /> },
          { to: "/admin/feedbacks", label: "Avis", icon: <MessageSquareHeart size={18} /> },
        ]}
      );
      if (role === "SUPER_ADMIN") {
        groups.push({ title: "Système", items: [
          { to: "/admin/admins", label: "Équipe", icon: <Shield size={18} /> },
          { to: "/admin/audit-logs", label: "Logs", icon: <Clock size={18} /> },
          { to: "/admin/settings", label: "Paramètres", icon: <Settings size={18} /> },
        ]});
      }
    }

    // --- CLIENT ---
    if (role === "CLIENT") {
      groups.push(
        { title: "Navigation", items: [
          { to: "/client", label: "Accueil", icon: <HomeIcon size={18} /> },
          { to: "/client/new-order", label: "Nouvelle course", icon: <PlusCircle size={18} /> },
        ]},
        { title: "Suivi", items: [
          { to: "/client/orders", label: "Mes commandes", icon: <ShoppingCart size={18} /> },
          { to: "/client/profile", label: "Mon Profil", icon: <User size={18} /> },
        ]}
      );
    }

    // --- DRIVER ---
    if (role === "DRIVER") {
      groups.push(
        { title: "Activité", items: [
          { to: "/driver", label: "Tableau de bord", icon: <LayoutDashboard size={18} /> },
          { to: "/driver/deliveries", label: "Mes courses", icon: <Truck size={18} /> },
        ]},
        { title: "Compte", items: [
          { to: "/driver/profile", label: "Mon Profil", icon: <User size={18} /> },
        ]}
      );
    }

    // --- PARTNER ---
    if (role === "PARTNER_MANAGER") {
      groups.push(
        { title: "Gestion", items: [
          { to: "/partner/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
          { to: "/partner/orders", label: "Expéditions", icon: <Layers size={18} /> },
        ]},
        { title: "Catalogue", items: [
          { to: "/partner/catalog", label: "Produits", icon: <Package size={18} /> },
          { to: "/partner/settings", label: "Paramètres", icon: <Settings size={18} /> },
        ]}
      );
    }

    return groups;
  };

  // const navItems = getNavItems();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-[100] lg:hidden" onClick={onClose} />}

      {/* 1. h-screen + flex-col assure une hauteur fixe de 100vh */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-white dark:bg-primary p-6 flex flex-col shadow-2xl transition-transform duration-500 ease-out h-[97vh]
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
        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 space-y-8 pb-8">
          {getNavGroups().map((group, idx) => (
            <div key={idx}>
              {/* Titre de catégorie */}
              <p className="px-5 mb-3 text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] italic">
                {group.title}
              </p>
              
              {/* Liens de la catégorie */}
              {group.items.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  end 
                  className={linkClass} 
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
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