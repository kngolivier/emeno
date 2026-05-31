// src/pages/auth/VerifyOTP.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Smartphone, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import OtpInput from "../../components/OtpInput";
import { sendOTP } from "../../api/otp.api";
import { activateUserAccount } from "../../api/users.api";

const MAX_RETRIES = 3;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  
  const telephoneInitial = location.state?.telephone || user?.telephone || "";
  
  const [otpCode, setOtpCode] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // CHANGEMENT ICI : Initialisé à 0
  const [timer, setTimer] = useState(0); 
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!telephoneInitial) navigate("/login", { replace: true });
  }, [telephoneInitial, navigate]);

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
      const res = await activateUserAccount({ phone: telephoneInitial, code: otpCode });
      const updatedUser = res.data.user || user;
      
      if (res.data.token) login({ user: updatedUser, token: res.data.token });

      setIsSuccess(true);
      setTimeout(() => {
        if (updatedUser.mustChangePassword) {
          navigate("/change-password", { replace: true });
        } else {
          const routes = { SUPER_ADMIN: "/admin", ADMIN: "/admin", DRIVER: "/driver", CLIENT: "/client", PARTNER_MANAGER: "/partner" };
          navigate(routes[updatedUser?.role] || "/client", { replace: true });
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (attempts >= MAX_RETRIES) return;

    try {
      setError("");
      setLoading(true);
      await sendOTP({ phone: telephoneInitial, type: 'REGISTER' });
      
      setAttempts((prev) => prev + 1);
      setTimer(60); // Le compte à rebours s'active ici
    } catch (err) {
      setError("Échec de l'envoi.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[440px] bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 relative z-10">
        <button onClick={() => navigate("/login")} className="mb-10 flex items-center gap-2 text-slate-400 hover:text-secondary transition-all font-black text-[10px] uppercase tracking-[0.2em] group">
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
             <Smartphone size={36} />
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
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-2xl border border-rose-100 dark:border-rose-500/20 uppercase tracking-widest text-center italic">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleVerify} className="space-y-10">
          <div className="bg-slate-50 dark:bg-[#0B1120] p-10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
            <OtpInput length={6} onComplete={(code) => setOtpCode(code)} />
          </div>

          <button type="submit" disabled={loading || otpCode.length < 6 || isSuccess} className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[11px] rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all ${isSuccess ? "bg-green-500 text-white" : "bg-secondary text-primary-dark"}`}>
            {loading ? <RefreshCw className="animate-spin" /> : isSuccess ? "Compte activé" : "Activer mon compte"}
          </button>
        </form>

        <div className="mt-12 text-center border-t border-slate-50 dark:border-slate-800 pt-8">
            {/* Condition d'affichage basée sur les tentatives */}
            {attempts >= MAX_RETRIES ? (
                <div className="flex items-center justify-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                    <AlertCircle size={14} /> Tentatives maximales atteintes
                </div>
            ) : (
                <>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                        {attempts > 0 ? `Tentatives restantes : ${MAX_RETRIES - attempts}` : "Vous n'avez rien reçu ?"}
                    </p>
                    <button onClick={handleResend} disabled={timer > 0 || loading} className={`group flex items-center gap-3 mx-auto px-6 py-3 rounded-xl transition-all ${timer > 0 ? "text-slate-300 cursor-not-allowed" : "text-secondary hover:bg-secondary/10"}`}>
                        <RefreshCw size={14} className={timer > 0 ? "animate-spin" : ""} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {timer > 0 ? `Renvoyer dans ${timer}s` : "Renvoyer un nouveau code"}
                        </span>
                    </button>
                </>
            )}
        </div>
      </motion.div>
    </div>
  );
}