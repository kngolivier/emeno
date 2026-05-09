// FILE: src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingCart, Truck, Users, 
  DollarSign, Shield, PlusCircle, ClipboardList, 
  User, LogOutIcon, X, 
  MapPin
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  /**
   * Style dynamique pour les liens de navigation
   */
  const linkClass = ({ isActive }) =>
    `group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 mb-1.5 ${
      isActive
        ? "bg-secondary text-white shadow-lg shadow-secondary/20"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  /**
   * Définition des menus par rôle
   * Le SUPER_ADMIN hérite de la base ADMIN mais avec l'accès à l'équipe en plus.
   */
  const getNavItems = () => {
    const role = user?.role;

    // Items de base pour la gestion administrative
    const adminBase = [
      { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/admin/deliveries", label: "Livraisons", icon: <ShoppingCart size={20} /> },
      { to: "/admin/drivers", label: "Livreurs", icon: <Truck size={20} /> },
      { to: "/admin/clients", label: "Clients", icon: <Users size={20} /> },
      { to: "/admin/pricing", label: "Tarifs", icon: <DollarSign size={20} /> },
      { to: "/admin/communes", label: "Zones", icon: <MapPin size={20} /> }
    ];

    if (role === "SUPER_ADMIN") {
      return [
        ...adminBase,
        { to: "/admin/admins", label: "Équipe & Staff", icon: <Shield size={20} /> },
      ];
    }

    if (role === "ADMIN") {
      return adminBase;
    }

    if (role === "DRIVER") {
      return [
        { to: "/driver", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { to: "/driver/deliveries", label: "Mes courses", icon: <Truck size={20} /> },
        { to: "/driver/profile", label: "Profil", icon: <User size={20} /> },
      ];
    }

    if (role === "CLIENT") {
      return [
        { to: "/client", label: "Aperçu", icon: <LayoutDashboard size={20} /> },
        { to: "/client/new-order", label: "Commande", icon: <PlusCircle size={20} /> },
        { to: "/client/orders", label: "Historique", icon: <ShoppingCart size={20} /> },
        { to: "/client/profile", label: "Mon Profil", icon: <User size={20} /> },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[100] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-primary p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* Header Sidebar / Logo */}
        <div className="flex justify-between items-center mb-10 px-4 pt-2">
          <div className="flex items-center gap-3">
             <img src="/logo.png" alt="EMENO Logo" className="h-8 w-auto" />
             <span className="text-white font-black italic tracking-tighter text-xl">EMENO</span>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6 px-4 italic">
            Menu {user?.role?.replace('_', ' ')}
          </p>
          
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end 
              className={linkClass}
              onClick={() => { if(window.innerWidth < 1024) onClose(); }}
            >
              {item.icon}
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar / Déconnexion */}
        <div className="pt-6 border-t border-white/5">
          <div className="px-5 py-3 mb-4 bg-white/5 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-white">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-bold truncate">{user?.prenom}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-tighter">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center gap-4 px-5 py-3.5 text-rose-300 hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-sm group"
          >
            <LogOutIcon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="uppercase tracking-widest text-[11px]">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}