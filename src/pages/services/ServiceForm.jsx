// FILE: src/pages/services/ServiceForm.jsx

import { useEffect, useState } from "react";
import { X, Check, Image as ImageIcon, Info } from "lucide-react";
import { create, update } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PhoneInput from "../../components/forms/PhoneInput";

const SERVICE_TYPE_LABELS = {
  STANDARD: "Standard (Livraison classique)",
  EXPRESS: "Express (Rapide)",
  PRIVATE: "Privé (Sur mesure)",
  ADMIN: "Administratif",
  CARE: "Assistance / Care",
  BUSINESS: "Entreprise"
};

const PRICING_MODE_LABELS = {
  WHATSAPP_ONLY: "Commande via WhatsApp uniquement",
  BASE_PRICING: "Tarification automatique + WhatsApp"
};

export default function ServiceForm({ service, onClose, onSuccess }) {
  const isEdit = !!service;

  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    whatsappNumber: "",
    pricingMode: "WHATSAPP_ONLY",
    pricingIncreasePercent: 0,
    image: null
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (service) {
      setForm({
        title: service.title || "",
        type: service.type || "",
        description: service.description || "",
        whatsappNumber: service.whatsappNumber || "",
        pricingMode: service.pricingMode || "WHATSAPP_ONLY",
        pricingIncreasePercent: service.pricingIncreasePercent || 0,
        image: null
      });

      setPreview(service.image?.url || null);
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (file) => {
    setForm((p) => ({ ...p, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          fd.append(key, form[key]);
        }
      });

      if (isEdit) {
        await update(service._id, fd);
        notifySuccess("Service mis à jour avec succès");
      } else {
        await create(fd);
        notifySuccess("Service créé avec succès");
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      notifyError("Erreur lors de l’enregistrement du service");
    }
  };

  const inputClass =
    "w-full p-4 rounded-2xl border bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-white/10 text-sm font-semibold outline-none focus:border-secondary transition-all";

  const labelClass =
    "text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 mb-2 block";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-500000 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-primary dark:text-white">
              {isEdit ? "Modifier le service" : "Créer un nouveau service"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configurez un service visible par vos clients
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* IMAGE */}
          <div>
            <label className={labelClass}>
              <ImageIcon size={12} className="inline mr-1" />
              Image du service
            </label>

            <div className="flex items-center gap-4">
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-2xl border"
                />
              )}

              <label className="flex-1 cursor-pointer">
                <div className="p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-center text-sm text-slate-500">
                  Cliquez pour ajouter une image
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImage(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          {/* TITRE */}
          <div>
            <label className={labelClass}>Nom du service</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Livraison Express Libreville"
              className={inputClass}
              required
            />
          </div>

          {/* TYPE + PRICING MODE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type de service</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Sélectionner un type</option>
                {Object.entries(SERVICE_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Mode de commande</label>
              <select
                name="pricingMode"
                value={form.pricingMode}
                onChange={handleChange}
                className={inputClass}
              >
                {Object.entries(PRICING_MODE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Décrivez clairement ce que propose ce service..."
              className={inputClass}
              required
            />
          </div>

          {/* WHATSAPP + PRICING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Numéro WhatsApp</label>
              <PhoneInput
                value={form.whatsappNumber}
                // On passe une fonction qui appelle setForm directement 
                // pour correspondre à la signature de votre PhoneInput
                onChange={(value) => setForm(prev => ({ ...prev, whatsappNumber: value }))}
                placeholder="+241 07 XX XX XX"
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Augmentation tarifaire (%)
              </label>
              <input
                type="number"
                name="pricingIncreasePercent"
                value={form.pricingIncreasePercent}
                onChange={handleChange}
                className={inputClass}
                min={0}
              />
            </div>
          </div>

          {/* INFO BOX */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-xs text-blue-600 dark:text-blue-300 flex gap-2 items-start">
            <Info size={14} />
            <p>
              Ce service sera visible directement par les clients sur
              l’application. Assurez-vous que les informations sont claires et
              professionnelles.
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="p-6 border-t border-slate-100 dark:border-white/10 flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} />
            {isEdit ? "Mettre à jour" : "Créer le service"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-4 border rounded-2xl text-sm font-bold"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}