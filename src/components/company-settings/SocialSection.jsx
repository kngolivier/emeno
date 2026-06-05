// src/components/company-settings/SocialSection.jsx

import React from "react";
import InputField from "./InputField";

export default function SocialSection({ formData, handleChange }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-widest text-secondary mb-6 italic">
        Réseaux Sociaux
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField 
          label="Facebook" 
          name="socialMedia.facebook" 
          value={formData.socialMedia?.facebook} 
          onChange={handleChange} 
          placeholder="Lien de votre page Facebook"
        />
        <InputField 
          label="Instagram" 
          name="socialMedia.instagram" 
          value={formData.socialMedia?.instagram} 
          onChange={handleChange} 
          placeholder="Lien de votre compte Instagram"
        />
        <InputField 
          label="Twitter (X)" 
          name="socialMedia.twitter" 
          value={formData.socialMedia?.twitter} 
          onChange={handleChange} 
          placeholder="Lien de votre compte Twitter"
        />
      </div>
    </div>
  );
}