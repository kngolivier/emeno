// FILE: src/pages/pricing/PricingForm.jsx

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { formatCommune } from "../../utils/formatter";

const COMMUNES = ["LIBREVILLE", "OWENDO", "AKANDA", "NTOUM", "PORT_GENTIL"];
const PRICING_TYPES = ["COMMUNE", "DISTANCE"];

export default function PricingForm({ onSave, onCancel, pricing }) {
  const [form, setForm] = useState({
    from: "",
    to: "",
    pricingType: "COMMUNE",
    basePrice: "",
    pricePerKm: "",
    isActive: true
  });

  useEffect(() => {
    if (pricing) {
      setForm({
        _id: pricing._id,
        from: pricing.from || "",
        to: pricing.to || "",
        pricingType: pricing.pricingType || "COMMUNE",
        basePrice: pricing.basePrice || "",
        pricePerKm: pricing.pricePerKm || "",
        isActive: pricing.isActive ?? true
      });
    }
  }, [pricing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      basePrice: Number(form.basePrice),
      pricePerKm: Number(form.pricePerKm)
    });
  };

  const inputClass = "w-full border border-slate-100 bg-slate-50/50 rounded-2xl p-4 text-sm font-sans outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block";

  return (
    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden font-sans">
      <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
        <h2 className="text-2xl font-black text-primary font-display italic tracking-tight">
          {pricing ? "Modifier le tarif" : "Nouveau tarif"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Origine (De)</label>
            <select name="from" value={form.from} onChange={handleChange} className={inputClass} required>
              <option value="">Sélectionner</option>
              {COMMUNES.map(c => <option key={c} value={c}>{formatCommune(c)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Destination (À)</label>
            <select name="to" value={form.to} onChange={handleChange} className={inputClass} required>
              <option value="">Sélectionner</option>
              {COMMUNES.map(c => <option key={c} value={c}>{formatCommune(c)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Méthode de calcul</label>
          <select name="pricingType" value={form.pricingType} onChange={handleChange} className={inputClass}>
            {PRICING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Prix de base (FCFA)</label>
            <input type="number" name="basePrice" value={form.basePrice} onChange={handleChange} className={inputClass} required placeholder="2000" />
          </div>
          <div>
            <label className={labelClass}>Prix par Km (FCFA)</label>
            <input type="number" name="pricePerKm" value={form.pricePerKm} onChange={handleChange} className={inputClass} placeholder="500" />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-5 h-5 accent-primary border-none rounded" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Activer ce tarif immédiatement</span>
        </div>

        <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-secondary transition-all">
          {pricing ? "Mettre à jour la grille" : "Enregistrer le tarif"}
        </button>
      </form>
    </div>
  );
}