// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../../api/auth.api";
import PhoneInput from "../../components/forms/PhoneInput";
import { notifyError, notifySuccess } from "../../utils/notify";

export default function ForgotPassword() {
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(telephone);
      notifySuccess("Code envoyé avec succès");
      navigate("/reset-password", { state: { telephone } });
    } catch (err) {
      notifyError(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] bg-[var(--bg-card)] p-8 rounded-[2.5rem] shadow-2xl border border-[var(--border-color)]">
        <h2 className="text-xl font-black text-[var(--text-title)] uppercase mb-6">Récupération</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PhoneInput value={telephone} onChange={setTelephone} />
          <button disabled={loading} className="w-full py-4 bg-[var(--color-secondary)] text-white font-black uppercase text-[11px] rounded-2xl flex items-center justify-center gap-2 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <>Envoyer le code <ArrowRight size={16} /></>}
          </button>
          <button type="button" onClick={() => navigate("/login")} className="w-full text-center text-[10px] font-bold text-slate-400 uppercase">Retour à la connexion</button>
        </form>
      </motion.div>
    </div>
  );
}