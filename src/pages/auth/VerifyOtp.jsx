// src/pages/auth/VerifyOTP.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowLeft, RefreshCw, Smartphone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Importation du composant spécialisé
import OtpInput from "../../components/OtpInput";

// Importation des services API
import { sendOTP } from "../../api/otp.api";
import { activateUserAccount } from "../../api/users.api";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  
  // Source de vérité pour le numéro (priorité au state de navigation)
  const telephoneInitial = location.state?.telephone || user?.telephone || "";
  
  // On stocke le code complet ici (reçu via onComplete de OtpInput)
  const [otpCode, setOtpCode] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);

  // Redirection si aucun numéro n'est trouvé
  useEffect(() => {
    if (!telephoneInitial) {
      navigate("/login", { replace: true });
    }
  }, [telephoneInitial, navigate]);

  // Timer pour le renvoi de l'OTP (cadence 1s)
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  /**
   * Action de validation : Active le compte
   */
  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Ton OtpInput semble configuré pour 6 chiffres par défaut (ou 4 selon l'usage habituel)
    // Ajuste la longueur si nécessaire dans le composant ci-dessous
    if (otpCode.length < 6) {
      return setError("Veuillez saisir le code complet");
    }

    setLoading(true);
    setError("");

    try {
      // Correction : On passe l'objet attendu par l'API avec la clé 'telephone'
      const res = await activateUserAccount({ 
        phone: telephoneInitial, 
        code: otpCode 
      });
      
      const updatedUser = res.data.user || user;
      
      if (res.data.token) {
        login({ user: updatedUser, token: res.data.token });
      }

      // Redirection EMENO : Changement de mot de passe requis ou Espace Client
      if (updatedUser.mustChangePassword) {
        navigate("/change-password", { replace: true });
      } else {
        navigate("/client", { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou expiré");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renvoi du code
   */
  const handleResend = async () => {
    if (timer > 0) return;
    try {
      setError("");
      // Correction de la clé : 'telephone' (assure-toi que l'API n'attend pas 'phone')
      await sendOTP({ phone: telephoneInitial, type: 'REGISTER' });
      setTimer(15);
    } catch (err) {
      setError("Impossible de renvoyer le code");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-primary-dark flex items-center justify-center p-4 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-surface p-8 lg:p-12 rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-white/5"
      >
        <button 
          onClick={() => navigate("/login")}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone size={32} />
          </div>
          <h1 className="text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter mb-2">
            Vérification <span className="text-secondary">OTP</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium leading-relaxed">
            Un code a été envoyé au <br />
            <span className="text-primary dark:text-white font-black italic">{telephoneInitial}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 text-red-500 text-[10px] font-black rounded-xl border border-red-100 dark:border-red-500/20 uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-10">
          {/* Utilisation de ton composant OtpInput */}
          <div className="bg-slate-50 dark:bg-primary-dark/50 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 mb-8">
            <OtpInput 
              length={6} 
              onComplete={(code) => setOtpCode(code)} 
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length < 6}
            className="w-full py-5 bg-secondary text-primary-dark font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-secondary/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : "Vérifier le compte"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
            Pas reçu ?
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`flex items-center gap-2 mx-auto text-xs font-black uppercase tracking-tighter transition-colors ${
              timer > 0 ? "text-slate-300" : "text-secondary hover:text-primary"
            }`}
          >
            <RefreshCw size={14} className={timer > 0 ? "" : "animate-spin-slow"} />
            {timer > 0 ? `Renvoyer (${timer}s)` : "Renvoyer un code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}