// FILE: src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingCart, Truck, Users, 
  DollarSign, Shield, PlusCircle, 
  User, LogOutIcon, X, 
  MapPin,
  HomeIcon,
  Store
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/Theme/ThemeContext";

export default function Sidebar({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  /**
   * Style dynamique EMENO
   * Utilise le orange (#fcb045) pour l'état actif et des contrastes doux pour le repos
   */
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

    if (role === "SUPER_ADMIN") return [...adminBase, { to: "/admin/admins", label: "Équipe", icon: <Shield size={20} /> }];
    if (role === "ADMIN") return adminBase;
    if (role === "DRIVER") return [
      { to: "/driver", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/driver/deliveries", label: "Mes courses", icon: <Truck size={20} /> },
      { to: "/driver/profile", label: "Profil", icon: <User size={20} /> },
    ];
    if (role === "CLIENT") return [
      { to: "/client", label: "Accueil", icon: <HomeIcon size={20} /> },
      { to: "/client/dashboard", label: "Aperçu", icon: <LayoutDashboard size={20} /> },
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

      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-white dark:bg-primary p-6 flex flex-col shadow-2xl transition-transform duration-500 ease-out
        lg:static lg:translate-x-0 border-r border-slate-100 dark:border-white/5
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* LOGO & CLOSE */}
        <div className="flex justify-between items-center mb-10 px-2">
          <div className="flex items-center gap-3">
             <img 
               src={isDarkMode ? "/logo.png" : "/logo-dark.png"} 
               alt="EMENO" 
               className="h-25 w-auto object-contain transition-opacity duration-300" 
             />
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="mb-6 px-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em] italic">
              Espace {user?.role?.toLowerCase()}
            </p>
          </div>
          
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end className={linkClass} onClick={() => window.innerWidth < 1024 && onClose()}>
              <span className="opacity-80 group-hover:opacity-100 transition-opacity">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* PROFILE & LOGOUT */}
        <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
          <div className="px-4 py-4 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center gap-3 border border-transparent dark:border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-xs font-black text-white shadow-lg shadow-secondary/30">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-primary dark:text-white text-sm font-black truncate italic">{user?.prenom}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center gap-4 px-5 py-4 text-red-500 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all group"
          >
            <LogOutIcon size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="font-black uppercase tracking-widest text-[10px]">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}