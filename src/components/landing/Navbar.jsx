// src/components/landing/Navbar.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-primary tracking-tighter italic">
          EMENO<span className="text-secondary">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
          <Link to="/tarifs" className="hover:text-primary transition-colors">Tarifs</Link>
          <a href="#" className="hover:text-primary transition-colors">Services</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors"
          >
            Connexion
          </button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary transition-colors"
          >
            Créer un compte
          </motion.button>
        </div>
      </div>
    </nav>
  );
}