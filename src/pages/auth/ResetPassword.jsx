// src/pages/auth/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../api/auth.api";
import { Lock, Loader2, KeyRound } from "lucide-react";
import OtpInput from "../../components/OtpInput";
import { notifyError, notifySuccess } from "../../utils/notify";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    telephone: location.state?.telephone || "", 
    otpCode: "", 
    newPassword: "" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(formData);
      notifySuccess("Mot de passe réinitialisé !");
      navigate("/login");
    } catch (err) {
      notifyError(err.response?.data?.message || "Code ou mot de passe invalide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-[var(--bg-card)] p-8 rounded-[2.5rem] shadow-2xl border border-[var(--border-color)]">
        <h2 className="text-xl font-black text-[var(--text-title)] uppercase mb-8">Nouveau mot de passe</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <OtpInput length={6} onComplete={(code) => setFormData({...formData, otpCode: code})} />
          <input 
            type="password" 
            placeholder="Nouveau mot de passe"
            className="w-full px-6 py-4 bg-[var(--bg-app)] rounded-2xl outline-none"
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
          />
          <button disabled={loading} className="w-full py-4 bg-[var(--color-secondary)] text-white rounded-2xl">
            {loading ? <Loader2 className="animate-spin" /> : "Confirmer"}
          </button>
        </form>
      </div>
    </div>
  );
}