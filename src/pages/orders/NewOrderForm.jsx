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

  // ======================
  // STYLE (align Driver form)
  // ======================
  const inputClass = (field) =>
    `w-full border rounded-xl p-3 text-sm outline-none transition-all
    ${errors[field]
      ? "border-red-400 focus:ring-2 focus:ring-red-200"
      : "border-slate-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
    }`;

  const labelClass =
    "text-xs font-bold uppercase tracking-wider text-primary/70 mb-1 block";

  // ======================
  // UPDATE
  // ======================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  // PHONE HANDLER (FIX +241)
  const handlePhoneChange = (section, value) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 8);
    handleNestedChange(section, "phone", "+241" + cleaned);
  };

  const getPhoneValue = (phone) => phone?.replace("+241", "") || "";

  // ======================
  // VALIDATION STEP 1
  // ======================
  const canGoStep2 =
    formData.pickupContact.name &&
    formData.pickupContact.phone &&
    formData.dropoffContact.name &&
    formData.dropoffContact.phone;

  // ======================
  // SUBMIT
  // ======================
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
    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center p-6 border-b bg-slate-50">
        <div>
          <h2 className="text-xl font-bold text-primary">
            Nouvelle commande
          </h2>
          <p className="text-xs text-slate-500">
            Étape {step}/2
          </p>
        </div>

        <button onClick={onClose}>
          <X />
        </button>
      </div>

      {/* PROGRESS */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">

            <div>
              <label className={labelClass}>Expéditeur</label>

              <div className="grid grid-cols-2 gap-3">

                <input
                  placeholder="Nom"
                  className={inputClass("pickupName")}
                  onChange={(e) => handleNestedChange("pickupContact", "name", e.target.value)}
                />

                <PhoneInput
                  label="Téléphone expéditeur"
                  value={formData.pickupContact.phone}
                  onChange={(val) =>
                    handleNestedChange("pickupContact", "phone", val)
                  }
                />

              </div>
            </div>

            <div>
              <label className={labelClass}>Destinataire</label>

              <div className="grid grid-cols-2 gap-3">

                <input
                  placeholder="Nom"
                  className={inputClass("dropoffName")}
                  onChange={(e) => handleNestedChange("dropoffContact", "name", e.target.value)}
                />

                <PhoneInput
                  label="Téléphone destinataire"
                  value={formData.dropoffContact.phone}
                  onChange={(val) =>
                    handleNestedChange("dropoffContact", "phone", val)
                  }
                />

              </div>
            </div>

            <div>
              <label className={labelClass}>Qui paie</label>
              <select
                name="payerType"
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none"
              >
                <option value="SENDER">Expéditeur</option>
                <option value="RECEIVER">Destinataire</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!canGoStep2}
                onClick={() => setStep(2)}
                className="bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-40"
              >
                Suivant <ArrowRight size={16} />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">

            <input
              placeholder="Point de départ"
              name="pickupLocation"
              onChange={handleChange}
              className={inputClass("pickupLocation")}
            />

            <input
              placeholder="Destination"
              name="dropoffLocation"
              onChange={handleChange}
              className={inputClass("dropoffLocation")}
            />

            <div className="grid grid-cols-2 gap-3">
              <CommuneSelect
                label="Commune départ"
                value={formData.pickupCommune}
                onChange={(val) => handleChange({ target: { name: "pickupCommune", value: val } })}
              />

              <CommuneSelect
                label="Commune arrivée"
                value={formData.dropoffCommune}
                onChange={(val) => handleChange({ target: { name: "dropoffCommune", value: val } })}
              />

            </div>

            <select
              onChange={(e) => handleNestedChange("packageDetails", "category", e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none"
            >
              <option value="FOOD">FOOD</option>
              <option value="MEDICINE">MEDICINE</option>
              <option value="DOCUMENT">DOCUMENT</option>
              <option value="ELECTRONICS">ELECTRONICS</option>
              <option value="OTHER">OTHER</option>
            </select>

            <textarea
              placeholder="Description"
              onChange={(e) => handleNestedChange("packageDetails", "description", e.target.value)}
              className={inputClass("description")}
            />

            <textarea
              placeholder="Notes"
              name="notes"
              onChange={handleChange}
              className={inputClass("notes")}
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-600"
              >
                <ArrowLeft size={16} /> Retour
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-xl disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer la commande"}
              </button>
            </div>

          </div>
        )}

      </form>
    </div>
  );
}
