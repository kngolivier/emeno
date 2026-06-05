// src/components/company-settings/ContactSection.jsx
import InputField from "./InputField";
import PhoneInput from "../forms/PhoneInput";

export default function ContactSection({ formData, handleChange }) {
  // Helper pour setter le téléphone dans l'objet imbriqué
  const handlePhoneChange = (name, value) => {
    handleChange({ target: { name, value } });
  };

  return (
    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-secondary mb-6 italic">Coordonnées</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Email" name="contact.email" value={formData.contact?.email} onChange={handleChange} />
        <InputField label="Adresse physique" name="contact.address" value={formData.contact?.address} onChange={handleChange} />
        <PhoneInput label="Téléphone principal" value={formData.contact?.phone} onChange={(val) => handlePhoneChange("contact.phone", val)} />
        <PhoneInput label="Numéro WhatsApp" value={formData.contact?.whatsappNumber} onChange={(val) => handlePhoneChange("contact.whatsappNumber", val)} />
      </div>
    </div>
  );
}