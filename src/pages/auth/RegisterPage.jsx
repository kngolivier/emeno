// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Sun, Moon } from "lucide-react";
import { sendOTP, verifyOTP } from "../../api/otp.api";
import { registerClient } from "../../api/auth.api";
import OtpInput from "../../components/OtpInput";
import PhoneInput from "../../components/forms/PhoneInput";
import { useTheme } from "../../context/Theme/ThemeContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nom: "", prenom: "", telephone: "", email: "", password: "", otpCode: ""
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.telephone || formData.telephone.length < 12) {
      return setError("Numéro de téléphone invalide");
    }
    setLoading(true);
    setError("");
    try {
      await sendOTP({ phone: formData.telephone });
      setStep(2);
    } catch (err) { 
      setError(err.message || "Erreur d'envoi"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    if (formData.otpCode.length !== 6) return setError("Code incomplet");
    setLoading(true);
    try {
      await verifyOTP({ phone: formData.telephone, code: formData.otpCode });
      setStep(3);
    } catch (err) { 
      setError("Code incorrect"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerClient(formData);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/client");
      }
    } catch (err) { 
      setError(err.message || "Erreur d'inscription"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-primary-dark flex items-center justify-center p-4 transition-colors duration-500">
      <motion.div 
        layout 
        className="w-full max-w-md bg-white dark:bg-primary-light p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl shadow-black/5 border border-slate-100 dark:border-white/5 relative overflow-hidden"
      >
        
        {/* BOUTON THÈME (Inspiré de la Navbar) */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
            <button
                onClick={toggleTheme}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-primary-dark text-slate-400 dark:text-yellow-400 hover:scale-110 transition-all active:scale-90 border border-slate-100 dark:border-white/5 shadow-sm"
            >
                {isDarkMode ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-10 pr-14"> {/* Pr-14 pour laisser de la place au bouton thème */}
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-secondary w-full' : 'bg-slate-100 dark:bg-white/5'}`} />
            ))}
        </div>

        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-primary dark:text-white italic mb-1 block tracking-tighter">
            EMENO<span className="text-secondary">.</span>
          </Link>
          <h1 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            {step === 1 ? "Vérification mobile" : step === 2 ? "Code de sécurité" : "Création du profil"}
          </h1>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-500 text-[10px] font-black rounded-2xl text-center uppercase tracking-widest border border-red-100 dark:border-red-500/20"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
                key="s1" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendOTP} 
                className="space-y-6"
            >
              <PhoneInput 
                value={formData.telephone} 
                onChange={(val) => setFormData({...formData, telephone: val})}
                error={error.includes("téléphone") ? error : null}
              />
              <SubmitButton loading={loading} text="Suivant" />
            </motion.form>
          )}

          {step === 2 && (
            <motion.div 
                key="s2" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
            >
              <div className="bg-slate-50 dark:bg-primary-dark/50 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-6 tracking-widest">
                    Code envoyé au <span className="text-primary dark:text-white">{formData.telephone}</span>
                </p>
                <OtpInput length={6} onComplete={(code) => setFormData({ ...formData, otpCode: code })} />
              </div>
              <SubmitButton loading={loading} text="Vérifier" onClick={handleVerifyOTP} />
              <button 
                type="button"
                onClick={() => setStep(1)} 
                className="text-[10px] font-black text-slate-400 hover:text-secondary uppercase tracking-[0.2em] transition-colors"
              >
                ← Modifier le numéro
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.form 
                key="s3" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleFinalRegister} 
                className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup icon={<User size={18} />} placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required />
                <InputGroup icon={<User size={18} />} placeholder="Prénom" value={formData.prenom} onChange={(e)   => setFormData({...formData, prenom: e.target.value})} required />
              </div>
              <InputGroup icon={<Mail size={18} />} type="email" placeholder="Email (Optionnel)" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <InputGroup icon={<Lock size={18} />} type="password" placeholder="Mot de passe" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              
              <div className="pt-4">
                <SubmitButton loading={loading} text="Terminer l'inscription" />
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center mt-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            Déjà un compte ? <Link to="/login" className="text-secondary hover:text-secondary/80 transition-colors ml-1 underline decoration-2 underline-offset-4">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}

// --- Composants de style enrichis ---

function InputGroup({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-secondary transition-colors duration-300">
        {icon}
      </div>
      <input 
        {...props} 
        className="w-full pl-14 pr-5 py-5 bg-slate-50 dark:bg-primary-dark/50 border-2 border-transparent focus:border-secondary/20 rounded-[1.2rem] outline-none text-sm font-bold text-primary dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 italic" 
      />
    </div>
  );
}

function SubmitButton({ loading, text, onClick }) {
  return (
    <button 
      type={onClick ? "button" : "submit"} 
      onClick={onClick} 
      disabled={loading} 
      className="w-full py-5 bg-primary dark:bg-secondary text-white dark:text-primary-dark font-black uppercase text-[11px] tracking-[0.15em] rounded-[1.2rem] shadow-xl shadow-primary/10 dark:shadow-secondary/5 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>{text} <ArrowRight size={16} strokeWidth={3} /></>
      )}
    </button>
  );
}