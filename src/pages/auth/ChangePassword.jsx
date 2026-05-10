// FILE: src/pages/auth/ChangePassword.jsx
import { useState } from "react";
import { changePassword } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!oldPassword || !newPassword || !confirmPassword) return setError("Tous les champs sont obligatoires");
    if (newPassword !== confirmPassword) return setError("Les mots de passe ne correspondent pas");
    if (newPassword.length < 6) return setError("Minimum 6 caractères");

    setLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Erreur lors du changement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-primary-dark flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-surface p-8 lg:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-white/5"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter mb-2">
            Sécurité <span className="text-secondary">Compte</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Mise à jour du mot de passe
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-[10px] font-black rounded-2xl border border-red-100 uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputGroup label="Ancien mot de passe" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <InputGroup label="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <InputGroup label="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-6 hover:bg-secondary transition-all active:scale-95"
          >
            {loading ? "Chargement..." : <><CheckCircle2 size={18} /> Valider le changement</>}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-primary transition-colors font-black text-[10px] uppercase tracking-widest mt-4"
          >
            <ArrowLeft size={14} /> Annuler
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="relative group">
      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4 mb-1 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
          <Lock size={18} />
        </div>
        <input 
          type="password"
          {...props} 
          placeholder="••••••••"
          className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 text-sm font-bold text-primary dark:text-white transition-all"
        />
      </div>
    </div>
  );
}