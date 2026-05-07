// FILE: src/pages/orders/NewOrderForm.jsx
import { useState } from "react";
import { X, ArrowRight, ArrowLeft, MapPin, CreditCard, Loader2 } from "lucide-react";
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
    } catch (err) {
        // L'erreur est gérée dans le parent via notifyError
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50/50 border-2 border-slate-50 rounded-xl p-3 md:p-4 text-sm font-bold text-primary outline-none focus:border-secondary/20 focus:bg-white transition-all";
  const labelClass = "text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1";

  return (
    <div className="bg-white w-full max-w-3xl md:rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col max-h-screen md:max-h-[90vh] overflow-hidden font-sans">
      
      {/* HEADER COMPACT */}
      <div className="p-5 md:p-10 border-b bg-slate-50/50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-primary italic tracking-tight leading-none uppercase">Nouvelle commande</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
                <span className={`h-1 w-4 md:w-6 rounded-full ${step >= 1 ? 'bg-secondary' : 'bg-slate-200'}`} />
                <span className={`h-1 w-4 md:w-6 rounded-full ${step >= 2 ? 'bg-secondary' : 'bg-slate-200'}`} />
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Étape {step} / 2</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-2 md:p-3 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-400"><X size={20} /></button>
      </div>

      <form id="admin-new-order-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 md:p-10 scrollbar-hide">
        {step === 1 && (
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1 text-primary">
                  <div className="p-1.5 bg-primary/5 rounded-lg"><MapPin size={14}/></div>
                  <h3 className="text-[10px] font-black uppercase italic">Expédition</h3>
                </div>
                <div>
                  <label className={labelClass}>Nom Expéditeur</label>
                  <input placeholder="Nom complet" className={inputClass} onChange={(e) => handleNestedChange("pickupContact", "name", e.target.value)} value={formData.pickupContact.name} required />
                </div>
                <PhoneInput label="TÉLÉPHONE" value={formData.pickupContact.phone} onChange={(val) => handleNestedChange("pickupContact", "phone", val)} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1 text-secondary">
                  <div className="p-1.5 bg-secondary/5 rounded-lg"><MapPin size={14}/></div>
                  <h3 className="text-[10px] font-black uppercase italic">Destination</h3>
                </div>
                <div>
                  <label className={labelClass}>Nom Destinataire</label>
                  <input placeholder="Nom complet" className={inputClass} onChange={(e) => handleNestedChange("dropoffContact", "name", e.target.value)} value={formData.dropoffContact.name} required />
                </div>
                <PhoneInput label="TÉLÉPHONE" value={formData.dropoffContact.phone} onChange={(val) => handleNestedChange("dropoffContact", "phone", val)} />
              </div>
            </div>

            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 self-start sm:self-center">
                <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm"><CreditCard className="text-primary" size={18}/></div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Paiement</p>
                    <p className="text-[11px] font-bold text-primary italic">Qui règle la course ?</p>
                </div>
              </div>
              <select name="payerType" value={formData.payerType} onChange={handleChange} className="w-full sm:w-auto bg-white border-none rounded-xl px-4 py-3 text-[10px] font-black text-primary shadow-sm outline-none uppercase tracking-widest">
                <option value="SENDER">L'expéditeur</option>
                <option value="RECEIVER">Le destinataire</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-4">
                <label className={labelClass}>Lieu de ramassage</label>
                <input placeholder="Quartier, repères..." name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className={inputClass} required />
                <CommuneSelect label="COMMUNE" value={formData.pickupCommune} onChange={(val) => handleChange({ target: { name: "pickupCommune", value: val } })} />
              </div>
              <div className="space-y-4">
                <label className={labelClass}>Lieu de livraison</label>
                <input placeholder="Quartier, repères..." name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className={inputClass} required />
                <CommuneSelect label="COMMUNE" value={formData.dropoffCommune} onChange={(val) => handleChange({ target: { name: "dropoffCommune", value: val } })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className={labelClass}>Type de Colis</label>
                <select onChange={(e) => handleNestedChange("packageDetails", "category", e.target.value)} value={formData.packageDetails.category} className={inputClass + " uppercase text-[10px] tracking-widest"}>
                  <option value="FOOD">ALIMENTAIRE</option>
                  <option value="DOCUMENT">DOCUMENT / PLI</option>
                  <option value="ELECTRONICS">ÉLECTRONIQUE</option>
                  <option value="OTHER">AUTRE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Instructions particulières</label>
                <textarea placeholder="Ex: Fragile..." name="notes" value={formData.notes} onChange={handleChange} className={inputClass + " h-[80px] md:h-[100px] py-3 resize-none"} />
              </div>
            </div>
          </div>
        )}
      </form>

      <div className="p-5 md:p-8 bg-white border-t shrink-0">
        {step === 1 ? (
            <button type="button" disabled={!canGoStep2} onClick={() => setStep(2)} className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-secondary disabled:opacity-20 shadow-xl shadow-primary/20 transition-all">
                Suivant <ArrowRight size={16} />
            </button>
        ) : (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <button type="button" onClick={() => setStep(1)} className="order-2 md:order-1 flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[9px] hover:text-primary transition-colors">
                <ArrowLeft size={14} /> Retour
              </button>
              <button form="admin-new-order-form" type="submit" disabled={loading} className="order-1 md:order-2 w-full md:w-auto bg-secondary text-white px-12 py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-secondary/30 hover:scale-[1.02] active:scale-95 transition-all flex justify-center">
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Confirmer la commande"}
              </button>
            </div>
        )}
      </div>
    </div>
  );
}