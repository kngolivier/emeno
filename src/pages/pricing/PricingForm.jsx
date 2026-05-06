// FILE: src/pages/pricing/PricingForm.jsx
import { useState, useEffect } from "react";
import { X, MapPin, Banknote, Settings2, CheckCircle, Loader2 } from "lucide-react";
import { formatCommune } from "../../utils/formatter";

const COMMUNES = ["LIBREVILLE", "OWENDO", "AKANDA", "NTOUM", "PORT_GENTIL"];

export default function PricingForm({ onSave, onCancel, pricing }) {
  const [form, setForm] = useState({
    from: "", to: "", pricingType: "COMMUNE", basePrice: "", pricePerKm: "", isActive: true
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...form,
        basePrice: Number(form.basePrice),
        pricePerKm: Number(form.pricePerKm)
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-primary outline-none focus:border-primary/20 focus:bg-white transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2";

  return (
    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden animate-in fade-in duration-300">
      <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-primary italic tracking-tight leading-none">
            {pricing ? "Modifier Tarif" : "Nouveau Tarif"}
          </h2>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2 flex items-center gap-2">
            <Settings2 size={12}/> Grille tarifaire logistique
          </p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all"><X size={20}/></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-6 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-slate-50 flex items-center justify-center z-10 hidden md:flex">
             <MapPin size={14} className="text-primary"/>
          </div>
          <div>
            <label className={labelClass}>Origine</label>
            <select name="from" value={form.from} onChange={handleChange} className={inputClass} required>
              <option value="">Départ</option>
              {COMMUNES.map(c => <option key={c} value={c}>{formatCommune(c)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Destination</label>
            <select name="to" value={form.to} onChange={handleChange} className={inputClass} required>
              <option value="">Arrivée</option>
              {COMMUNES.map(c => <option key={c} value={c}>{formatCommune(c)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
                <label className={labelClass}>Prix de base (FCFA)</label>
                <div className="relative">
                    <input type="number" name="basePrice" value={form.basePrice} onChange={handleChange} className={inputClass + " pl-12"} required placeholder="2000" />
                    <Banknote className="absolute left-4 top-4 text-slate-300" size={18}/>
                </div>
            </div>
            <div>
                <label className={labelClass}>Type de tarification</label>
                <select name="pricingType" value={form.pricingType} onChange={handleChange} className={inputClass}>
                    <option value="COMMUNE">Forfait par zone</option>
                    <option value="DISTANCE">Calcul à la distance</option>
                </select>
            </div>
          </div>
          
          <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex flex-col justify-center text-center">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Aperçu Client</p>
             <p className="text-3xl font-black text-primary">{Number(form.basePrice).toLocaleString() || 0} <span className="text-sm">CFA</span></p>
             <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-wider">Tarif TTC par course</p>
          </div>
        </div>

        <label className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.isActive ? 'bg-secondary border-secondary shadow-lg shadow-secondary/30' : 'bg-white border-slate-200'}`}>
            {form.isActive && <CheckCircle size={14} className="text-white" />}
          </div>
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="hidden" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-primary transition-colors">Activer ce tarif immédiatement</span>
        </label>

        <button type="submit" disabled={loading} className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:bg-secondary hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
          {loading ? <Loader2 className="animate-spin" /> : (pricing ? "Mettre à jour la grille" : "Enregistrer le tarif")}
        </button>
      </form>
    </div>
  );
}