import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Truck, Users, Settings } from "lucide-react";

export default function Sidebar() {
  // Mise à jour des couleurs : Vert Sombre (#002D15) pour l'actif, Doré (#B08D3E) pour le hover
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-[#B08D3E] text-white shadow-lg shadow-emerald-900/20"
        : "text-white hover:bg-[#FFF7D6] hover:text-[#000]"
    }`;

  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} />, end: true },
    { to: "/orders", label: "Commandes", icon: <ShoppingCart size={20} /> },
    { to: "/drivers", label: "Livreurs", icon: <Truck size={20} /> },
    { to: "/customers", label: "Clients", icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-72 h-screen bg-[#002D15] border-r border-slate-100 flex flex-col p-6">
      {/* Logo / Brand - Intégration du logo EMENC */}
      {/* Conteneur Logo : Hauteur fixe et marge réduite pour ne pas pousser le menu */}
      <div className="relative h-24 flex items-center justify-center mb-4 px-2">
        <img 
          src="/logo.png" 
          alt="EMENO LIVRAISON" 
          className="absolute h-25 w-auto object-contain max-w-full" 
          /* h-20 agrandit l'image, mb-4 compense pour garder le menu haut */
        />
      </div>
      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            {/* L'icône change aussi de couleur selon l'état actif/hover via linkClass */}
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
