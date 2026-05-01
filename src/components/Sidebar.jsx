// FILE: src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  LogOut,
  DollarSign,
  Shield
} from "lucide-react";

import { THEME } from "../utils/theme";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-secondary text-white shadow-lg"
        : "text-white hover:bg-secondary-light hover:text-[#000]"
    }`;

  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} />, end: true },
    { to: "/admins", label: "Administrateurs", icon: <Shield size={20} /> },
    { to: "/deliveries", label: "Livraisons", icon: <ShoppingCart size={20} /> },
    { to: "/drivers", label: "Livreurs", icon: <Truck size={20} /> },
    { to: "/clients", label: "Clients", icon: <Users size={20} /> },
    { to: "/pricing", label: "Tarifs de livraison", icon: <DollarSign size={20} />}, 
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="w-72 h-screen flex flex-col p-6 border-r border-slate-100 bg-primary"
      style={{ backgroundColor: THEME.colors.primary }}
    >
      {/* LOGO */}
      <div className="relative h-24 flex items-center justify-center mb-4 px-2">
        <img
          src="/logo.png"
          alt="EMENC LIVRAISON"
          className="absolute h-25 w-auto object-contain max-w-full"
        />
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* SETTINGS (AJOUT REPO CONSERVÉ) */}
      {/* <div className="pt-6 border-t border-white/10">
        <NavLink to="/settings" className={linkClass}>
          <Settings size={20} />
          <span className="font-medium">Paramètres</span>
        </NavLink>
      </div> */}

      {/* LOGOUT (TON LOGIQUE CONSERVÉE) */}
      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full
                     text-red-300 hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}