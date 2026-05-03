// FILE: src/pages/client-portal/ClientCreateOrder.jsx

import { useState } from "react";
import { createDelivery } from "../../api/deliveries.api";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

import PhoneInput from "../../components/forms/PhoneInput";
import CommuneSelect from "../../components/forms/CommuneSelect";
import { notifySuccess, notifyError } from "../../utils/notify";

export default function ClientCreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    pickupContact: { name: "", phone: "" },
    dropoffContact: { name: "", phone: "" },

    pickupLocation: "",
    dropoffLocation: "",

    pickupCommune: "",
    dropoffCommune: "",

    payerType: "SENDER",

    packageDetails: {
      category: "OTHER",
      description: "",
      isFragile: false,
      weight: ""
    },

    notes: ""
  });

  // ======================
  // SAFE HANDLERS (LIKE NEWORDERFORM)
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // ======================
  // STEP VALIDATION
  // ======================
  const canGoStep2 =
    form.pickupContact.name?.trim() &&
    form.pickupContact.phone?.trim() &&
    form.dropoffContact.name?.trim() &&
    form.dropoffContact.phone?.trim();

  // ======================
  // CLEAN PAYLOAD (IMPORTANT FIX 500)
  // ======================
  const buildPayload = () => {
    return {
      ...form,
      packageDetails: {
        ...form.packageDetails,
        weight: form.packageDetails.weight
          ? Number(form.packageDetails.weight)
          : undefined
      }
    };
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = buildPayload();

      const res = await createDelivery(payload);

      notifySuccess("Commande créée avec succès");

      navigate(`/client/orders/${res?.data?.data?._id}`);
    } catch (err) {
      notifyError(
        err?.response?.data?.message || "Erreur lors de la création"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // STYLE (aligned NewOrderForm)
  // ======================
  const inputClass =
    "w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none";

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Nouvelle commande
        </h1>
        <p className="text-sm text-slate-500">
          Créez une demande de livraison
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ======================
            STEP 1
        ====================== */}
        {step === 1 && (
          <div className="bg-white p-5 rounded-xl border space-y-6">

            {/* PICKUP */}
            <div>
              <h2 className="font-semibold mb-3">Expéditeur</h2>

              <div className="grid grid-cols-2 gap-3">

                <input
                  placeholder="Nom"
                  className={inputClass}
                  onChange={(e) =>
                    handleNested("pickupContact", "name", e.target.value)
                  }
                />

                <PhoneInput
                  label="Téléphone"
                  value={form.pickupContact.phone}
                  onChange={(val) =>
                    handleNested("pickupContact", "phone", val)
                  }
                />
              </div>
            </div>

            {/* DROPOFF */}
            <div>
              <h2 className="font-semibold mb-3">Destinataire</h2>

              <div className="grid grid-cols-2 gap-3">

                <input
                  placeholder="Nom"
                  className={inputClass}
                  onChange={(e) =>
                    handleNested("dropoffContact", "name", e.target.value)
                  }
                />

                <PhoneInput
                  label="Téléphone"
                  value={form.dropoffContact.phone}
                  onChange={(val) =>
                    handleNested("dropoffContact", "phone", val)
                  }
                />
              </div>
            </div>

            {/* PAYER */}
            <select
              name="payerType"
              onChange={handleChange}
              className={inputClass}
            >
              <option value="SENDER">Expéditeur</option>
              <option value="RECEIVER">Destinataire</option>
            </select>

            {/* NEXT */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={!canGoStep2}
                onClick={() => setStep(2)}
                className="bg-primary text-white px-5 py-2 rounded-xl flex items-center gap-2 disabled:opacity-40"
              >
                Suivant <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================
            STEP 2
        ====================== */}
        {step === 2 && (
          <div className="bg-white p-5 rounded-xl border space-y-5">

            <input
              placeholder="Point de départ"
              name="pickupLocation"
              onChange={handleChange}
              className={inputClass}
            />

            <input
              placeholder="Destination"
              name="dropoffLocation"
              onChange={handleChange}
              className={inputClass}
            />

            <div className="grid grid-cols-2 gap-3">
              <CommuneSelect
                label="Commune départ"
                value={form.pickupCommune}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, pickupCommune: val }))
                }
              />

              <CommuneSelect
                label="Commune arrivée"
                value={form.dropoffCommune}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, dropoffCommune: val }))
                }
              />
            </div>

            <select
              className={inputClass}
              onChange={(e) =>
                handleNested("packageDetails", "category", e.target.value)
              }
            >
              <option value="FOOD">Food</option>
              <option value="MEDICINE">Medicine</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="DOCUMENT">Document</option>
              <option value="OTHER">Other</option>
            </select>

            <textarea
              placeholder="Description du colis"
              className={inputClass}
              onChange={(e) =>
                handleNested("packageDetails", "description", e.target.value)
              }
            />

            <input
              placeholder="Poids (kg)"
              className={inputClass}
              onChange={(e) =>
                handleNested("packageDetails", "weight", e.target.value)
              }
            />

            <textarea
              placeholder="Notes"
              name="notes"
              className={inputClass}
              onChange={handleChange}
            />

            {/* ACTIONS */}
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
                className="bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Créer la commande"
                )}
              </button>
            </div>

          </div>
        )}
      </form>
    </div>
  );
}