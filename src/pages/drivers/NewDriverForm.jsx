// FILE: src/components/drivers/NewDriverForm.jsx

import { useState } from "react";
import { X, MapPin, Loader2, Truck } from "lucide-react";
import PhoneInput from "../../components/forms/PhoneInput";

export default function NewDriverForm({ onSave, onCancel, driver }) {
  const [nom, setNom] = useState(driver?.nom || "");
  const [prenom, setPrenom] = useState(driver?.prenom || "");
  const [telephone, setTelephone] = useState(driver?.telephone || "");
  const [email, setEmail] = useState(driver?.email || "");
  const [adresse, setAdresse] = useState(driver?.adresse || "");
  // Ajout du contrôle de capacité (maxActiveDeliveries mentionné dans le service)
  const [maxActiveDeliveries, setMaxActiveDeliveries] = useState(driver?.maxActiveDeliveries || 1);
  // const [status, setStatus] = useState(driver?.status || "ACTIVE");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!nom.trim()) newErrors.nom = "Nom requis";
    if (!prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!telephone.trim()) {
      newErrors.telephone = "Téléphone requis";
    } else if (!/^\+241[0-9]{8}$/.test(telephone)) {
      newErrors.telephone = "Format gabonais requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({
        _id: driver?._id,
        nom: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone.trim(),
        email: email.trim() || undefined, // Gère le nettoyage d'email du service
        adresse: adresse.trim(),
        maxActiveDeliveries: Number(maxActiveDeliveries), // Champ spécifique au service
        role: "DRIVER",
        status,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-[var(--color-primary-light)] border-2 rounded-xl p-3 text-xs font-bold text-[var(--text-h)] outline-none transition-all ${
      errors[field] ? "border-red-500/50" : "border-[var(--color-border-glass)] focus:border-[var(--color-secondary)]"
    }`;

  const labelClass = "text-[9px] font-black uppercase tracking-widest text-[var(--text)] opacity-60 mb-1.5 block ml-1";

  return (
    <div className="bg-[var(--color-primary)] w-full max-w-lg shadow-2xl border border-[var(--color-border-glass)] flex flex-col max-h-[90vh] overflow-hidden rounded-xl">
      
      <div className="p-5 border-b border-[var(--color-border-glass)] bg-[var(--color-primary-light)]/30 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-black text-[var(--text-h)] italic uppercase">
            {driver ? "Modifier Profil" : "Nouveau Livreur"}
          </h2>
          <p className="text-[8px] font-black uppercase text-[var(--color-secondary)]">
            {driver ? `ID: ${driver._id.slice(-6)}` : "Génération auto du mot de passe par SMS"}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="text-[var(--text)] hover:rotate-90 transition-transform">
          <X size={20}/>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
        
        {/* Identité */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom</label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass("nom")} />
          </div>
          <div>
            <label className={labelClass}>Prénom</label>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className={inputClass("prenom")} />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-4">
          <div className="md:col-span-1">
            <label className={labelClass}>Téléphone</label>
            <PhoneInput value={telephone} onChange={setTelephone} error={errors.telephone} />
          </div>
          <div className="md:col-span-1">
            <label className={labelClass}>Capacité Max (Courses)</label>
            <div className="relative">
               <input type="number" min="1" max="10" value={maxActiveDeliveries} onChange={(e) => setMaxActiveDeliveries(e.target.value)} className={inputClass() + " pl-10"} />
               <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-[var(--text)]" />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label className={labelClass}>Adresse de résidence</label>
          <div className="relative">
            <input value={adresse} onChange={(e) => setAdresse(e.target.value)} className={inputClass() + " pl-10"} placeholder="Quartier, Ville" />
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-[var(--text)]" />
          </div>
        </div>

        {/* Statut (Uniquement en modification)
        {driver && (
          <div>
            <label className={labelClass}>Statut Compte</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              disabled={driver.status === "PENDING"} // Protection hiérarchique du service
              className={inputClass() + " appearance-none"}
            >
              <option value="ACTIVE">Actif / Disponible</option>
              <option value="INACTIVE">Inactif / Pause</option>
              <option value="BLOCKED">Bloqué / Suspendu</option>
            </select>
            {driver.status === "PENDING" && (
              <p className="text-[7px] text-[var(--color-secondary)] mt-1 ml-2 font-bold uppercase italic">
                En attente de validation OTP client
              </p>
            )}
          </div>
        )} */}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-[var(--color-border-glass)]">
          <button 
            type="submit" 
            disabled={loading} 
            className="flex-[2] bg-[var(--color-secondary)] text-[var(--color-primary-dark)] py-4 rounded-xl font-black uppercase tracking-tighter text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (driver ? "Enregistrer les modifications" : "Créer le livreur")}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-xl font-black uppercase text-xs text-[var(--text)] hover:bg-[var(--color-primary-light)] transition-all">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}