// FILE: src/pages/orders/NewOrderForm.jsx

import { useEffect, useState } from "react";
import { X, ArrowRight, ArrowLeft, MapPin, CreditCard, Loader2, Package, AlertTriangle } from "lucide-react";
import PhoneInput from "../../components/forms/PhoneInput";
import CommuneSelect from "../../components/forms/CommuneSelect";
import { getAll as getServices  } from "../../api/service.api";


export default function NewOrderForm({ onAdd, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [formData, setFormData] = useState({
    serviceId: "",
    pickupContact: { name: "", phone: "" },
    dropoffContact: { name: "", phone: "" },
    pickupLocation: "",
    dropoffLocation: "",
    pickupCommune: "", 
    dropoffCommune: "", 
    packageDetails: { 
        category: "FOOD", 
        description: "", 
        isFragile: false, 
        weight: "" 
    },
    isForSomeoneElse: true, 
    payerType: "SENDER",
    notes: ""
  });

    useEffect(() => {
      if (!selectedService) return;
  
      setFormData(prev => ({
        ...prev,
  
        packageDetails: {
          ...prev.packageDetails,
          category: selectedService.defaultCategory || prev.packageDetails.category,
          description: selectedService.description || prev.packageDetails.description,
        },
  
        notes: `Service sélectionné: ${selectedService.title}`,
      }));
    }, [selectedService]);
    
    // ======================
    // LOAD SERVICES (fallback)
    // ======================
    useEffect(() => {
      getServices({ activeOnly: true })
        .then(res => {
          const list = res.data?.data || res.data || [];
          const filteredList = list.filter(s => s.pricingMode === 'BASE_PRICING');
          setServices(filteredList);
        })
        .catch(console.error);
    }, []);

    // ======================
    // SERVICE CHANGE MANUAL
    // ======================
    const handleServiceChange = (serviceId) => {
      const service = services.find(s => s._id === serviceId);
      setSelectedService(service);

      setFormData(prev => ({
        ...prev,
        serviceId: serviceId,
        packageDetails: {
          ...prev.packageDetails,
          category: service?.defaultCategory || prev.packageDetails.category,
          description: service?.description || prev.packageDetails.description,
        },
        notes: service ? `Service: ${service.title}` : ""
      }));
    };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCommuneChange = (field, communeId) => {
    setFormData(prev => ({ ...prev, [field]: communeId }));
  };

  const canGoStep2 = formData.pickupContact.name && formData.pickupContact.phone && 
                     formData.dropoffContact.name && formData.dropoffContact.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        packageDetails: {
          ...formData.packageDetails,
          weight: formData.packageDetails.weight ? Number(formData.packageDetails.weight) : 0
        }
      };
      await onAdd(dataToSubmit);
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-primary dark:text-white outline-none focus:border-secondary/20 dark:focus:border-secondary/40 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner";
  const labelClass = "text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 block ml-1";

  return (
    <div className="bg-white dark:bg-slate-900 w-full max-w-3xl md:rounded-[3rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-white/10 flex flex-col max-h-[70vh] md:max-h-[70vh] overflow-hidden font-sans transition-colors">
      
      {/* HEADER */}
      <div className="p-5 md:p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-primary dark:text-white italic tracking-tight leading-none uppercase">Nouvelle commande</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
                <span className={`h-1 w-4 md:w-6 rounded-full transition-all ${step >= 1 ? 'bg-secondary' : 'bg-slate-200 dark:bg-white/10'}`} />
                <span className={`h-1 w-4 md:w-6 rounded-full transition-all ${step >= 2 ? 'bg-secondary' : 'bg-slate-200 dark:bg-white/10'}`} />
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Étape {step} / 2</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-2 md:p-3 hover:bg-white dark:hover:bg-white/5 hover:shadow-md rounded-full transition-all text-slate-400 dark:text-slate-500"><X size={20} /></button>
      </div>

      {/* ================= SERVICE SELECT ================= */}
            <div className="bg-white dark:bg-slate-900 text-primary p-5 dark:bg-primary dark:text-white">
              <label className={labelClass}>Service</label>
                <select
                  className={inputClass}
                  value={formData.serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                >
                  <option value="">-- choisir un service --</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>
            </div>

      <form id="admin-new-order-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 md:p-10 scrollbar-hide dark:bg-slate-900">
        {step === 1 && (
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-5 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-2">
              {/* Expéditeur */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1 text-primary dark:text-white">
                  <div className="p-1.5 bg-primary/5 dark:bg-white/5 rounded-lg"><MapPin size={14}/></div>
                  <h3 className="text-[10px] font-black uppercase italic">Expédition</h3>
                </div>
                <div>
                  <label className={labelClass}>Nom Expéditeur</label>
                  <input placeholder="Nom complet" className={inputClass} onChange={(e) => handleNestedChange("pickupContact", "name", e.target.value)} value={formData.pickupContact.name} required />
                </div>
                <PhoneInput label="TÉLÉPHONE" value={formData.pickupContact.phone} onChange={(val) => handleNestedChange("pickupContact", "phone", val)} />
              </div>

              {/* Destinataire */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1 text-secondary">
                  <div className="p-1.5 bg-secondary/5 dark:bg-secondary/10 rounded-lg"><MapPin size={14}/></div>
                  <h3 className="text-[10px] font-black uppercase italic">Destination</h3>
                </div>
                <div>
                  <label className={labelClass}>Nom Destinataire</label>
                  <input placeholder="Nom complet" className={inputClass} onChange={(e) => handleNestedChange("dropoffContact", "name", e.target.value)} value={formData.dropoffContact.name} required />
                </div>
                <PhoneInput label="TÉLÉPHONE" value={formData.dropoffContact.phone} onChange={(val) => handleNestedChange("dropoffContact", "phone", val)} />
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="bg-slate-50 dark:bg-white/[0.03] p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3 self-start sm:self-center">
                <div className="p-2 md:p-3 bg-white dark:bg-white/5 rounded-xl shadow-sm"><CreditCard className="text-primary dark:text-secondary" size={18}/></div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">Paiement</p>
                    <p className="text-[11px] font-bold text-primary dark:text-white italic">Qui règle la course ?</p>
                </div>
              </div>
              <select name="payerType" value={formData.payerType} onChange={handleChange} className="w-full sm:w-auto bg-white dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-[10px] font-black text-primary dark:text-white shadow-sm outline-none uppercase tracking-widest cursor-pointer">
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
                <label className={labelClass}>Lieu de ramassage (Quartier)</label>
                <input placeholder="Ex: Ancienne Sobraga..." name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className={inputClass} required />
                <CommuneSelect label="Zone de ramassage" value={formData.pickupCommune} onChange={(id) => handleCommuneChange("pickupCommune", id)} />
              </div>

              <div className="space-y-4">
                <label className={labelClass}>Lieu de livraison (Quartier)</label>
                <input placeholder="Ex: Nzeng-Ayong..." name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className={inputClass} required />
                <CommuneSelect label="Zone de livraison" value={formData.dropoffCommune} onChange={(id) => handleCommuneChange("dropoffCommune", id)} />
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 dark:bg-white/[0.02] rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-6">
                <div className="flex items-center gap-2 text-primary dark:text-white border-b border-slate-100 dark:border-white/5 pb-4">
                    <Package size={16}/>
                    <h3 className="text-[10px] font-black uppercase tracking-tighter italic">Propriétés du colis</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClass}>Catégorie</label>
                        <select 
                            onChange={(e) => handleNestedChange("packageDetails", "category", e.target.value)} 
                            value={formData.packageDetails.category} 
                            className={inputClass + " bg-white dark:bg-slate-800 uppercase text-[10px]"}
                        >
                            <option value="FOOD">ALIMENTAIRE</option>
                            <option value="MEDICINE">PHARMACIE</option>
                            <option value="JEWELRY">BIJOUX / VALEUR</option>
                            <option value="DOCUMENT">DOCUMENT / PLI</option>
                            <option value="ELECTRONICS">ÉLECTRONIQUE</option>
                            <option value="OTHER">AUTRE</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Poids (KG)</label>
                        <input 
                            type="number" 
                            step="0.1"
                            placeholder="0.0" 
                            className={inputClass + " bg-white dark:bg-slate-800"}
                            onChange={(e) => handleNestedChange("packageDetails", "weight", e.target.value)} 
                            value={formData.packageDetails.weight} 
                        />
                    </div>

                    <div className="flex flex-col justify-end">
                        <button 
                            type="button"
                            onClick={() => handleNestedChange("packageDetails", "isFragile", !formData.packageDetails.isFragile)}
                            className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 transition-all font-black text-[9px] uppercase tracking-widest ${formData.packageDetails.isFragile ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-600'}`}
                        >
                            <AlertTriangle size={14}/>
                            Fragile
                        </button>
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Notes & Description</label>
                    <textarea 
                        placeholder="Contenu du colis, indications chauffeur..." 
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleChange} 
                        className={inputClass + " bg-white dark:bg-slate-800 h-[100px] py-3 resize-none"} 
                    />
                </div>
            </div>
          </div>
        )}
      </form>

      {/* FOOTER ACTIONS */}
      <div className="p-5 md:p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 shrink-0 transition-colors">
        {step === 1 ? (
            <button 
              type="button" 
              disabled={!canGoStep2} 
              onClick={() => setStep(2)} 
              className="w-full bg-primary dark:bg-secondary text-white py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 disabled:opacity-20 shadow-xl shadow-primary/20 dark:shadow-none transition-all active:scale-[0.98]"
            >
                Suivant <ArrowRight size={16} />
            </button>
        ) : (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="order-2 md:order-1 flex items-center gap-2 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-primary dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={14} /> Retour
              </button>
              <button 
                form="admin-new-order-form" 
                type="submit" 
                disabled={loading} 
                className="order-1 md:order-2 w-full md:w-auto bg-secondary text-white px-12 py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-secondary/30 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Confirmer la commande"}
              </button>
            </div>
        )}
      </div>
    </div>
  );
}