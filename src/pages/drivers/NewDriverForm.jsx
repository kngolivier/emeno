// FILE: src/pages/drivers/NewDriverForm.jsx

import { useState } from "react";
import { X, Loader2, Truck, Mail, MapPin } from "lucide-react";
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

  const inputClass = "w-full bg-[var(--color-primary-light)] border-2 rounded-xl p-3 text-xs font-bold text-[var(--text-h)] outline-none transition-all border-[var(--color-border-glass)] focus:border-[var(--color-secondary)]";
  const labelClass = "text-[9px] font-black uppercase tracking-widest text-[var(--text)] opacity-60 mb-1.5 block ml-1";

  return (
    <div className="bg-[var(--color-primary)] w-full max-w-lg shadow-2xl border border-[var(--color-border-glass)] flex flex-col max-h-[90vh] rounded-xl overflow-hidden">
      
      <div className="p-5 border-b border-[var(--color-border-glass)] bg-[var(--color-primary-light)]/30 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-black text-[var(--text-h)] italic uppercase">
          {driver ? "Modifier le livreur" : "Nouveau Livreur"}
        </h2>
        <button type="button" onClick={onCancel} className="text-[var(--text)] hover:rotate-90 transition-transform">
          <X size={20}/>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* IDENTITÉ */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-[var(--color-secondary)] border-b border-[var(--color-border-glass)] pb-1">Informations personnelles</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nom</label>
              <input value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Prénom</label>
              <input value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className={inputClass} required />
            </div>
          </div>
          <div>
             <label className={labelClass}>Email</label>
             <div className="relative">
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass + " pl-10"} />
                <Mail size={14} className="absolute left-3 top-3.5 opacity-40" />
             </div>
          </div>
          <PhoneInput value={formData.telephone} onChange={(val) => setFormData({...formData, telephone: val})} />
        </div>

        {/* LOGISTIQUE */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-[var(--color-secondary)] border-b border-[var(--color-border-glass)] pb-1">Paramètres logistiques</p>
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

        {/* PRÉFÉRENCES & STATUT */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-[var(--color-secondary)] border-b border-[var(--color-border-glass)] pb-1">Gestion</p>
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
              <input value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className={inputClass + " pl-10"} />
              <MapPin size={14} className="absolute left-3 top-3.5 opacity-40" />
            </div>
          </div>
        </div>

      </form>

      <div className="p-6 border-t border-[var(--color-border-glass)] bg-[var(--color-primary)] shrink-0">
        <button type="submit" onClick={handleSubmit} disabled={loading} className="w-full bg-[var(--color-secondary)] text-[var(--color-primary-dark)] py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
}