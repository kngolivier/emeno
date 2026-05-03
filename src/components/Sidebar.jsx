// FILE: src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Users,
  DollarSign,
  Shield,
  PlusCircle,
  ClipboardList,
  User,
  LogOutIcon
} from "lucide-react";

import { THEME } from "../utils/theme";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-secondary text-white shadow-lg"
        : "text-white hover:bg-secondary-light hover:text-[#000]"
    }`;

  // ======================
  // MENU PAR ROLE
  // ======================
  const menuByRole = {
    ADMIN: [
      { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/admins", label: "Admins", icon: <Shield size={20} /> },
      { to: "/deliveries", label: "Livraisons", icon: <ShoppingCart size={20} /> },
      { to: "/drivers", label: "Livreurs", icon: <Truck size={20} /> },
      { to: "/clients", label: "Clients", icon: <Users size={20} /> },
      { to: "/pricing", label: "Tarifs", icon: <DollarSign size={20} /> }
    ],

    DRIVER: [
      { to: "/driver", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/driver/deliveries", label: "Mes livraisons", icon: <Truck size={20} /> },
      { to: "/driver/active", label: "En cours", icon: <ClipboardList size={20} /> },
      { to: "/driver/profile", label: "Profil", icon: <User size={20} /> }
    ],

    CLIENT: [
      { to: "/client", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/client/new-order", label: "Nouvelle commande", icon: <PlusCircle size={20} /> },
      { to: "/client/orders", label: "Mes commandes", icon: <ShoppingCart size={20} /> },
      { to: "/client/profile", label: "Profil", icon: <User size={20} /> }
    ]
  };

  const navItems = menuByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="w-72 h-screen flex flex-col p-6 bg-primary"
      style={{ backgroundColor: THEME.colors.primary }}
    >
      {/* LOGO */}
      <div className="h-24 flex items-center justify-center mb-4">
        <img src="/logo.png" className="h-20 object-contain" />
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={linkClass}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 rounded-xl"
      >
        <LogOutIcon size={20} />
        <span>Déconnexion</span>
      </button>
    </aside>
  );
}