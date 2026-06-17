import { useState } from "react";
import { login as loginApi } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Lock, User, ArrowRight, Sun, Moon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/Theme/ThemeContext";
import { notifyError } from "../../utils/notify"; // Import de ton utilitaire de notif

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginApi(form);
      
      // SUPPRIMÉ : localStorage.setItem("user", JSON.stringify(data.user)); 
      // Le backend gère le cookie de session, l'auth est automatique.
      
      login(data.user); // On passe juste le user au contexte
      
      if (data.user.status === "PENDING") return navigate("/verify-otp", { replace: true });
      if (data.mustChangePassword) return navigate("/change-password", { replace: true });
      
      const routes = { SUPER_ADMIN: "/admin", ADMIN: "/admin", DRIVER: "/driver", CLIENT: "/client", PARTNER_MANAGER: "/partner" };
      navigate(routes[data.user.role] || "/unauthorized", { replace: true });
    } catch (err) { 
      notifyError(err.response?.data?.message || "Identifiants invalides");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[var(--bg-app)] transition-colors duration-500 overflow-hidden">
    
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[var(--color-secondary-glow)] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--color-secondary-glow)] rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-[var(--bg-card)] backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-[var(--border-color)] relative z-10"
      >
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase tracking-tighter text-[var(--text-title)]">Connexion</h2>
            <button onClick={toggleTheme} className="p-3 bg-[var(--bg-app)] rounded-xl text-[var(--color-secondary)] hover:opacity-80 transition-all">
                {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <div className="relative group">
                <User className="absolute left-4 top-4 text-[var(--text-main)] group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Identifiant" 
                  onChange={(e) => setForm({...form, identifier: e.target.value})} 
                  className="w-full pl-12 pr-4 py-4 bg-[var(--bg-app)] rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-[var(--color-secondary)] transition-all text-[var(--text-title)]" 
                />
            </div>
            <div className="relative group">
                <Lock className="absolute left-4 top-4 text-[var(--text-main)] group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                <input 
                  type={showPwd ? "text" : "password"} 
                  placeholder="Mot de passe" 
                  onChange={(e) => setForm({...form, password: e.target.value})} 
                  className="w-full pl-12 pr-12 py-4 bg-[var(--bg-app)] rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-[var(--color-secondary)] transition-all text-[var(--text-title)]" 
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-4 text-[var(--text-main)] hover:text-[var(--text-title)] transition-colors">
                  {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            </div>
          </div>

          <button disabled={loading} className="w-full py-4 bg-[var(--color-secondary)] text-white font-black uppercase text-[11px] rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
            {loading ? <Loader2 className="animate-spin" /> : <>Accéder <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-[var(--text-main)] mt-6 uppercase tracking-widest">
            Nouveau chez Emeno ? <Link to="/register" className="text-[var(--color-secondary)] underline underline-offset-4 font-black">Créer un compte</Link>
        </p>
      </motion.div>
    </div>
  );
}