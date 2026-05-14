// FILE: src/pages/auth/ChangePassword.jsx
import { useState } from "react";
import { changePassword } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, ArrowLeft, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth(); // Utilisation de logout pour purger la session

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("Tous les champs sont obligatoires");
    }
    if (newPassword !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas");
    }
    if (newPassword.length < 6) {
      return setError("Le mot de passe doit faire au moins 6 caractères");
    }

    setLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      
      // Une fois le mot de passe changé, on déconnecte pour ré-authentifier proprement
      logout();
      navigate("/login", { 
        replace: true, 
        state: { message: "Mot de passe mis à jour avec succès. Veuillez vous reconnecter." } 
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-primary/5 text-primary rounded-[2rem] flex items-center justify-center mx-auto relative z-10 border border-primary/10">
              <KeyRound size={36} strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-0 animate-pulse" />
          </div>
          
          <h1 className="text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter mb-2">
            Sécurité <span className="text-secondary">Compte</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
            Mise à jour obligatoire
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-2xl border border-rose-100 dark:border-rose-500/20 text-center uppercase tracking-widest italic"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <InputGroup 
              label="Ancien mot de passe" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
              placeholder="Mot de passe actuel"
            />
            <div className="h-px bg-slate-50 dark:bg-slate-800 mx-4" />
            <InputGroup 
              label="Nouveau mot de passe" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="Nouveau (6+ caractères)"
            />
            <InputGroup 
              label="Confirmation" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirmer le mot de passe"
            />
          </div>

          <div className="pt-4 space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[2rem] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 hover:bg-[#002D15] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <><CheckCircle2 size={20} strokeWidth={3} /> Enregistrer les modifications</>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-2 flex items-center justify-center gap-3 text-slate-400 hover:text-secondary transition-all font-black text-[9px] uppercase tracking-[0.3em]"
            >
              <ArrowLeft size={16} /> Annuler et revenir
            </button>
          </div>
        </form>

        {/* Security Badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-slate-300 dark:text-slate-700">
            <ShieldCheck size={14} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Protection des données active</span>
        </div>
      </motion.div>
    </div>
  );
}

function InputGroup({ label, placeholder, ...props }) {
  return (
    <div className="relative group">
      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block italic">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors duration-300">
          <Lock size={18} strokeWidth={2.5} />
        </div>
        <input 
          type="password"
          {...props} 
          placeholder={placeholder}
          className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-[#0B1120] border-2 border-transparent focus:border-secondary/20 focus:bg-white dark:focus:bg-slate-800 rounded-[1.8rem] outline-none text-sm font-bold text-primary dark:text-white transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700 shadow-inner"
        />
      </div>
    </div>
  );
}