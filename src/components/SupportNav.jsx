import { Link } from "react-router-dom";

// FILE: src/components/SupportNav.jsx
export function SupportNav() {
  const links = [
    { name: "Accueil Aide", path: "/help" },
    { name: "FAQ", path: "/faq" },
    { name: "Suivi", path: "/tracking" },
    { name: "Guides", path: "/guides" },
  ];

  return (
    <nav className="flex gap-4 mb-8 border-b border-slate-100 dark:border-white/10 pb-4">
      {links.map(link => (
        <Link key={link.path} to={link.path} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-secondary">
          {link.name}
        </Link>
      ))}
    </nav>
  );
}