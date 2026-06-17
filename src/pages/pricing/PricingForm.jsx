// FILE: src/pages/pricing/PricingForm.jsx
import { useState, useEffect } from "react";
import { X, Banknote, Settings2, CheckCircle, Loader2, Navigation } from "lucide-react";
import { fetchCommunes } from "../../api/commune.api";
import { notifyError } from "../../utils/notify";

export default function PricingForm({ onSave, onCancel, pricing }) {
  const [communes, setCommunes] = useState([]); // Remplacent le tableau statique
  const [form, setForm] = useState({
    from: "", 
    to: "", 
    pricingType: "COMMUNE", 
    basePrice: "", 
    pricePerKm: "", 
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [fetchingCommunes, setFetchingCommunes] = useState(true);

  /**
   * Chargement des communes depuis la base de données
   */
  useEffect(() => {
    const loadCommunesData = async () => {
      try {
        setFetchingCommunes(true);
        const res = await fetchCommunes();
        const data = res?.data || res;
        // On ne garde que les communes actives pour créer des tarifs fonctionnels
        setCommunes(data.filter(c => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder));
      } catch (err) {
        notifyError("Impossible de charger les zones de livraison");
        console.error(err);
      } finally {
        setFetchingCommunes(false);
      }
    };
    loadCommunesData();
  }, []);

  /**
   * Initialisation du formulaire en mode édition
   */
  useEffect(() => {
    if (pricing) {
      setForm({
        _id: pricing._id,
        // On stocke l'ID de la commune (Object ID de MongoDB)
        from: pricing.from?._id || pricing.from || "",
        to: pricing.to?._id || pricing.to || "",
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
        pricePerKm: Number(form.pricePerKm || 0)
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50/80 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 text-[15px] font-bold text-primary dark:text-white outline-none focus:border-secondary/50 focus:bg-white dark:focus:bg-slate-700 transition-all appearance-none disabled:opacity-50";
  const labelClass = "text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 block ml-1";

  return (
    <div className="bg-white dark:bg-slate-900 w-full max-w-lg md:rounded-[2rem] shadow-2xl flex flex-col max-h-[70vh] overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
      
      {/* HEADER */}
      <div className="p-4 border-b dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Settings2 size={16}/>
          </div>
          <h2 className="text-base font-black text-primary dark:text-white italic font-display uppercase tracking-tight">
            {pricing ? "Modifier Tarif" : "Nouveau Tarif"}
          </h2>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-300 hover:text-rose-500 transition-all active:scale-90">
          <X size={20}/>
        </button>
      </div>

      {/* CORPS FORMULAIRE */}
      <form id="pricing-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
        
        {/* GRILLE D'ORIGINE / DESTINATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Point de départ</label>
            <div className="relative">
              <select 
                name="from" 
                value={form.from} 
                onChange={handleChange} 
                className={inputClass} 
                required
                disabled={fetchingCommunes}
              >
                <option value="">{fetchingCommunes ? "Chargement..." : "Sélectionner..."}</option>
                {communes.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Navigation size={12} className="rotate-45" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Point d'arrivée</label>
            <div className="relative">
              <select 
                name="to" 
                value={form.to} 
                onChange={handleChange} 
                className={inputClass} 
                required
                disabled={fetchingCommunes}
              >
                <option value="">{fetchingCommunes ? "Chargement..." : "Sélectionner..."}</option>
                {communes.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Navigation size={12} className="rotate-[135deg]" />
              </div>
            </div>
          </div>
        </div>

        {/* PRIX ET CONFIGURATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Prix de base (CFA)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="basePrice" 
                  value={form.basePrice} 
                  onChange={handleChange} 
                  className={inputClass + " pl-10"} 
                  required 
                  placeholder="2000" 
                />
                <Banknote size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Méthode de calcul</label>
              <select name="pricingType" value={form.pricingType} onChange={handleChange} className={inputClass}>
                <option value="COMMUNE">Tarif Forfaitaire</option>
                <option value="DISTANCE">Au Kilomètre</option>
              </select>
            </div>
          </div>
          
          {/* APERÇU VISUEL STYLE EMENO */}
          <div className="p-5 bg-primary dark:bg-secondary text-white rounded-[2rem] flex flex-col justify-center text-center relative overflow-hidden shadow-xl shadow-primary/10">
             <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Estimation Client</p>
             <p className="text-3xl font-display font-black italic leading-none tracking-tighter">
              {Number(form.basePrice || 0).toLocaleString()} <span className="text-[10px] font-sans not-italic uppercase tracking-widest ml-1">CFA</span>
             </p>
             <Navigation className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10" />
          </div>
        </div>

        {/* STATUS TOGGLE */}
        <label className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all group">
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.isActive ? 'bg-secondary border-secondary shadow-lg shadow-secondary/30' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600'}`}>
            {form.isActive && <CheckCircle size={14} className="text-white" strokeWidth={3} />}
          </div>
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="hidden" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-widest">Tarif Actif</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">Visible pour les prises de commandes</span>
          </div>
        </label>
      </form>

      {/* FOOTER */}
      <div className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <button 
          type="submit" 
          form="pricing-form"
          disabled={loading || fetchingCommunes} 
          className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Finaliser l'enregistrement"}
        </button>
      </div>
    </div>
  );
}