// FILE: src/pages/pricing/PricingForm.jsx
import { useState, useEffect } from "react";
import { X, Banknote, Settings2, CheckCircle, Loader2, Navigation } from "lucide-react";
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

  // Classes compactes : Police de 15px pour éviter le zoom iOS/Android tout en restant fin
  const inputClass = "w-full bg-slate-50/80 border border-slate-100 rounded-xl p-3 text-[15px] font-bold text-primary outline-none focus:border-secondary/50 focus:bg-white transition-all appearance-none";
  const labelClass = "text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 block ml-1";

  return (
    <div className="bg-white w-full max-w-lg md:rounded-[2rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-slate-100">
      
      {/* HEADER COMPACT */}
      <div className="p-4 border-b bg-slate-50/30 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Settings2 size={16}/>
          </div>
          <h2 className="text-base font-black text-primary italic font-display uppercase tracking-tight">
            {pricing ? "Modifier Tarif" : "Nouveau Tarif"}
          </h2>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-300 hover:text-rose-500 transition-all active:scale-90">
          <X size={20}/>
        </button>
      </div>

      {/* CORPS SCROLLABLE SI BESOIN */}
      <form id="pricing-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        
        {/* GRILLE D'ORIGINE / DESTINATION */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={labelClass}>Départ</label>
            <select name="from" value={form.from} onChange={handleChange} className={inputClass} required>
              <option value="">Sélection...</option>
              {COMMUNES.map(c => <option key={c} value={c}>{formatCommune(c)}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Arrivée</label>
            <select name="to" value={form.to} onChange={handleChange} className={inputClass} required>
              <option value="">Sélection...</option>
              {COMMUNES.map(c => <option key={c} value={c}>{formatCommune(c)}</option>)}
            </select>
          </div>
        </div>

        {/* PRIX ET APERÇU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Prix de base (CFA)</label>
              <div className="relative">
                <input type="number" name="basePrice" value={form.basePrice} onChange={handleChange} className={inputClass + " pl-10"} required placeholder="2000" />
                <Banknote size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select name="pricingType" value={form.pricingType} onChange={handleChange} className={inputClass}>
                <option value="COMMUNE">Forfait Zone</option>
                <option value="DISTANCE">Distance KM</option>
              </select>
            </div>
          </div>
          
          {/* APERÇU VISUEL */}
          <div className="p-4 bg-primary text-white rounded-2xl flex flex-col justify-center text-center relative overflow-hidden">
             <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Affiche Client</p>
             <p className="text-2xl font-display font-black italic leading-none">
              {Number(form.basePrice || 0).toLocaleString()} <span className="text-[10px] font-sans not-italic uppercase">CFA</span>
             </p>
             <Navigation className="absolute -right-2 -bottom-2 w-12 h-12 opacity-10" />
          </div>
        </div>

        {/* TOGGLE STATUS */}
        <label className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl cursor-pointer hover:bg-white transition-all group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.isActive ? 'bg-secondary border-secondary shadow-lg shadow-secondary/20' : 'bg-white border-slate-200'}`}>
            {form.isActive && <CheckCircle size={12} className="text-white" strokeWidth={3} />}
          </div>
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="hidden" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">Activer le tarif</span>
        </label>
      </form>

      {/* FOOTER FIXE */}
      <div className="p-4 border-t bg-white shrink-0">
        <button 
          type="submit" 
          form="pricing-form"
          disabled={loading} 
          className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}