// FILE: src/components/clients/NewClientForm.jsx
import React, { useState } from "react";
import { UserPlus, MapPin, Smartphone, Check, X, User } from "lucide-react";

export default function NewClientForm({ onSave, onCancel }) {
  const [client, setClient] = useState({ nom: "", prenom: "", telephone: "+241", adresse: "" });

  const inputClass = "w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm md:text-base font-bold outline-none focus:border-secondary/30 focus:bg-white focus:ring-4 focus:ring-secondary/5 transition-all placeholder:text-slate-300 placeholder:font-normal text-primary";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-2 mb-2 flex items-center gap-1";
  const asteriskClass = "text-secondary text-sm"; // Le doré/cyan de la charte

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!client.nom || !client.prenom || !client.telephone) return;
    onSave(client);
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden w-full max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER AVEC STYLE EMENO */}
      <div className="p-6 md:p-8 bg-slate-50/30 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3">
            <UserPlus size={22} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-primary italic font-display leading-none">Nouveau Client</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enregistrement système</p>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="p-2 bg-white rounded-xl border border-slate-100 text-slate-300 hover:text-danger hover:border-danger/20 transition-all active:scale-90"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 md:space-y-7">
        
        {/* NOM & PRÉNOM - Côte à côte même sur mobile pour compacité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>
              Nom <span className={asteriskClass}>*</span>
            </label>
            <div className="relative">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hidden md:block" />
              <input 
                required
                className={`${inputClass} md:pl-11`}
                placeholder="Ex: Mba"
                onChange={e => setClient({...client, nom: e.target.value})} 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>
              Prénom <span className={asteriskClass}>*</span>
            </label>
            <input 
              required
              className={`${inputClass} text-primary`} 
              placeholder="Ex: Jean"
              onChange={e => setClient({...client, prenom: e.target.value})} 
            />
          </div>
        </div>

        {/* TÉLÉPHONE */}
        <div className="space-y-1">
          <label className={labelClass}>
            Téléphone <span className={asteriskClass}>*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3">
               <Smartphone size={16} className="text-secondary" />
            </div>
            <input 
              required
              type="tel"
              className={inputClass + " pl-16 text-primary"} 
              value={client.telephone} 
              onChange={e => setClient({...client, telephone: e.target.value})} 
            />
          </div>
        </div>

        {/* ADRESSE / QUARTIER */}
        <div className="space-y-1">
          <label className={labelClass}>Quartier de résidence</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MapPin size={16} className="text-slate-300" />
            </div>
            <input 
              className={inputClass + " pl-12 font-medium"} 
              placeholder="ex: Angondjé, Libreville" 
              onChange={e => setClient({...client, adresse: e.target.value})} 
            />
          </div>
        </div>

        {/* ACTIONS FOOTER */}
        <div className="flex flex-col gap-3 pt-2">
            <button 
              type="submit"
              className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-primary/10 hover:bg-secondary active:scale-[0.98] transition-all"
            >
              <Check size={18} strokeWidth={3} /> Enregistrer le client
            </button>
            <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-tighter">
                Les champs marqués d'une <span className={asteriskClass}>*</span> sont obligatoires
            </p>
        </div>
      </form>
    </div>
  );
}