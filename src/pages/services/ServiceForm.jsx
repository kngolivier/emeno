// FILE: src/pages/services/ServiceForm.jsx

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { create, update } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";

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
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          fd.append(key, form[key]);
        }
      });

      if (isEdit) {
        await update(service._id, fd);
        notifySuccess("Service modifié");
      } else {
        await create(fd);
        notifySuccess("Service créé");
      }

      onSuccess();
    } catch (err) {
      notifyError("Erreur sauvegarde service");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-lg space-y-4"
      >
        {/* HEADER */}
        <div className="flex justify-between">
          <h2 className="text-xl font-black">
            {isEdit ? "Modifier service" : "Nouveau service"}
          </h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <input
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <input
          name="type"
          placeholder="Type (STANDARD, EXPRESS...)"
          value={form.type}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <input
          name="whatsappNumber"
          placeholder="WhatsApp"
          value={form.whatsappNumber}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <select
          name="pricingMode"
          value={form.pricingMode}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        >
          <option value="WHATSAPP_ONLY">WhatsApp only</option>
          <option value="BASE_PRICING">Base pricing</option>
        </select>

        <input
          type="number"
          name="pricingIncreasePercent"
          value={form.pricingIncreasePercent}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          placeholder="Augmentation %"
        />

        <input
          type="file"
          onChange={(e) =>
            setForm((p) => ({ ...p, image: e.target.files[0] }))
          }
        />

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold"
          >
            {isEdit ? "Modifier" : "Créer"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border rounded-xl"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}