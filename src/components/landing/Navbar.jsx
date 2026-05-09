// src/components/landing/Navbar.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, ArrowRight } from "lucide-react";
import { useTheme } from "../../context/Theme/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 lg:px-6 lg:py-6">
      <div className="max-w-7xl mx-auto relative">
        <div className="bg-white/80 dark:bg-primary-dark/90 backdrop-blur-2xl border border-white/20 dark:border-white/5 px-5 lg:px-10 py-3 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-black/5 transition-all duration-500">
          
          {/* LOGO - Taille réduite sur mobile */}
          <Link to="/" className="flex items-center z-[110] transition-transform hover:scale-105 active:scale-95">
            <span className="text-lg lg:text-3xl font-black text-primary tracking-tighter italic transition-colors">
              EMENO<span className="text-secondary">.</span>
            </span>
          </Link>

          {/* NAVIGATION CENTRALE (DESKTOP) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5">
            <NavLink to="/" active={isActive("/")}>Accueil</NavLink>
            <NavLink to="/tarifs" active={isActive("/tarifs")}>Tarifs</NavLink>
            <NavLink to="/services" active={isActive("/services")}>Services</NavLink>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 lg:gap-3 z-[110]">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-slate-50 dark:bg-primary-light text-slate-400 dark:text-yellow-400 hover:scale-110 transition-all active:scale-90 border border-slate-100 dark:border-white/10"
            >
              {isDarkMode ? <Sun size={18} lg:size={20} strokeWidth={2.5} /> : <Moon size={18} lg:size={20} strokeWidth={2.5} />}
            </button>

            <button 
              onClick={() => navigate("/login")}
              className="hidden sm:block px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 hover:text-secondary transition-colors"
            >
              Connexion
            </button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="hidden sm:flex px-6 py-4 bg-primary dark:bg-secondary text-white dark:text-primary-dark text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/10 dark:shadow-secondary/20 transition-all"
            >
              Démarrer
            </motion.button>

            {/* TOGGLE MOBILE - Légèrement plus compact */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-xl bg-primary dark:bg-secondary text-white dark:text-primary-dark transition-all active:scale-90 shadow-lg shadow-primary/10"
            >
              {isOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>

        {/* OVERLAY MENU MOBILE OPTIMISÉ */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-20 lg:top-24 left-0 right-0 md:hidden z-[105]"
            >
              <div className="bg-white dark:bg-primary-dark border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="flex flex-col gap-6">
                  <MobileNavLink to="/" label="Accueil" active={isActive("/")} />
                  <MobileNavLink to="/tarifs" label="Tarifs" active={isActive("/tarifs")} />
                  <MobileNavLink to="/services" label="Services" active={isActive("/services")} />
                  
                  <div className="h-[1px] bg-slate-100 dark:bg-white/5 my-2" />
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => navigate("/login")}
                      className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-primary dark:text-white border-2 border-slate-100 dark:border-white/10 rounded-xl"
                    >
                      Connexion
                    </button>
                    
                    <button 
                      onClick={() => navigate("/register")}
                      className="w-full py-4 bg-secondary text-primary-dark text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-secondary/20"
                    >
                      Démarrer
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link 
      to={to} 
      className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
        active 
          ? "bg-white dark:bg-secondary text-primary dark:text-primary-dark shadow-sm" 
          : "text-slate-400 hover:text-primary dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

// MobileNavLink - Police réduite de 3xl à xl/2xl
function MobileNavLink({ to, label, active }) {
  return (
    <Link to={to} className="flex items-center justify-between group">
      <span className={`text-xl font-black italic tracking-tighter uppercase transition-colors ${
        active ? "text-secondary" : "text-primary dark:text-white"
      }`}>
        {label}
      </span>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        active ? "bg-secondary text-primary-dark" : "bg-slate-50 dark:bg-white/5 text-slate-300"
      }`}>
        <ArrowRight size={18} className={active ? "" : "group-hover:translate-x-1 transition-transform"} />
      </div>
    </Link>
  );
}