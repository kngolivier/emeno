// FILE: src/pages/orders/NewOrderForm.jsx

import { useState } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
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
    packageDetails: {
      category: "FOOD",
      description: "",
      isFragile: false,
      weight: ""
    },
    payerType: "SENDER",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  const inputClass = (field) =>
    `w-full border rounded-2xl p-3 text-sm outline-none transition-all font-sans
    ${errors[field]
      ? "border-red-400 focus:ring-2 focus:ring-red-200"
      : "border-slate-200 focus:ring-4 focus:ring-secondary/10 focus:border-secondary"
    }`;

  const labelClass =
    "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block font-sans";

  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const canGoStep2 =
    formData.pickupContact.name &&
    formData.pickupContact.phone &&
    formData.dropoffContact.name &&
    formData.dropoffContact.phone;

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

  return (
    <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center p-8 border-b bg-slate-50/50">
        <div>
          <h2 className="text-2xl font-black text-primary font-display italic tracking-tight">
            Nouvelle commande
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-secondary mt-1">
            Étape {step} sur 2
          </p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-1.5 bg-slate-100">
        <div
          className="h-full bg-secondary transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className={labelClass}>Expéditeur</label>
                <input
                  placeholder="Nom complet"
                  className={inputClass("pickupName")}
                  onChange={(e) => handleNestedChange("pickupContact", "name", e.target.value)}
                />
                <PhoneInput
                  value={formData.pickupContact.phone}
                  onChange={(val) => handleNestedChange("pickupContact", "phone", val)}
                />
              </div>

              <div className="space-y-4">
                <label className={labelClass}>Destinataire</label>
                <input
                  placeholder="Nom complet"
                  className={inputClass("dropoffName")}
                  onChange={(e) => handleNestedChange("dropoffContact", "name", e.target.value)}
                />
                <PhoneInput
                  value={formData.dropoffContact.phone}
                  onChange={(val) => handleNestedChange("dropoffContact", "phone", val)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Responsable du paiement</label>
              <select
                name="payerType"
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-2xl p-4 text-sm font-sans focus:ring-4 focus:ring-secondary/10 outline-none appearance-none bg-slate-50"
              >
                <option value="SENDER">Expéditeur</option>
                <option value="RECEIVER">Destinataire</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={!canGoStep2}
                onClick={() => setStep(2)}
                className="bg-primary text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs transition-all hover:bg-secondary disabled:opacity-20 shadow-lg shadow-primary/10"
              >
                Suivant <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className={labelClass}>Itinéraire</label>
                <input placeholder="Point de départ précis" name="pickupLocation" onChange={handleChange} className={inputClass("pickupLocation")} />
                <CommuneSelect label="Commune départ" value={formData.pickupCommune} onChange={(val) => handleChange({ target: { name: "pickupCommune", value: val } })} />
              </div>
              <div className="space-y-4 pt-[1.75rem]">
                <input placeholder="Destination précise" name="dropoffLocation" onChange={handleChange} className={inputClass("dropoffLocation")} />
                <CommuneSelect label="Commune arrivée" value={formData.dropoffCommune} onChange={(val) => handleChange({ target: { name: "dropoffCommune", value: val } })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className={labelClass}>Détails Colis</label>
                <select
                  onChange={(e) => handleNestedChange("packageDetails", "category", e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-4 text-sm font-sans focus:ring-4 focus:ring-secondary/10 outline-none bg-slate-50"
                >
                  <option value="FOOD">FOOD</option>
                  <option value="MEDICINE">MEDICINE</option>
                  <option value="DOCUMENT">DOCUMENT</option>
                  <option value="ELECTRONICS">ELECTRONICS</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div className="space-y-4 pt-[1.75rem]">
                <textarea placeholder="Description brève..." onChange={(e) => handleNestedChange("packageDetails", "description", e.target.value)} className={inputClass("description")} rows="1" />
              </div>
            </div>

            <textarea placeholder="Notes pour le livreur (étage, code, etc.)" name="notes" onChange={handleChange} className={inputClass("notes")} rows="2" />

            <div className="flex justify-between items-center pt-6">
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-primary transition-colors">
                <ArrowLeft size={16} strokeWidth={3} /> Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-secondary/20 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? "Traitement..." : "Confirmer la commande"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}