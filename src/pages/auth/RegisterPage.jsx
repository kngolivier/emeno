// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { sendOTP, verifyOTP } from "../../api/otp.api";
import { registerClient } from "../../api/auth.api";
import OtpInput from "../../components/OtpInput";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nom: "", prenom: "", telephone: "+241", email: "", password: "", otpCode: ""
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendOTP({ phone: formData.telephone });
      setStep(2);
    } catch (err) { setError(err.message || "Erreur d'envoi"); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    if (formData.otpCode.length !== 6) return setError("Code incomplet");
    setLoading(true);
    try {
      await verifyOTP({ phone: formData.telephone, code: formData.otpCode });
      setStep(3);
    } catch (err) { setError("Code incorrect"); }
    finally { setLoading(false); }
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
    } catch (err) { setError(err.message || "Erreur d'inscription"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-primary-dark flex items-center justify-center p-4">
      <motion.div layout className="w-full max-w-md bg-white dark:bg-surface p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-xl border border-slate-50 dark:border-white/5">
        
        {/* Progress Bar */}
        <div className="flex gap-1 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${step >= i ? 'bg-secondary' : 'bg-slate-100 dark:bg-white/10'}`} />
            ))}
        </div>

        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-black text-primary dark:text-white italic mb-2 block">EMENO<span className="text-secondary">.</span></Link>
          <h1 className="text-xs lg:text-sm font-black text-slate-400 uppercase tracking-widest">
            {step === 1 ? "Vérification mobile" : step === 2 ? "Code de sécurité" : "Profil"}
          </h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-[9px] font-black rounded-xl text-center uppercase tracking-widest">{error}</div>}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSendOTP} className="space-y-4">
              <InputGroup icon={<Phone size={18} />} type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} required />
              <SubmitButton loading={loading} text="Suivant" />
            </motion.form>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 text-center">
              <OtpInput length={6} onComplete={(code) => setFormData({ ...formData, otpCode: code })} />
              <SubmitButton loading={loading} text="Vérifier" onClick={handleVerifyOTP} />
              <button onClick={() => setStep(1)} className="text-[10px] font-black text-slate-400 uppercase">Retour</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.form key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleFinalRegister} className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <InputGroup icon={<User size={16} />} placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} required />
                <InputGroup icon={<User size={16} />} placeholder="Prénom" value={formData.prenom} onChange={(e)   => setFormData({...formData, prenom: e.target.value})} required />
              </div>
              <InputGroup icon={<Mail size={16} />} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <InputGroup icon={<Lock size={16} />} type="password" placeholder="Mot de passe" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <SubmitButton loading={loading} text="Terminer" />
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Inscrit ? <Link to="/login" className="text-secondary underline">Connexion</Link>
        </p>
      </motion.div>
    </div>
  );
}

function InputGroup({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
        {icon}
      </div>
      <input {...props} className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 text-xs font-bold text-primary dark:text-white transition-all" />
    </div>
  );
}

function SubmitButton({ loading, text, onClick }) {
  return (
    <button type={onClick ? "button" : "submit"} onClick={onClick} disabled={loading} className="w-full py-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-secondary transition-all disabled:opacity-50">
      {loading ? "..." : <>{text} <ArrowRight size={14} /></>}
    </button>
  );
}