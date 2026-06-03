// src/pages/auth/RegisterPage.jsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Sun, Moon, Phone, ShieldCheck, CheckCircle2, ChevronLeft, ArrowLeft } from "lucide-react";
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

  // --- HANDLERS ---
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.telephone || formData.telephone.length < 12) {
      return setError("Numéro de téléphone invalide (+241...)");
    }
    setLoading(true); setError("");
    try {
      await sendOTP({ phone: formData.telephone });
      setStep(2);
    } catch (err) { setError(err.message || "Erreur d'envoi du code"); } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    if (formData.otpCode.length !== 6) return setError("Le code doit contenir 6 chiffres");
    setLoading(true);
    try {
      await verifyOTP({ phone: formData.telephone, code: formData.otpCode });
      setStep(3);
    } catch (err) { setError("Code de vérification incorrect"); } finally { setLoading(false); }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerClient(formData);
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/client"; 
      }
    } catch (err) { setError(err.message || "Erreur lors de l'inscription"); } finally { setLoading(false); }
  };

  return (
    // Le conteneur utilise maintenant ta variable CSS globale pour le fond
    <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-6 transition-colors duration-500 overflow-hidden relative">
      
      {/* BACK BUTTON */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-black text-[10px] uppercase tracking-widest transition"
        >
          <ArrowLeft size={14} />
          Retour
        </button>
      </div>
      {/* --- BACKGROUND GLOW DYNAMIQUE --- */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-secondary-glow)] blur-[120px] rounded-full -mr-64 -mt-64 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-primary-light)] blur-[120px] rounded-full -ml-64 -mb-64 opacity-30" />

      <motion.div layout className="w-full max-w-[480px] bg-[var(--bg-card)] p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border border-[var(--border-color)] relative z-10">
        {/* --- HEADER CONTROLS --- */}
        <div className="absolute top-8 right-8">
            <button onClick={toggleTheme} className="p-3.5 rounded-[1.2rem] bg-[var(--bg-app)] border border-[var(--border-color)] text-[var(--text-main)] shadow-sm active:scale-90 transition-all">
                {isDarkMode ? <Sun size={18} strokeWidth={3} /> : <Moon size={18} strokeWidth={3} />}
            </button>
        </div>

        {/* --- PROGRESS BAR --- */}
        <div className="flex gap-2 mb-12 pr-16">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-1.5 flex-1 bg-[var(--bg-app)] rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: step >= i ? "100%" : "0%" }} className="h-full bg-[var(--color-secondary)]"/>
                </div>
            ))}
        </div>

        {/* --- BRANDING --- */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-4">
             <img src={isDarkMode ? "./logo.png" : "./logo-dark.png"} alt="EMENO" className="max-h-12 mx-auto" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">
              {step === 1 ? "Vérification mobile" : step === 2 ? "Code de sécurité" : "Dernière étape"}
            </h1>
          </div>
        </div>

        {/* --- ERROR ALERTS --- */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-2xl border border-rose-500/20 text-center uppercase tracking-widest italic">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- STEPS CONTENT --- */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSendOTP} className="space-y-8">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Numéro Gabonais</label>
                 <PhoneInput value={formData.telephone} onChange={(val) => setFormData({...formData, telephone: val})} error={error.includes("téléphone")} />
              </div>
              <SubmitButton loading={loading} text="Recevoir le code" />
            </motion.form>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
              <div className="bg-[var(--bg-app)] p-8 rounded-[2.5rem] border-2 border-dashed border-[var(--border-color)] shadow-inner">
                <div className="w-12 h-12 bg-[var(--color-secondary-glow)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={24} className="text-[var(--color-secondary)]" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-8 tracking-[0.1em]">
                    Saisissez le code envoyé au <br/>
                    <span className="text-[var(--text-title)] mt-1 block text-sm tracking-normal">{formData.telephone}</span>
                </p>
                <OtpInput length={6} onComplete={(code) => setFormData({ ...formData, otpCode: code })} />
              </div>
              <div className="space-y-4">
                <SubmitButton loading={loading} text="Vérifier le compte" onClick={handleVerifyOTP} />
                <button type="button" onClick={() => setStep(1)} className="text-[9px] font-black text-slate-400 hover:text-[var(--color-secondary)] uppercase tracking-[0.2em] transition-colors">
                  ← Modifier le numéro
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.form key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleFinalRegister} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup icon={<User size={18} />} placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value.toUpperCase()})} required />
                <InputGroup icon={<User size={18} />} placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} required />
              </div>
              <InputGroup icon={<Mail size={18} />} type="email" placeholder="Email (Optionnel)" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Sécurité</label>
                <InputGroup icon={<Lock size={18} />} type="password" placeholder="Créer un mot de passe" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>
              <div className="pt-4">
                <SubmitButton loading={loading} text="Inscription" icon={<CheckCircle2 size={18} />} />
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* --- FOOTER --- */}
        <div className="mt-12 pt-8 border-t border-[var(--border-color)] text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-loose">
                Déjà membre ? <br/>
                <Link to="/login" className="text-[var(--color-secondary)] underline underline-offset-8 decoration-2 decoration-[var(--color-secondary)]/30 hover:decoration-[var(--color-secondary)] transition-all">
                    Se connecter à l'espace
                </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---
function InputGroup({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-secondary)] transition-all duration-300">
        {icon}
      </div>
      <input {...props} className="w-full pl-16 pr-6 py-5 bg-[var(--bg-app)] border-2 border-transparent focus:border-[var(--color-secondary)]/20 focus:bg-[var(--bg-card)] rounded-[1.8rem] outline-none text-sm font-bold text-[var(--text-title)] transition-all placeholder:text-slate-400 italic shadow-inner" />
    </div>
  );
}

function SubmitButton({ loading, text, onClick, icon }) {
  return (
    <button type={onClick ? "button" : "submit"} onClick={onClick} disabled={loading} className="w-full py-6 bg-[var(--color-secondary)] text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-[1.8rem] shadow-2xl shadow-[var(--color-secondary)]/20 flex items-center justify-center gap-4 hover:opacity-90 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-20">
      {loading ? <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : <>{text} {icon ? icon : <ArrowRight size={20} strokeWidth={3} />}</>}
    </button>
  );
}