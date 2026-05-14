// src/pages/auth/VerifyOTP.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Smartphone, ShieldCheck, CheckCircle2 } from "lucide-react";
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
  
  const [otpCode, setOtpCode] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirection si aucun numéro n'est trouvé
  useEffect(() => {
    if (!telephoneInitial) {
      navigate("/login", { replace: true });
    }
  }, [telephoneInitial, navigate]);

  // Timer pour le renvoi de l'OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (otpCode.length < 6) return setError("Veuillez saisir le code complet");

    setLoading(true);
    setError("");

    try {
      const res = await activateUserAccount({ 
        phone: telephoneInitial, 
        code: otpCode 
      });
      
      const updatedUser = res.data.user || user;
      
      if (res.data.token) {
        login({ user: updatedUser, token: res.data.token });
      }

      setIsSuccess(true);

      // Petite pause pour laisser l'animation de succès s'afficher
      setTimeout(() => {
        if (updatedUser.mustChangePassword) {
          navigate("/change-password", { replace: true });
        } else {
          const routes = {
            SUPER_ADMIN: "/admin",
            ADMIN: "/admin",
            DRIVER: "/driver",
            CLIENT: "/client"
          };
          navigate(routes[updatedUser?.role] || "/client", { replace: true });
        }
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou expiré");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      setError("");
      setLoading(true);
      await sendOTP({ phone: telephoneInitial, type: 'REGISTER' });
      setTimer(30); // On réduit à 30s après le premier essai
    } catch (err) {
      setError("Échec de l'envoi. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* --- BACKGROUND GLOW --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 relative z-10"
      >
        <button 
          onClick={() => navigate("/login")}
          className="mb-10 flex items-center gap-2 text-slate-400 hover:text-secondary transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour
        </button>

        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-[2rem] flex items-center justify-center mx-auto relative z-10">
              <Smartphone size={36} strokeWidth={2.5} />
            </div>
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
               transition={{ repeat: Infinity, duration: 3 }}
               className="absolute inset-0 bg-secondary blur-2xl rounded-full -z-0"
            />
          </div>

          <h1 className="text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter mb-3">
            Vérification <span className="text-secondary">OTP</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-loose">
            Un code sécurisé a été envoyé au <br />
            <span className="text-primary dark:text-white text-sm tracking-normal">{telephoneInitial}</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-2xl border border-rose-100 dark:border-rose-500/20 uppercase tracking-widest text-center italic"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleVerify} className="space-y-10">
          <div className="bg-slate-50 dark:bg-[#0B1120] p-10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner group transition-all focus-within:border-secondary/40">
            <OtpInput 
              length={6} 
              onComplete={(code) => {
                setOtpCode(code);
                // On peut déclencher la vérification auto ici si tu veux
              }} 
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length < 6 || isSuccess}
            className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-30 ${
                isSuccess 
                ? "bg-green-500 text-white shadow-green-500/20" 
                : "bg-secondary text-primary-dark shadow-secondary/20 hover:-translate-y-1"
            }`}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={20} strokeWidth={3} />
            ) : isSuccess ? (
              <><CheckCircle2 size={20} strokeWidth={3} /> Compte activé</>
            ) : (
              <>Activer mon compte <ShieldCheck size={20} strokeWidth={3} /></>
            )}
          </button>
        </form>

        <div className="mt-12 text-center border-t border-slate-50 dark:border-slate-800 pt-8">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
            Vous n'avez rien reçu ?
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || loading}
            className={`group flex items-center gap-3 mx-auto px-6 py-3 rounded-xl transition-all ${
              timer > 0 
              ? "text-slate-300 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed" 
              : "text-secondary hover:bg-secondary/10"
            }`}
          >
            <RefreshCw size={14} strokeWidth={3} className={timer === 0 && !loading ? "group-hover:rotate-180 transition-transform duration-500" : "animate-spin"} />
            <span className="text-[10px] font-black uppercase tracking-widest">
                {timer > 0 ? `Renvoyer dans ${timer}s` : "Renvoyer un nouveau code"}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}