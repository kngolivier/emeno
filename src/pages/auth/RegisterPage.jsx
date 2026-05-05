// FILE: src/pages/auth/RegisterPage.jsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck } from "lucide-react";

// Imports API et Composants
import { sendOTP, verifyOTP } from "../../api/otp.api";
import { registerClient } from "../../api/auth.api";
import OtpInput from "../../components/OtpInput";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Téléphone, 2: OTP, 3: Profil
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "+241", 
    email: "",
    password: "",
    otpCode: ""
  });

  // Étape 1 : Demande d'envoi du code au backend
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendOTP({ phone: formData.telephone });
      setStep(2);
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi du code");
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Vérification du code saisi
  const handleVerifyOTP = async (e) => {
    e?.preventDefault(); // Optionnel si appelé par onComplete
    if (formData.otpCode.length !== 6) {
        setError("Veuillez entrer le code complet");
        return;
    }

    setLoading(true);
    setError("");
    try {
      await verifyOTP({ phone: formData.telephone, code: formData.otpCode });
      setStep(3);
    } catch (err) {
      setError(err.message || "Code incorrect ou expiré");
    } finally {
      setLoading(false);
    }
  };

  // Étape 3 : Création finale et LOGIN AUTOMATIQUE
  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Ton service backend renvoie { user, token }
      const response = await registerClient(formData);
      
      if (response.data?.token) {
        // Stockage immédiat pour connecter l'utilisateur
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirection vers le dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <motion.div layout className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-primary tracking-tighter italic mb-4 block">
            EMENO<span className="text-secondary">.</span>
          </Link>
          <h1 className="text-xl font-black text-primary uppercase italic tracking-tighter">
            {step === 1 && "Vérification mobile"}
            {step === 2 && "Code de sécurité"}
            {step === 3 && "Finalisez votre profil"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-[10px] font-black rounded-2xl border border-red-100 uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ÉTAPE 1: NUMÉRO DE TÉLÉPHONE */}
          {step === 1 && (
            <motion.form 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              onSubmit={handleSendOTP} 
              className="space-y-4"
            >
              <p className="text-slate-400 text-[11px] font-bold uppercase text-center mb-6">
                Un code vous sera envoyé par SMS
              </p>
              <InputGroup 
                icon={<Phone size={18} />} 
                type="tel" 
                placeholder="+241XXXXXXXX" 
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                required
              />
              <SubmitButton loading={loading} text="Envoyer le code" />
            </motion.form>
          )}

          {/* ÉTAPE 2: CODE OTP (CELLULES DÉCOMPOSÉES) */}
          {step === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              className="space-y-4"
            >
              <p className="text-slate-400 text-[11px] font-bold uppercase text-center mb-6">
                Code envoyé au <span className="text-primary">{formData.telephone}</span>
              </p>
              
              <OtpInput
                length={6} 
                onComplete={(code) => setFormData({ ...formData, otpCode: code })} 
              />

              <SubmitButton 
                loading={loading} 
                text="Vérifier le code" 
                onClick={handleVerifyOTP} 
              />
              
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2 hover:text-primary transition-colors"
              >
                Modifier le numéro
              </button>
            </motion.div>
          )}

          {/* ÉTAPE 3: INFORMATIONS PROFIL */}
          {step === 3 && (
            <motion.form 
              key="step3" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              onSubmit={handleFinalRegister} 
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <InputGroup 
                  icon={<User size={18} />} 
                  placeholder="Nom" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                />
                <InputGroup 
                  icon={<User size={18} />} 
                  placeholder="Prénom" 
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  required
                />
              </div>
              <InputGroup 
                icon={<Mail size={18} />} 
                type="email" 
                placeholder="Email (optionnel)" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <InputGroup 
                icon={<Lock size={18} />} 
                type="password" 
                placeholder="Mot de passe (min 6 car.)" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <SubmitButton loading={loading} text="Créer mon compte" />
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center mt-8 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          Déjà inscrit ? <Link to="/login" className="text-secondary underline underline-offset-4">Connexion</Link>
        </p>
      </motion.div>
    </div>
  );
}

// --- SOUS-COMPOSANTS INTERNES ---

function InputGroup({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/20 text-sm font-bold text-primary placeholder:text-slate-300 transition-all"
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
      className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-4 hover:bg-secondary transition-all disabled:opacity-50"
    >
      {loading ? "Traitement..." : <>{text} <ArrowRight size={18} /></>}
    </button>
  );
}