// FILE: src/pages/orders/NewOrderForm.jsx
import { useState } from "react";
import { X, ArrowRight, ArrowLeft, Package, MapPin, CreditCard, Info, Loader2 } from "lucide-react";
import PhoneInput from "../../components/forms/PhoneInput";
import CommuneSelect from "../../components/forms/CommuneSelect";

export default function NewOrderForm({ onAdd, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    pickupContact: { name: "", phone: "" },
    dropoffContact: { name: "", phone: "" },
    pickupLocation: "",
    dropoffLocation: "",
    pickupCommune: "",
    dropoffCommune: "",
    packageDetails: { category: "FOOD", description: "", isFragile: false, weight: "" },
    payerType: "SENDER",
    notes: ""
  });

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canGoStep2 = formData.pickupContact.name && formData.pickupContact.phone && formData.dropoffContact.name && formData.dropoffContact.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(formData);
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-primary outline-none focus:border-secondary/20 focus:bg-white transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2";

  return (
    <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden font-sans">
      <div className="p-8 md:p-10 border-b bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-primary italic tracking-tight leading-none">Nouvelle commande</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`h-1.5 w-6 rounded-full ${step >= 1 ? 'bg-secondary' : 'bg-slate-200'}`} />
            <span className={`h-1.5 w-6 rounded-full ${step >= 2 ? 'bg-secondary' : 'bg-slate-200'}`} />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Étape {step} / 2</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-md rounded-full transition-all"><X size={20} /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <div className="p-2 bg-primary/5 rounded-lg"><MapPin size={16}/></div>
                  <h3 className="text-xs font-black uppercase italic">Point de départ</h3>
                </div>
                <div>
                  <label className={labelClass}>Nom Expéditeur</label>
                  <input placeholder="Ex: Jean Mvone" className={inputClass} onChange={(e) => handleNestedChange("pickupContact", "name", e.target.value)} value={formData.pickupContact.name} />
                </div>
                <PhoneInput label="TÉLÉPHONE" value={formData.pickupContact.phone} onChange={(val) => handleNestedChange("pickupContact", "phone", val)} />
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <div className="p-2 bg-secondary/5 rounded-lg"><MapPin size={16}/></div>
                  <h3 className="text-xs font-black uppercase italic">Point d'arrivée</h3>
                </div>
                <div>
                  <label className={labelClass}>Nom Destinataire</label>
                  <input placeholder="Ex: Marie-Laure" className={inputClass} onChange={(e) => handleNestedChange("dropoffContact", "name", e.target.value)} value={formData.dropoffContact.name} />
                </div>
                <PhoneInput label="TÉLÉPHONE" value={formData.dropoffContact.phone} onChange={(val) => handleNestedChange("dropoffContact", "phone", val)} />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl shadow-sm"><CreditCard className="text-primary" size={20}/></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frais de livraison</p>
                    <p className="text-xs font-bold text-primary italic">Qui règle la course ?</p>
                </div>
              </div>
              <select name="payerType" value={formData.payerType} onChange={handleChange} className="bg-white border-none rounded-xl px-4 py-3 text-xs font-black text-primary shadow-sm outline-none">
                <option value="SENDER">L'expéditeur</option>
                <option value="RECEIVER">Le destinataire</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button type="button" disabled={!canGoStep2} onClick={() => setStep(2)} className="w-full md:w-auto bg-primary text-white px-10 py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-secondary disabled:opacity-20 shadow-xl shadow-primary/20 transition-all">
                Suivant <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <label className={labelClass}>Itinéraire Précis</label>
                <input placeholder="Ex: Derrière le marché de Nzeng" name="pickupLocation" onChange={handleChange} className={inputClass} />
                <CommuneSelect label="COMMUNE DE DÉPART" value={formData.pickupCommune} onChange={(val) => handleChange({ target: { name: "pickupCommune", value: val } })} />
              </div>
              <div className="space-y-5 pt-7">
                <input placeholder="Ex: Immeuble face pharmacie" name="dropoffLocation" onChange={handleChange} className={inputClass} />
                <CommuneSelect label="COMMUNE D'ARRIVÉE" value={formData.dropoffCommune} onChange={(val) => handleChange({ target: { name: "dropoffCommune", value: val } })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <label className={labelClass}>Type de Colis</label>
                <select onChange={(e) => handleNestedChange("packageDetails", "category", e.target.value)} className={inputClass}>
                  <option value="FOOD">ALIMENTAIRE</option>
                  <option value="DOCUMENT">DOCUMENT / PLI</option>
                  <option value="ELECTRONICS">ÉLECTRONIQUE</option>
                  <option value="OTHER">AUTRE</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className={labelClass}>Description & Notes</label>
                <textarea placeholder="Contenu du colis et instructions..." name="notes" onChange={handleChange} className={inputClass + " h-[100px] py-3 resize-none"} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Retour aux contacts
              </button>
              <button type="submit" disabled={loading} className="w-full md:w-auto bg-secondary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-secondary/30 hover:scale-[1.02] active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : "Confirmer la commande"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}