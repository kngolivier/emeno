// src/pages/auth/Login.jsx

import { useState } from "react";
import { login as loginApi } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Lock, User, ArrowRight, Moon, Sun, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/Theme/ThemeContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ identifier, password });
      const { user, mustChangePassword } = res.data;
      
      if (!user) throw new Error("Une erreur est survenue lors de la récupération du profil");

      // 💡 1. ÉCRITURE SYNCHRONE IMMÉDIATE : On sécurise le localStorage miroir 
      // pour que les routeurs/gardes puissent le lire instantanément sans attendre le re-render du state.
      localStorage.setItem("user", JSON.stringify(user));

      // 💡 2. Mise à jour de l'état global React du contexte
      login({ user });

      // Redirection OTP pour validation mobile (Spécifique Gabon)
      if (user.status === "PENDING") {
        return navigate("/verify-otp", {
          replace: true, 
          state: { telephone: user.telephone } 
        });
      }

      // Sécurité : Premier login avec mot de passe généré
      if (mustChangePassword) {
        return navigate("/change-password", { replace: true });
      }

      const routes = {
        SUPER_ADMIN: "/admin",
        ADMIN: "/admin",
        DRIVER: "/driver",
        CLIENT: "/client",
        PARTNER_MANAGER: "/partner"
      };
      
      const destination = routes[user?.role] || "/unauthorized";

      // 💡 3. LE LAISSER-PASSER : On décale la navigation d'un micro-battement (macro-task queue)
      // pour laisser à React le temps de finaliser le cycle de mise à jour du Provider.
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 10);

    } catch (err) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* --- EFFETS DE FOND (Glow) --- */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 relative"
      >
        {/* --- TOGGLE THÈME --- */}
        <div className="absolute top-8 right-8">
            <button
                onClick={toggleTheme}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-secondary hover:scale-110 transition-all active:scale-90 border border-slate-100 dark:border-slate-700 shadow-sm"
            >
                {isDarkMode ? <Sun size={18} strokeWidth={3} /> : <Moon size={18} strokeWidth={3} />}
            </button>
        </div>

        {/* --- LOGO & HEADER --- */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6 active:scale-95 transition-transform">
            <img 
              src={isDarkMode ? "./logo.png" : "./logo-dark.png"} 
              alt="Logo EMENO" 
              className="max-h-16 lg:max-h-20 object-contain mx-auto"
            />
          </Link>
          <div className="space-y-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">
              Connexion Sécurisée
            </h2>
            <p className="text-[8px] font-bold text-secondary uppercase tracking-widest">
              Système de Livraison EMENO
            </p>
          </div>
        </div>

        {/* --- ALERTES ERREUR --- */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-2xl border border-rose-100 dark:border-rose-500/20 uppercase tracking-widest text-center italic"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- FORMULAIRE --- */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Identifiant</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-secondary/20 focus:bg-white dark:focus:bg-slate-800 rounded-3xl outline-none text-sm font-bold text-primary dark:text-white placeholder:text-slate-300 transition-all shadow-inner"
                placeholder="Email ou Téléphone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Mot de passe</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-16 pr-16 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-secondary/20 focus:bg-white dark:focus:bg-slate-800 rounded-3xl outline-none text-sm font-bold text-primary dark:text-white placeholder:text-slate-300 transition-all shadow-inner"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-secondary transition-colors p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end px-2">
            <Link to="/forgot-password" size="sm" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-secondary transition-colors">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[2rem] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 mt-4 hover:bg-[#002D15] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} strokeWidth={3} />
            ) : (
              <>Accéder à l'espace <ArrowRight size={20} strokeWidth={3} /></>
            )}
          </button>
        </form>

        {/* --- FOOTER D'INSCRIPTION --- */}
        <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-loose">
            Pas encore de compte ? <br/>
            <Link to="/register" className="text-secondary underline underline-offset-8 decoration-2 decoration-secondary/30 hover:decoration-secondary transition-all">
              Devenir client EMENO
            </Link>
          </p>
        </div>

        {/* --- SECURITY BADGE --- */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-300 dark:text-slate-700">
            <ShieldCheck size={14} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Chiffrement SSL 256-bit</span>
        </div>
      </motion.div>
    </div>
  );
}