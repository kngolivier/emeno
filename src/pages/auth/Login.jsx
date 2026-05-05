// FILE: src/pages/auth/Login.jsx

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

      if (mustChangePassword) {
        return navigate("/change-password", { replace: true });
      }

      // Redirection selon le rôle
      const routes = {
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8 relative overflow-hidden">
      
      {/* Background Decor & Logo Filigrane */}
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Les halos de couleur */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
      
      {/* LE LOGO EN BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <img 
          src="/logo-dark.png"
          alt="Logo" 
          className="w-[500px] md:w-[800px] grayscale select-none"
        />
      </div>
    </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50"
      >
        {/* Header / Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-black text-primary tracking-tighter italic mb-2 block">
            EMENO<span className="text-secondary">.</span>
          </Link>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] italic">
            Espace de connexion
          </h2>
        </div>

        {error && (
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="mb-6 p-4 bg-red-50 text-red-500 text-[10px] font-black rounded-2xl border border-red-100 uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Identifiant */}
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
              <User size={18} />
            </div>
            <input
              type="text"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 text-sm font-bold text-primary placeholder:text-slate-300 transition-all"
              placeholder="EMAIL OU TÉLÉPHONE"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-14 pr-14 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 text-sm font-bold text-primary placeholder:text-slate-300 transition-all"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-6 hover:bg-secondary transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? "Chargement..." : <>Se connecter <ArrowRight size={18} /></>}
          </button>

        </form>

        {/* Footer Link */}
        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Nouveau sur la plateforme ? <br />
            <Link to="/register" className="text-secondary underline underline-offset-4 hover:text-primary transition-colors">
              Créer un compte client
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Version Desktop: Petit message discret en bas */}
      <div className="absolute bottom-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
        © {new Date().getFullYear()} Emeno Delivery System
      </div>
    </div>
  );
}