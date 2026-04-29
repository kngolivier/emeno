// FILE: src/pages/pricing/PricingForm.jsx

import { useState, useEffect } from "react";
import { formatCommune } from "../../utils/formatter";

const COMMUNES = [
  "LIBREVILLE",
  "OWENDO",
  "AKANDA",
  "NTOUM",
  "PORT_GENTIL"
];

const PRICING_TYPES = ["COMMUNE", "DISTANCE"];

export default function PricingForm({ onSave, onCancel, pricing }) {

  const [form, setForm] = useState({
    from: "",
    to: "",
    pricingType: "COMMUNE",
    basePrice: "",
    pricePerKm: "",
    isActive: true
  });

  // ======================
  // EDIT MODE
  // ======================
  useEffect(() => {
    if (pricing) {
      setForm({
        from: pricing.from || "",
        to: pricing.to || "",
        pricingType: pricing.pricingType || "COMMUNE",
        basePrice: pricing.basePrice || "",
        pricePerKm: pricing.pricePerKm || "",
        isActive: pricing.isActive ?? true
      });
    }
  }, [pricing]);

  // ======================
  // HANDLE CHANGE
  // ======================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...form,
      basePrice: Number(form.basePrice),
      pricePerKm: Number(form.pricePerKm)
    });
  };

  return (
    <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {pricing ? "Modifier le tarif" : "Nouveau tarif"}
        </h2>
        <p className="text-sm text-slate-500">
          Configuration des prix de livraison
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* FROM / TO */}
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="text-xs text-slate-500">De</label>
            <select
              name="from"
              value={form.from}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">--</option>
              {COMMUNES.map((c) => (
                <option key={c} value={c}>
                    {formatCommune(c)}
                </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500">Vers</label>
            <select
              name="to"
              value={form.to}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">--</option>
              {COMMUNES.map((c) => (
                <option key={c} value={c}>{formatCommune(c)}</option>
              ))}
            </select>
          </div>

        </div>

        {/* TYPE */}
        <div>
          <label className="text-xs text-slate-500">Type de tarification</label>

          <select
            name="pricingType"
            value={form.pricingType}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {PRICING_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* PRICES */}
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="text-xs text-slate-500">Prix de base</label>
            <input
              type="number"
              name="basePrice"
              value={form.basePrice}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">Prix / Km</label>
            <input
              type="number"
              name="pricePerKm"
              value={form.pricePerKm}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 text-sm"
            />
          </div>

        </div>

        {/* ACTIVE */}
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Actif
        </label>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border text-slate-600"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#002E1B] text-white"
          >
            {pricing ? "Mettre à jour" : "Créer"}
          </button>

        </div>

      </form>

    </div>
  );
}