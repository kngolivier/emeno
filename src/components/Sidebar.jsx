import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Truck, Users, Settings } from "lucide-react";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
    }`;

  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} />, end: true },
    { to: "/orders", label: "Commandes", icon: <ShoppingCart size={20} /> },
    { to: "/drivers", label: "Livreurs", icon: <Truck size={20} /> },
    { to: "/customers", label: "Clients", icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col p-6">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">E</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Emeno Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Settings */}
      <div className="pt-6 border-t border-slate-100">
        <NavLink to="/settings" className={linkClass}>
          <Settings size={20} />
          <span className="font-medium">Paramètres</span>
        </NavLink>
      </div>
    </aside>
  );
}