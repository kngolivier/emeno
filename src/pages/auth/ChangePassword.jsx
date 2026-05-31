// FILE: src/pages/auth/ChangePassword.jsx

import { useState } from "react";
import { changePassword } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2, Loader2, KeyRound, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function ChangePassword() {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.newPassword !== formData.confirmPassword) return setError("Les mots de passe ne correspondent pas");
    if (formData.newPassword.length < 6) return setError("Le mot de passe doit faire au moins 6 caractères");

    setLoading(true);
    try {
      await changePassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
      logout();
      navigate("/login", { replace: true, state: { message: "Mot de passe mis à jour." } });
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] flex items-center justify-center p-6 transition-colors duration-500">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound size={28} />
          </div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Sécurité</h1>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Mise à jour du mot de passe</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={16} /> {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputGroup label="Ancien" type="password" value={formData.oldPassword} onChange={(e) => setFormData({...formData, oldPassword: e.target.value})} />
          <InputGroup label="Nouveau" type="password" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} />
          <InputGroup label="Confirmation" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />

          <button disabled={loading} className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={16} /> Confirmer</>}
          </button>
          
          <button type="button" onClick={() => navigate(-1)} className="w-full text-[10px] font-black text-slate-400 hover:text-secondary uppercase tracking-widest transition-colors py-2">
            Retour
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="relative group">
      <input {...props} placeholder={label} className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-secondary/30 rounded-2xl outline-none text-sm font-bold text-slate-800 dark:text-white transition-all placeholder:text-slate-400" />
    </div>
  );
}