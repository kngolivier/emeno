// src/components/company-settings/DeliverySettings.jsx

import InputField from "./InputField";

export default function DeliverySettings({ formData, handleChange }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-secondary mb-6 italic">Paramètres de livraison</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Devise par défaut" name="settings.defaultCurrency" value={formData.settings?.defaultCurrency} onChange={handleChange} />
        <InputField label="Rayon de livraison (km)" name="settings.deliveryRadiusKm" type="number" value={formData.settings?.deliveryRadiusKm} onChange={handleChange} />
      </div>
    </div>
  );
}