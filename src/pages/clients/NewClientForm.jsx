// FILE: src/components/clients/NewClientForm.jsx
import React, { useState } from "react";
import { UserPlus, MapPin, Check, X, User } from "lucide-react";
import PhoneInput from "../../components/forms/PhoneInput";

export default function NewClientForm({ onSave, onCancel }) {
  const [client, setClient] = useState({ nom: "", prenom: "", telephone: "", adresse: "" });
  const [errors, setErrors] = useState({});

  // Classes adaptées pour le thème sombre (bg-slate-800, dark:border-slate-700, etc.)
  const inputClass = "w-full border-2 border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-4 text-sm md:text-base font-bold outline-none focus:border-secondary/30 dark:focus:border-secondary/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-secondary/5 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:font-normal text-primary dark:text-white";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 ml-2 mb-2 flex items-center gap-1";
  const asteriskClass = "text-secondary text-sm"; 

  const validate = () => {
    const newErrors = {};
    if (!client.nom.trim()) newErrors.nom = "Nom requis";
    if (!client.prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!client.telephone.trim() || client.telephone === "+241") {
      newErrors.telephone = "Téléphone requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(client);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-50 dark:border-slate-800 w-full max-w-lg max-h-[70vh] mx-auto animate-in slide-in-from-bottom-4 duration-500 flex flex-col overflow-hidden">      
      {/* 1. HEADER : Fixe */}
      <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-white dark:bg-slate-900">
        
        {/* Partie Gauche : Icône + Titre */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary dark:bg-white/[0.05] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 dark:shadow-none rotate-3 border border-transparent dark:border-white/10 shrink-0">
            <UserPlus size={22} className="text-white dark:text-secondary" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-black text-primary dark:text-white italic font-display leading-none uppercase">
              Nouveau Client
            </h2>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 text-secondary">
              Base de données EMENO
            </p>
          </div>
        </div>

        {/* Partie Droite : Bouton fermer */}
        <button 
          onClick={onCancel} 
          className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-rose-500 transition-all active:scale-90"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. FORMULAIRE : Scrollable */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 md:space-y-6 overflow-y-auto flex-1">        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Nom <span className={asteriskClass}>*</span></label>
            <input 
              required
              className={`${inputClass} ${errors.nom ? "border-rose-100" : ""}`}
              placeholder="Mba"
              value={client.nom}
              onChange={e => setClient({...client, nom: e.target.value.toUpperCase()})} 
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Prénom <span className={asteriskClass}>*</span></label>
            <input 
              required
              className={`${inputClass} ${errors.prenom ? "border-rose-100" : ""}`} 
              placeholder="Jean"
              value={client.prenom}
              onChange={e => setClient({...client, prenom: e.target.value})} 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Téléphone <span className={asteriskClass}>*</span></label>
          <PhoneInput 
            value={client.telephone} 
            onChange={(val) => setClient({...client, telephone: val})} 
            error={errors.telephone}
          />
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Quartier de résidence</label>
          <input 
            className={inputClass} 
            placeholder="Ex: Angondjé, Libreville" 
            value={client.adresse}
            onChange={e => setClient({...client, adresse: e.target.value})} 
          />
        </div>
      </form>

      {/* 3. FOOTER : Fixe */}
      <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 shrink-0">        <button 
          type="submit"
          onClick={handleSubmit}
          className="w-full py-5 bg-primary dark:bg-secondary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Check size={18} strokeWidth={3} /> Créer le profil client
        </button>
      </div>
    </div>
  );
}