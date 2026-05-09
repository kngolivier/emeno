// FILE: src/pages/communes/CommuneForm.jsx

import { useState } from "react";
import { X, MapPin, Hash, Loader2 } from "lucide-react";

export default function CommuneForm({ commune, onSave, onCancel }) {
  const [name, setName] = useState(commune?.name || "");
  const [displayOrder, setDisplayOrder] = useState(commune?.displayOrder || 1);
  const [isActive, setIsActive] = useState(commune?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSave({ name: name.toUpperCase(), displayOrder, isActive });
    setLoading(false);
  };

  const inputClass = "w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-secondary/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl p-4 text-sm font-bold text-primary dark:text-white outline-none transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden font-sans border dark:border-white/10">
      <div className="p-6 md:p-8 border-b dark:border-white/5 flex justify-between items-center">
        <h2 className="text-xl font-black text-primary dark:text-white italic uppercase tracking-tight">
          {commune ? "Modifier Commune" : "Nouvelle Zone"}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:rotate-90 transition-transform"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div>
          <label className={labelClass}>Nom de la commune (ex: AKANDA)</label>
          <div className="relative">
            <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} pl-12`} placeholder="LIBREVILLE..." required />
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Ordre de tri</label>
            <div className="relative">
              <input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value))} className={`${inputClass} pl-12`} />
              <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`h-[56px] rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 
              ${isActive ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-400 border-slate-100'}`}
            >
              {isActive ? 'Zone Active' : 'Zone Inactive'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-secondary transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Enregistrer"}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Annuler</button>
        </div>
      </form>
    </div>
  );
}