// src/pages/auth/Login.jsx
import { useState } from "react";
import { login as loginApi } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ identifier, password });
      const { token, user, mustChangePassword } = res.data;
      if (!token) throw new Error("Erreur d'authentification");
      login({ user, token });

      if (mustChangePassword) return navigate("/change-password", { replace: true });

      const routes = {
        SUPER_ADMIN: "/admin",
        ADMIN: "/admin",
        DRIVER: "/driver",
        CLIENT: "/client"
      };
      navigate(routes[user?.role] || "/unauthorized", { replace: true });
    } catch (err) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-primary-dark flex items-center justify-center p-4 lg:p-8 relative overflow-hidden transition-colors">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-surface p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-xl border border-slate-50 dark:border-white/5"
      >
        <div className="text-center mb-8 lg:mb-10">
          <Link to="/" className="text-3xl lg:text-4xl font-black text-primary dark:text-white tracking-tighter italic mb-2 block">
            EMENO<span className="text-secondary">.</span>
          </Link>
          <h2 className="text-[10px] lg:text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">
            Espace de connexion
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-500 text-[9px] lg:text-[10px] font-black rounded-xl border border-red-100 dark:border-red-500/20 uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3 lg:space-y-4">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
              <User size={18} />
            </div>
            <input
              type="text"
              className="w-full pl-14 pr-6 py-4 lg:py-5 bg-slate-50 dark:bg-white/5 border-none rounded-xl lg:rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 text-sm font-bold text-primary dark:text-white placeholder:text-slate-300 transition-all"
              placeholder="EMAIL OU TÉLÉPHONE"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-14 pr-14 py-4 lg:py-5 bg-slate-50 dark:bg-white/5 border-none rounded-xl lg:rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 text-sm font-bold text-primary dark:text-white placeholder:text-slate-300 transition-all"
              placeholder="MOT DE PASSE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 lg:py-5 bg-primary text-white font-black uppercase tracking-widest rounded-xl lg:rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-4 hover:bg-secondary transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? "Chargement..." : <span className="text-xs">Se connecter</span>}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Nouveau ? <Link to="/register" className="text-secondary underline underline-offset-4">Créer un compte client</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}