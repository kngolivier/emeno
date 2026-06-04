// src/components/landing/Navbar.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, ArrowRight, Wallet } from "lucide-react";
import { useTheme } from "../../context/Theme/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  // Gestion du scroll pour réduire la navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile au changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 lg:px-8 ${
      scrolled ? "py-3 lg:py-4" : "py-6 lg:py-8"
    }`}>
      <div className="max-w-7xl mx-auto relative">
        <div className={`
          relative flex items-center justify-between px-5 lg:px-8 py-3 rounded-[2rem] lg:rounded-[2.5rem] 
          transition-all duration-700 border
          ${scrolled 
            ? "bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-2xl border-slate-100 dark:border-white/10 shadow-2xl shadow-black/5" 
            : "bg-white/50 dark:bg-white/5 backdrop-blur-md border-white/20 dark:border-white/5 shadow-none"
          }
        `}>
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center z-[110] group">
            <span className="text-xl lg:text-2xl font-black text-primary dark:text-white tracking-tighter italic transition-all group-hover:scale-105">
              EMENO Livraison<span className="text-secondary">.</span>
            </span>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-1 bg-slate-200/30 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5">
            <NavLink to="/" active={isActive("/")}>Accueil</NavLink>
            <NavLink to="/tarifs" active={isActive("/tarifs")}>Tarifs</NavLink>
            <NavLink to="/tracking" active={isActive("/tracking")}>Suivi</NavLink>
            {/* <NavLink to="/services" active={isActive("/services")}>Services</NavLink> */}
          </div>

          {/* --- ACTIONS --- */}
          <div className="flex items-center gap-2 lg:gap-4 z-[110]">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-yellow-400 hover:rotate-12 transition-all active:scale-90 border border-transparent dark:border-white/5"
            >
              {isDarkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>

            {/* Login Link */}
            <button 
              onClick={() => navigate("/login")}
              className="hidden lg:block px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-secondary dark:hover:text-secondary transition-colors"
            >
              Connexion
            </button>

            {/* Main CTA */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="hidden sm:flex items-center gap-2 px-6 py-4 bg-primary dark:bg-secondary text-white dark:text-primary-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/10 dark:shadow-secondary/20 transition-all"
            >
              Démarrer
              <ArrowRight size={14} className="hidden lg:block" />
            </motion.button>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-xl bg-primary dark:bg-secondary text-white dark:text-primary-dark transition-all active:scale-90 shadow-lg shadow-primary/10"
            >
              {isOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU OVERLAY --- */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/80 dark:bg-[#050810]/80 backdrop-blur-xl md:hidden z-[105]"
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="fixed top-24 left-6 right-6 md:hidden z-[110]"
              >
                <div className="flex flex-col gap-6">
                  {/* Navigation Links */}
                  <div className="flex flex-col gap-2">
                    <MobileNavLink to="/" label="Accueil" active={isActive("/")} />
                    <MobileNavLink to="/tarifs" label="Tarifs" active={isActive("/tarifs")} />
                    <MobileNavLink to="/tracking" label="Suivi Colis" active={isActive("/tracking")} />
                  </div>
                  
                  {/* Actions - design plus fin */}
                  <div className="flex flex-col gap-3 pt-6 border-t border-slate-200 dark:border-white/10">
                    <button 
                      onClick={() => navigate("/login")}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-secondary transition-colors"
                    >
                      Connexion
                    </button>
                    <button 
                      onClick={() => navigate("/register")}
                      className="w-full py-4 bg-primary dark:bg-secondary text-white dark:text-primary-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl"
                    >
                      Créer un compte
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// --- SUB-COMPONENTS ---

function NavLink({ to, children, active }) {
  return (
    <Link 
      to={to} 
      className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[0.9rem] transition-all duration-300 ${
        active 
          ? "bg-white dark:bg-secondary text-primary dark:text-primary-dark shadow-lg shadow-black/5" 
          : "text-slate-400 hover:text-primary dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, label, active }) {
  return (
    <Link to={to} className="flex items-center justify-between py-2 group">
      <span className={`text-xl font-bold tracking-tight uppercase transition-all ${
        active ? "text-secondary" : "text-primary dark:text-white"
      }`}>
        {label}
      </span>
      {active && <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />}
    </Link>
  );
}