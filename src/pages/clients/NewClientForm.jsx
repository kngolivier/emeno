// FILE: src/components/clients/NewClientForm.jsx
import React, { useState } from "react";
import { UserPlus, MapPin, Smartphone, Check, X } from "lucide-react";

export default function NewClientForm({ onSave, onCancel }) {
  const [client, setClient] = useState({ nom: "", prenom: "", telephone: "+241", adresse: "" });

  const inputClass = "w-full border-2 border-slate-50 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold outline-none focus:border-primary/20 focus:bg-white transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-300 ml-2 mb-2 block";

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden w-full max-w-md mx-auto">
      <div className="p-8 bg-slate-50/50 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <UserPlus size={20} />
          </div>
          <h2 className="text-xl font-black text-primary italic font-display">Fiche Client</h2>
        </div>
        <button onClick={onCancel} className="text-slate-300 hover:text-rose-500 transition-colors"><X /></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom</label>
            <input className={inputClass} onChange={e => setClient({...client, nom: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Prénom</label>
            <input className={inputClass} onChange={e => setClient({...client, prenom: e.target.value})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Téléphone</label>
          <div className="relative">
            <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input className={inputClass + " pl-12"} value={client.telephone} onChange={e => setClient({...client, telephone: e.target.value})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Quartier de résidence</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input className={inputClass + " pl-12"} placeholder="ex: Angondjé, Carrefour Joli Soir" onChange={e => setClient({...client, adresse: e.target.value})} />
          </div>
        </div>

        <button 
          onClick={() => onSave(client)}
          className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-primary/10 hover:bg-secondary transition-all"
        >
          <Check size={18} /> Enregistrer le client
        </button>
      </div>
    </div>
  );
}