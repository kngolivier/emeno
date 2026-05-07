// FILE: src/pages/admins/NewAdminForm.jsx

import React, { useState } from "react";
import { X, Shield, Lock, Smartphone, Mail, Loader2, User, UserCheck } from "lucide-react";
import { notifyError, notifySuccess } from "../../utils/notify";
import { createAdmin } from "../../api/users.api"; // Importation de l'API réelle

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
    if (!form.nom.trim()) errs.nom = "Nom requis";
    if (!form.prenom.trim()) errs.prenom = "Prénom requis";
    if (!form.telephone.match(/^\+241[0-9]{8,9}$/)) errs.telephone = "Format: +241XXXXXXXX";
    if (form.email && !form.email.includes("@")) errs.email = "Email invalide";
    if (form.password.length < 6) errs.password = "6 caractères min.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Appel à l'API EMENO
      await createAdmin(form);
      
      notifySuccess("Le compte administrateur a été créé avec succès");
      onCreated(); // Rafraîchit la liste des admins
      onClose();   // Ferme la modal
    } catch (err) {
      // Tente de récupérer le message d'erreur du backend (ex: email déjà pris)
      const errorMsg = err.response?.data?.message || "Erreur lors de la création de l'admin";
      notifyError(errorMsg);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `
    w-full bg-slate-50/80 border-2 transition-all outline-none rounded-xl p-3.5 text-sm font-bold
    ${errors[field] ? "border-rose-100 focus:border-rose-400 bg-rose-50/20" : "border-slate-50 focus:border-primary/20 focus:bg-white"}
  `;

  return (
    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
      
      {/* HEADER FIXE */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-primary to-secondary text-white rounded-xl shadow-lg shadow-primary/20">
            <UserCheck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-black text-primary italic uppercase tracking-tighter">Nouveau Staff</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Accès sécurisé</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-all">
          <X size={18} strokeWidth={3}/>
        </button>
      </div>

      {/* CORPS SCROLLABLE */}
      <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
        <div className="p-6 space-y-5 overflow-y-auto scrollbar-hide">
          
          {/* NOM */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
              Nom <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input placeholder="Ex: NDONG" className={`${inputClass("nom")} pl-12 uppercase text-primary`} onChange={e => setForm({...form, nom: e.target.value})} />
            </div>
            {errors.nom && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase">{errors.nom}</p>}
          </div>

          {/* PRÉNOM */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
              Prénom <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input placeholder="Ex: Jean" className={`${inputClass("prenom")} pl-12 text-primary`} onChange={e => setForm({...form, prenom: e.target.value})} />
            </div>
            {errors.prenom && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase">{errors.prenom}</p>}
          </div>

          {/* TÉLÉPHONE */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
              Téléphone <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input value={form.telephone} className={`${inputClass("telephone")} pl-12 text-primary`} onChange={e => setForm({...form, telephone: e.target.value})} />
            </div>
            {errors.telephone && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase">{errors.telephone}</p>}
          </div>
          
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
              Email Pro
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="email" placeholder="staff@emeno-delivery.com" className={`${inputClass("email")} pl-12 text-primary`} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            {errors.email && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
              Mot de passe <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="password" placeholder="••••••••" className={`${inputClass("password")} pl-12 text-primary`} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            {errors.password && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase">{errors.password}</p>}
          </div>
        </div>

        {/* FOOTER FIXE */}
        <div className="p-6 border-t border-slate-50 bg-slate-50/30 shrink-0">
           <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:bg-secondary hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-3 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Shield size={16} strokeWidth={2.5} /> 
                Créer l'accès Admin
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}