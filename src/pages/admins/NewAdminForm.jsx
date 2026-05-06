// FILE: src/pages/admins/NewAdminForm.jsx
import React, { useState } from "react";
import { X, Shield, Lock, Smartphone, Mail, Loader2 } from "lucide-react";

export default function NewAdminForm({ onClose, onCreated }) {
  const [form, setForm] = useState({ 
    nom: "", 
    prenom: "", 
    telephone: "+241", 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.nom.trim()) errs.nom = "Le nom est obligatoire";
    if (!form.telephone.match(/^\+241[0-9]{8,9}$/)) errs.telephone = "Format invalide (+241...)";
    if (!form.email.includes("@")) errs.email = "Email invalide";
    if (form.password.length < 6) errs.password = "6 caractères minimum";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Simulation API - Remplace par ton appel réel
      console.log("Données envoyées:", form);
      setTimeout(() => {
        onCreated();
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `
    w-full bg-slate-50 border-2 transition-all outline-none rounded-[1.2rem] p-4 text-sm font-bold
    ${errors[field] ? "border-rose-200 focus:border-rose-400 bg-rose-50/30" : "border-slate-50 focus:border-primary/20 focus:bg-white"}
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary italic leading-none">Nouvel Accès</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Administration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20}/>
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nom</label>
              <input placeholder="Nom" className={inputClass("nom")} onChange={e => setForm({...form, nom: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Prénom</label>
              <input placeholder="Prénom" className={inputClass("prenom")} onChange={e => setForm({...form, prenom: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input value={form.telephone} className={`${inputClass("telephone")} pl-12`} onChange={e => setForm({...form, telephone: e.target.value})} />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="email" placeholder="Email professionnel" className={`${inputClass("email")} pl-12`} onChange={e => setForm({...form, email: e.target.value})} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="password" placeholder="Mot de passe" className={`${inputClass("password")} pl-12`} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-primary text-white rounded-[1.2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:bg-secondary hover:shadow-secondary/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Créer le profil Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}