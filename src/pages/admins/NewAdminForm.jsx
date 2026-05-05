// FILE: src/pages/admins/NewAdminForm.jsx

import { useState } from "react";
import { createAdmin } from "../../api/users.api";
import { X, Shield } from "lucide-react";

export default function NewAdminForm({ onClose, onCreated }) {
  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "+241", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.nom.trim()) errs.nom = "Requis";
    if (!form.telephone.match(/^\+241[0-9]{8}$/)) errs.telephone = "Format: +241XXXXXXXX";
    if (form.password.length < 6) errs.password = "Min. 6 caractères";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createAdmin({ ...form, role: "ADMIN" });
      onCreated();
      onClose();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const inputClass = (field) => `w-full bg-slate-50 border ${errors[field] ? "border-rose-400 focus:ring-rose-100" : "border-slate-100 focus:ring-primary/10 focus:border-primary"} rounded-2xl p-4 text-sm font-bold transition-all outline-none`;

  return (
    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden font-sans">
      <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-2xl font-black text-primary font-display italic tracking-tight">Nouvel Admin</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Nom" className={inputClass("nom")} onChange={e => setForm({...form, nom: e.target.value})} />
          <input placeholder="Prénom" className={inputClass("prenom")} onChange={e => setForm({...form, prenom: e.target.value})} />
        </div>
        <input placeholder="Téléphone (+241...)" className={inputClass("telephone")} value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} />
        <input placeholder="Email" type="email" className={inputClass("email")} onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Mot de passe" type="password" className={inputClass("password")} onChange={e => setForm({...form, password: e.target.value})} />

        <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-secondary transition-all disabled:opacity-50">
          {loading ? "Création..." : "Générer l'accès"}
        </button>
      </form>
    </div>
  );
}