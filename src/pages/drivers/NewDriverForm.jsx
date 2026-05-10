// FILE: src/components/drivers/NewDriverForm.jsx
import { useState } from "react";
import { X, User, Mail, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import PhoneInput from "../../components/forms/PhoneInput";

export default function NewDriverForm({ onSave, onCancel, driver }) {
  const [nom, setNom] = useState(driver?.nom || "");
  const [prenom, setPrenom] = useState(driver?.prenom || "");
  const [telephone, setTelephone] = useState(driver?.telephone || "");
  const [email, setEmail] = useState(driver?.email || "");
  const [adresse, setAdresse] = useState(driver?.adresse || "");
  const [status, setStatus] = useState(driver?.status || "ACTIVE");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!nom.trim()) newErrors.nom = "Nom requis";
    if (!prenom.trim()) newErrors.prenom = "Prénom requis";
    
    // Validation du téléphone adaptée au format attendu par ton API (+241XXXXXXXX)
    if (!telephone.trim()) {
      newErrors.telephone = "Téléphone requis";
    } else if (!/^\+241[0-9]{8}$/.test(telephone)) {
      newErrors.telephone = "Format requis: +241XXXXXXXX";
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
        nom: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        adresse: adresse.trim(),
        role: "DRIVER",
        status,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-slate-50/50 border-2 rounded-xl md:rounded-2xl p-3 md:p-4 text-xs md:text-sm font-bold text-primary outline-none transition-all ${
      errors[field]
        ? "border-red-200 focus:border-red-400 focus:bg-white"
        : "border-slate-50 focus:border-secondary/20 focus:bg-white"
    }`;

  const labelClass = "text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1 md:ml-2";

  return (
    <div className="bg-white w-full max-w-lg md:rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col max-h-screen md:max-h-[90vh] overflow-hidden font-sans animate-in zoom-in-95 duration-300">
      
      {/* HEADER */}
      <div className="p-5 md:p-8 border-b bg-slate-50/50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-primary italic tracking-tight uppercase">
            {driver ? "Modifier Profil" : "Nouveau Livreur"}
          </h2>
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-secondary mt-1">Identification Staff</p>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
          <X size={20}/>
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-5 md:space-y-6 overflow-y-auto scrollbar-hide">
        
        {/* Grille Nom/Prénom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom <span className="text-red-500">*</span></label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass("nom")} placeholder="Ex: MBOUMBA" />
            {errors.nom && <p className="text-red-500 text-[8px] font-bold mt-1 ml-1 uppercase">{errors.nom}</p>}
          </div>
          <div>
            <label className={labelClass}>Prénom <span className="text-red-500">*</span></label>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className={inputClass("prenom")} placeholder="Ex: Jean" />
            {errors.prenom && <p className="text-red-500 text-[8px] font-bold mt-1 ml-1 uppercase">{errors.prenom}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>Téléphone <span className="text-red-500">*</span></label>
            {/* Remplacement par le composant PhoneInput */}
            <PhoneInput 
              value={telephone} 
              onChange={setTelephone} 
              error={errors.telephone}
            />
            {errors.telephone && <p className="text-red-500 text-[8px] font-bold mt-1 ml-1 uppercase">{errors.telephone}</p>}
          </div>
          <div>
            <label className={labelClass}>Email (Optionnel)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass("email")} placeholder="contact@livreur.ga" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Adresse de résidence</label>
          <div className="relative">
            <input value={adresse} onChange={(e) => setAdresse(e.target.value)} className={inputClass("adresse") + " pl-10"} placeholder="Ex: Akanda, Cité Shell" />
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Statut opérationnel</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass("status") + " appearance-none cursor-pointer"}>
            <option value="ACTIVE">Actif (Prêt pour courses)</option>
            <option value="INACTIVE">Inactif (En repos)</option>
            <option value="BLOCKED">Bloqué (Accès restreint)</option>
          </select>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-slate-50 mt-4">
          <button type="submit" disabled={loading} className="w-full md:flex-[2] order-1 md:order-2 bg-primary text-white py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-primary/10 hover:bg-secondary active:scale-95 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : (driver ? "Mettre à jour" : "Enregistrer")}
          </button>
          <button type="button" onClick={onCancel} className="w-full md:flex-1 order-2 md:order-1 py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs text-slate-400 hover:bg-slate-50 transition-all">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}