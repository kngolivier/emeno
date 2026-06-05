// src/components/company-settings/GeneralSection.jsx

import InputField from "./InputField";

export default function GeneralSection({ formData, handleChange }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-secondary mb-6 italic">Informations Générales</h3>
      <div className="space-y-4">
        <InputField label="Nom de l'entreprise" name="name" value={formData.name} onChange={handleChange} />
        <InputField label="Description courte" name="description" value={formData.description} onChange={handleChange} />
        <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">À propos</label>
            <textarea name="about" value={formData.about || ""} onChange={handleChange} className="w-full h-32 bg-slate-50 dark:bg-[#0B1120] border-2 border-slate-100 dark:border-white/5 rounded-[1.5rem] p-5 text-sm font-bold text-primary dark:text-white outline-none focus:border-secondary/40" />
        </div>
      </div>
    </div>
  );
}