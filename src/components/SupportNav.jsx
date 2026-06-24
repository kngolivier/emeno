// FILE: src/components/SupportNav.jsx
import { Link, useLocation } from "react-router-dom";

export function SupportNav() {
  const location = useLocation();
  
  const links = [
    { name: "Accueil", path: "/help" },
    { name: "FAQ", path: "/faq" },
    { name: "Suivi", path: "/tracking" },
    { name: "Guides", path: "/guides" },
  ];

  return (
    <nav className="flex items-center justify-center gap-2 mb-16">
      <div className="inline-flex items-center gap-1 p-1.5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`
                px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300
                ${isActive 
                  ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                  : "text-slate-400 hover:text-primary dark:hover:text-white"
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}