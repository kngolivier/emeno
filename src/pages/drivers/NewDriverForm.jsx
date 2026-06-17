// FILE: src/pages/drivers/NewDriverForm.jsx

import { useState } from "react";
import { X, Loader2, Mail, MapPin } from "lucide-react";
import PhoneInput from "../../components/forms/PhoneInput";

export default function NewDriverForm({ onSave, onCancel, driver }) {
  const [formData, setFormData] = useState({
    nom: driver?.nom || "",
    prenom: driver?.prenom || "",
    telephone: driver?.telephone || "",
    email: driver?.email || "",
    adresse: driver?.adresse || "",
    maxActiveDeliveries: driver?.maxActiveDeliveries || 1,
    maxActiveDeliveriesB2C: driver?.maxActiveDeliveriesB2C || 5,
    scheduledPauseAt: driver?.scheduledPauseAt || "13:00",
    maxPauseDuration: driver?.pauseTracking?.maxPauseDuration / 60 || 60,
    status: driver?.status || "ACTIVE"
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...driver,
        ...formData,
        maxPauseDuration: Number(formData.maxPauseDuration) * 60,
      });
    } finally {
      setLoading(false);
    }
  };

  // Classes unifiées pour une cohérence visuelle parfaite en light et dark
  const inputClass = "w-full bg-primary-light border-2 border-border rounded-xl p-3 text-xs font-bold text-slate-800 text-white outline-none transition-all focus:border-secondary";
  const labelClass = "text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 block ml-1";
  const sectionTitleClass = "text-[10px] font-black uppercase text-secondary border-b border-border pb-1";

  return (
    <div className="bg-primary w-full max-w-lg shadow-2xl border border-border flex flex-col max-h-[70vh] rounded-3xl overflow-hidden">
      
      {/* HEADER */}
      <div className="p-5 border-b border-border bg-primary-light/30 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-black text-slate-900 text-white italic uppercase">
          {driver ? "Modifier le livreur" : "Nouveau Livreur"}
        </h2>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-secondary transition-colors">
          <X size={20}/>
        </button>
      </div>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
        
        {/* IDENTITÉ */}
        <div className="space-y-4">
          <p className={sectionTitleClass}>Informations personnelles</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nom</label>
              <input value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className={inputClass} placeholder="Nom" required />
            </div>
            <div>
              <label className={labelClass}>Prénom</label>
              <input value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className={inputClass} placeholder="Prénom" required />
            </div>
          </div>
          <div>
             <label className={labelClass}>Email</label>
             <div className="relative">
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${inputClass} placeholder:text-slate-400 pl-10`} placeholder="Email" />
                <Mail size={14} className="absolute left-3 top-3.5 text-slate-400" />
             </div>
          </div>
          <PhoneInput value={formData.telephone} onChange={(val) => setFormData({...formData, telephone: val})} />
        </div>

        {/* LOGISTIQUE */}
        <div className="space-y-4">
          <p className={sectionTitleClass}>Paramètres logistiques</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Capacité (Standard)</label>
              <input type="number" value={formData.maxActiveDeliveries} onChange={(e) => setFormData({...formData, maxActiveDeliveries: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Capacité (B2C)</label>
              <input type="number" value={formData.maxActiveDeliveriesB2C} onChange={(e) => setFormData({...formData, maxActiveDeliveriesB2C: e.target.value})} className={inputClass} />
            </div>
          </div>
        </div>

        {/* GESTION */}
        <div className="space-y-4">
          <p className={sectionTitleClass}>Gestion</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Heure de pause</label>
              <input type="time" value={formData.scheduledPauseAt} onChange={(e) => setFormData({...formData, scheduledPauseAt: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Statut</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={inputClass}>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
                <option value="BLOCKED">Bloqué</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Adresse</label>
            <div className="relative">
              <input value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className={`${inputClass} placeholder:text-slate-400 pl-10`} placeholder="Adresse" />
              <MapPin size={14} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </form>

      {/* FOOTER */}
      <div className="p-6 border-t border-border bg-primary-light/10 shrink-0">
        <button type="submit" onClick={handleSubmit} disabled={loading} className="w-full bg-secondary text-primary-dark py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
}