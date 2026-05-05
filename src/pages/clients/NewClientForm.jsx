// FILE: src/components/clients/NewClientForm.jsx

import { useState } from "react";
import { X } from "lucide-react";

export default function NewClientForm({ onSave, onCancel, client }) {
  const [formData, setFormData] = useState({
    nom: client?.nom || "",
    prenom: client?.prenom || "",
    telephone: client?.telephone || "",
    email: client?.email || "",
    adresse: client?.adresse || "",
    role: "CLIENT"
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};
    if (!formData.nom.trim()) err.nom = "Requis";
    if (!formData.prenom.trim()) err.prenom = "Requis";
    if (!/^\+241[0-9]{8}$/.test(formData.telephone)) err.telephone = "Format: +241XXXXXXXX";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try { await onSave(formData); } 
    finally { setLoading(false); }
  };

  const inputClass = (f) => `w-full border rounded-2xl p-4 text-sm font-sans outline-none transition-all ${errors[f] ? "border-red-400 ring-2 ring-red-50" : "border-slate-100 focus:ring-4 focus:ring-primary/10 focus:border-primary bg-slate-50/50"}`;
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block";

  return (
    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden font-sans">
      <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-2xl font-black text-primary font-display italic tracking-tight">
          {client ? "Modifier" : "Nouveau Client"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom</label>
            <input value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className={inputClass("nom")} placeholder="Ex: Nguema" />
          </div>
          <div>
            <label className={labelClass}>Prénom</label>
            <input value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className={inputClass("prenom")} placeholder="Ex: Marc" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Téléphone (Gabon)</label>
          <input value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className={inputClass("telephone")} placeholder="+241XXXXXXXX" />
          {errors.telephone && <p className="text-red-500 text-[10px] mt-1 font-bold italic">{errors.telephone}</p>}
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass("email")} placeholder="client@nelia.com" />
        </div>

        <div>
          <label className={labelClass}>Adresse de livraison</label>
          <input value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className={inputClass("adresse")} placeholder="Ex: Angondjé, Libreville" />
        </div>

        <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-secondary transition-all">
          {loading ? "Création..." : "Enregistrer le client"}
        </button>
      </form>
    </div>
  );
}