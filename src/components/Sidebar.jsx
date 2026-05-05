// FILE: src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingCart, Truck, Users, 
  DollarSign, Shield, PlusCircle, ClipboardList, 
  User, LogOutIcon 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Style des liens : plus propre, moins agressif
  const linkClass = ({ isActive }) =>
    `group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 mb-1.5 ${
      isActive
        ? "bg-secondary text-white shadow-lg shadow-secondary/20"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  const menuByRole = {
    ADMIN: [
      { to: "/admin", label: "Tableau de bord", icon: <LayoutDashboard size={20} /> },
      { to: "/admin/deliveries", label: "Livraisons", icon: <ShoppingCart size={20} /> },
      { to: "/admin/drivers", label: "Livreurs", icon: <Truck size={20} /> },
      { to: "/admin/clients", label: "Clients", icon: <Users size={20} /> },
      { to: "/admin/pricing", label: "Tarifs", icon: <DollarSign size={20} /> },
      { to: "/admin/admins", label: "Équipe", icon: <Shield size={20} /> },
    ],
    DRIVER: [
      { to: "/driver", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/driver/deliveries", label: "Mes courses", icon: <Truck size={20} /> },
      { to: "/driver/active", label: "En cours", icon: <ClipboardList size={20} /> },
      { to: "/driver/profile", label: "Profil", icon: <User size={20} /> }
    ],
    CLIENT: [
      { to: "/client", label: "Aperçu", icon: <LayoutDashboard size={20} /> },
      { to: "/client/new-order", label: "Nouvelle commande", icon: <PlusCircle size={20} /> },
      { to: "/client/orders", label: "Historique", icon: <ShoppingCart size={20} /> },
      { to: "/client/profile", label: "Mon Profil", icon: <User size={20} /> }
    ]
  };

  const navItems = menuByRole[user?.role] || [];

  return (
    <aside className="w-72 h-screen flex flex-col p-6 bg-primary sticky top-0 z-50 shadow-2xl">
      {/* LOGO : Plus compact */}
      <div className="mb-10 px-4 pt-2">
        <img src="/logo.png" alt="Logo"/>
      </div>

      {/* NAVIGATION : Texte clair et posé */}
      <nav className="flex-1">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 px-4">
          Menu Principal
        </p>
        
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end className={linkClass}>
            <span className="opacity-80 group-hover:opacity-100 transition-opacity">
              {item.icon}
            </span>
            <span className="font-medium text-sm tracking-wide">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT : Design épuré mais distinctif */}
      <div className="pt-6 border-t border-white/10">
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-4 px-5 py-3.5 text-red-300 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all duration-200 font-semibold text-sm"
        >
          <LogOutIcon size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}