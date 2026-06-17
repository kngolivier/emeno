// FILE: src/pages/admins/NewAdminForm.jsx

import React, { useState } from "react";
import { X, Shield, Lock, Smartphone, Mail, Loader2, User, UserCheck } from "lucide-react";
import { notifyError, notifySuccess } from "../../utils/notify";
import { createAdmin } from "../../api/users.api";
import PhoneInput from "../../components/forms/PhoneInput";

export default function NewAdminForm({ onClose, onCreated }) {
  const [form, setForm] = useState({ 
    nom: "", 
    prenom: "", 
    telephone: "+241", 
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.nom.trim()) errs.nom = "Nom requis";
    if (!form.prenom.trim()) errs.prenom = "Prénom requis";
    if (!form.telephone.match(/^\+241[0-9]{8,9}$/)) errs.telephone = "Format: +241XXXXXXXX";
    if (form.email && !form.email.includes("@")) errs.email = "Email invalide";
    // if (form.password.length < 6) errs.password = "6 caractères min.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await createAdmin(form);
      notifySuccess("Le compte administrateur a été créé avec succès");
      onCreated();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Erreur lors de la création de l'admin";
      notifyError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => `
    w-full bg-slate-50/80 dark:bg-white/5 border-2 transition-all outline-none rounded-xl p-3.5 text-sm font-bold
    text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600
    ${errors[field] 
      ? "border-rose-100 dark:border-rose-500/20 focus:border-rose-400 bg-rose-50/20 dark:bg-rose-500/10" 
      : "border-slate-50 dark:border-white/5 focus:border-primary/20 dark:focus:border-secondary/40 focus:bg-white dark:focus:bg-white/10"}
  `;

  return (
    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-none border border-slate-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[70vh] transition-colors">
      
      {/* HEADER FIXE */}
      <div className="p-6 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-primary to-secondary text-white rounded-xl shadow-lg shadow-primary/20">
            <UserCheck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-black text-primary dark:text-white italic uppercase tracking-tighter leading-none">Nouveau Staff</h2>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Accès sécurisé</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 rounded-full transition-all">
          <X size={18} strokeWidth={3}/>
        </button>
      </div>

      {/* CORPS SCROLLABLE */}
      <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
        <div className="p-6 space-y-5 overflow-y-auto scrollbar-hide bg-white dark:bg-slate-900">
          
          {/* NOM */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-2">
              Nom <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={16} />
              <input 
                placeholder="Ex: NDONG" 
                className={`${inputClass("nom")} pl-12 uppercase`} 
                onChange={e => setForm({...form, nom: e.target.value})} 
              />
            </div>
            {errors.nom && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase tracking-tighter">{errors.nom}</p>}
          </div>

          {/* PRÉNOM */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-2">
              Prénom <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={16} />
              <input 
                placeholder="Ex: Jean" 
                className={`${inputClass("prenom")} pl-12`} 
                onChange={e => setForm({...form, prenom: e.target.value})} 
              />
            </div>
            {errors.prenom && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase tracking-tighter">{errors.prenom}</p>}
          </div>

          {/* TÉLÉPHONE */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-2">
            </label>
            <PhoneInput 
              value={form.telephone} 
              onChange={(val) => setForm({...form, telephone: val})} 
              error={errors.telephone}
            />
            {errors.telephone && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase tracking-tighter">{errors.telephone}</p>}
          </div>
          
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-2">
              Email Pro
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={16} />
              <input 
                type="email" 
                placeholder="staff@emeno-delivery.com" 
                className={`${inputClass("email")} pl-12`} 
                onChange={e => setForm({...form, email: e.target.value})} 
              />
            </div>
            {errors.email && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase tracking-tighter">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          {/* <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-2">
              Mot de passe <span className="text-rose-500 font-black">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={16} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className={`${inputClass("password")} pl-12`} 
                onChange={e => setForm({...form, password: e.target.value})} 
              />
            </div>
            {errors.password && <p className="text-[8px] font-black text-rose-500 ml-2 uppercase tracking-tighter">{errors.password}</p>}
          </div> */}
        </div>

        {/* FOOTER FIXE */}
        <div className="p-6 border-t border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02] shrink-0">
           <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-primary dark:bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 dark:shadow-none hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-3 active:scale-95"
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