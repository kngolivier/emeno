// FILE: src/components/drivers/NewDriverForm.jsx
import { useState } from "react";
import { X, User, Phone, Mail, MapPin, ShieldCheck, Loader2 } from "lucide-react";

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
    if (!telephone.trim()) {
      newErrors.telephone = "Téléphone requis";
    } else if (!/^\+241[0-9]{8}$/.test(telephone)) {
      newErrors.telephone = "Format attendu: +241XXXXXXXX";
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email invalide";
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
    `w-full bg-slate-50/50 border-2 rounded-2xl p-4 text-sm font-bold text-primary outline-none transition-all ${
      errors[field]
        ? "border-red-200 focus:border-red-400 focus:bg-white"
        : "border-slate-50 focus:border-secondary/20 focus:bg-white"
    }`;

  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2";

  return (
    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden font-sans animate-in zoom-in-95 duration-300">
      <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-primary italic tracking-tight">
            {driver ? "Modifier le profil" : "Nouveau Livreur"}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">Identification Staff</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom <span className="text-red-500">*</span></label>
            <input value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass("nom")} placeholder="Ex: MBOUMBA" />
            {errors.nom && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.nom}</p>}
          </div>
          <div>
            <label className={labelClass}>Prénom <span className="text-red-500">*</span></label>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className={inputClass("prenom")} placeholder="Ex: Jean" />
            {errors.prenom && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.prenom}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Téléphone <span className="text-red-500">*</span></label>
            <input value={telephone} onChange={(e) => setTelephone(e.target.value)} className={inputClass("telephone")} placeholder="+241XXXXXXXX" />
            {errors.telephone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.telephone}</p>}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass("email")} placeholder="contact@livreur.ga" />
            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Adresse de résidence</label>
          <input value={adresse} onChange={(e) => setAdresse(e.target.value)} className={inputClass("adresse")} placeholder="Ex: Akanda, Cité Shell" />
        </div>

        <div>
          <label className={labelClass}>Statut opérationnel</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass("status")}>
            <option value="ACTIVE">Actif (Prêt pour courses)</option>
            <option value="INACTIVE">Inactif (En repos)</option>
            <option value="BLOCKED">Bloqué (Accès restreint)</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50 transition-all">Annuler</button>
          <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-secondary hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : (driver ? "Mettre à jour" : "Enregistrer le livreur")}
          </button>
        </div>
      </form>
    </div>
  );
}