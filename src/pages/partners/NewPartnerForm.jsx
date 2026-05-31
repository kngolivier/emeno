// FILE: src/pages/partners/NewPartnerForm.jsx

import React, { useState, useEffect, useRef } from "react";
import { Store, MapPin, Check, X, Phone, Mail, Image as ImageIcon, Upload } from "lucide-react";
import PhoneInput from "../../components/forms/PhoneInput";
import { fetchCommunes } from "../../api/commune.api";
import { useTheme } from "../../context/Theme/ThemeContext";

const DEFAULT_PARTNER_LOGO_LIGHT = "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/logo-dark_rq7yhr";
const DEFAULT_PARTNER_LOGO_DARK = "https://res.cloudinary.com/dzzokuvat/image/upload/q_auto/f_auto/v1778897582/logo_nutvod.png";

export default function NewPartnerForm({ partnerData, onSave, onCancel }) {
  const isEdit = !!partnerData;
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef(null);

  const currentDefaultLogo = isDarkMode ? DEFAULT_PARTNER_LOGO_LIGHT : DEFAULT_PARTNER_LOGO_DARK;

  // États du formulaire
  const [partner, setPartner] = useState({
    name: "",
    email: "",
    telephone: "",
    address: {
      text: "",
      commune: "",
      coordinates: { lat: 0.3924, lng: 9.4537 }
    }
  });

  // États pour la gestion du logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(partnerData?.logo?.url || "");

  const [communes, setCommunes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  useEffect(() => {
    setLoadingCommunes(true);
    fetchCommunes()
      .then((res) => setCommunes(res.data || res))
      .catch(() => setErrors(prev => ({ ...prev, commune: "Impossible de charger les communes" })))
      .finally(() => setLoadingCommunes(false));

    if (isEdit) {
      setPartner({
        name: partnerData.name || "",
        email: partnerData.email || "",
        telephone: partnerData.telephone || "",
        address: {
          text: partnerData.address?.text || "",
          commune: partnerData.address?.commune?._id || partnerData.address?.commune || "",
          coordinates: partnerData.address?.coordinates || { lat: 0.3924, lng: 9.4537 }
        }
      });
      setLogoPreview(partnerData.logo?.url || "");
    }
  }, [partnerData, isEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!partner.name.trim()) newErrors.name = "Nom commercial requis";
    if (!partner.telephone.trim() || partner.telephone === "+241") {
      newErrors.telephone = "Téléphone requis au format +241XXXXXXXX";
    }
    if (!partner.address.text.trim()) newErrors.addressText = "Adresse physique requise";
    if (!partner.address.commune) newErrors.commune = "Veuillez sélectionner une commune";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Construction de la donnée à envoyer
    // Si un nouveau fichier est sélectionné, on utilise FormData
    if (logoFile) {
      const formData = new FormData();
      formData.append("name", partner.name);
      formData.append("email", partner.email);
      formData.append("telephone", partner.telephone);
      formData.append("address[text]", partner.address.text);
      formData.append("address[commune]", partner.address.commune);
      formData.append("address[coordinates][lat]", partner.address.coordinates.lat);
      formData.append("address[coordinates][lng]", partner.address.coordinates.lng);
      formData.append("logo", logoFile);

      onSave(formData);
    } else {
      // Sinon on envoie l'objet classique
      onSave({ ...partner, logoUrl: logoPreview });
    }
  };

  const inputClass = "w-full border-2 border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-4 text-sm md:text-base font-bold outline-none focus:border-secondary/30 dark:focus:border-secondary/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-secondary/5 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:font-normal text-primary dark:text-white";
  const selectClass = "w-full border-2 border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-4 text-sm md:text-base font-bold outline-none focus:border-secondary/30 dark:focus:border-secondary/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-secondary/5 transition-all text-primary dark:text-white appearance-none";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 ml-2 mb-2 flex items-center gap-1";
  const asteriskClass = "text-secondary text-sm";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-50 dark:border-slate-800 overflow-hidden w-full max-w-xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="p-6 md:p-8 bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary dark:bg-white/[0.05] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 dark:shadow-none rotate-3 border border-transparent dark:border-white/10">
            <Store size={22} className="text-white dark:text-secondary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-primary dark:text-white italic font-display leading-none uppercase">
              {isEdit ? "Modifier Partenaire" : "Nouveau Partenaire"}
            </h2>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 text-secondary">
              Espace d'Enregistrement EMENO
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:border-rose-100 dark:hover:border-rose-900/30 transition-all active:scale-90">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 md:space-y-6">
        
        {/* SECTION LOGO AVEC SÉLECTION FICHIER */}
        <div className="p-4 bg-slate-50/60 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center gap-4">
          <div 
            onClick={() => fileInputRef.current.click()} 
            className="relative group w-20 h-20 cursor-pointer"
          >
            <img 
              src={logoPreview || currentDefaultLogo} 
              alt="Preview" 
              className="w-full h-full rounded-2xl object-cover bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-inner"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
              <Upload className="text-white" size={20} />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          <div className="flex-1">
             <label className={labelClass}><ImageIcon size={12} /> Logo Enseigne</label>
             <p className="text-[10px] text-slate-400 ml-2">Cliquez sur l'image pour changer le logo depuis votre appareil.</p>
          </div>
        </div>

        {/* INFO COMMERCIALE */}
        <div className="space-y-1">
          <label className={labelClass}>Nom Commercial <span className={asteriskClass}>*</span></label>
          <input 
            required
            className={`${inputClass} ${errors.name ? "border-rose-100 dark:border-rose-900/50" : ""}`}
            placeholder="Ex: La Fourchette Libreville"
            value={partner.name}
            onChange={e => setPartner({...partner, name: e.target.value})} 
          />
          {errors.name && <p className="text-rose-500 text-[8px] font-black uppercase mt-1 ml-2 italic tracking-widest">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* TÉLÉPHONE */}
          <div className="space-y-1">
            <PhoneInput 
              value={partner.telephone} 
              onChange={(val) => setPartner({...partner, telephone: val})} 
              error={errors.telephone}
            />
            {errors.telephone && <p className="text-rose-500 text-[8px] font-black uppercase mt-1 ml-2 italic tracking-widest">{errors.telephone}</p>}
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <label className={labelClass}>Email Pro (Optionnel)</label>
            <div className="relative">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 hidden md:block" />
              <input 
                type="email"
                className={`${inputClass} md:pl-11`}
                placeholder="contact@commerce.ga"
                value={partner.email}
                onChange={e => setPartner({...partner, email: e.target.value})} 
              />
            </div>
          </div>
        </div>

        {/* IMPLANTATION GEOGRAPHIQUE */}
        <div className="border-t border-dashed border-slate-100 dark:border-slate-800 pt-4 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-secondary italic mb-2">Implantation Locale (Gabon)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SÉLECTEUR DE COMMUNE */}
            <div className="space-y-1 relative">
              <label className={labelClass}>Commune <span className={asteriskClass}>*</span></label>
              <div className="relative">
                <select
                  required
                  className={selectClass}
                  value={partner.address.commune}
                  onChange={e => setPartner({
                    ...partner,
                    address: { ...partner.address, commune: e.target.value }
                  })}
                  disabled={loadingCommunes}
                >
                  <option value="">Sélectionner...</option>
                  {communes.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ▼
                </div>
              </div>
              {errors.commune && <p className="text-rose-500 text-[8px] font-black uppercase mt-1 ml-2 italic tracking-widest">{errors.commune}</p>}
            </div>

            {/* ADRESSE TEXTUELLE */}
            <div className="space-y-1">
              <label className={labelClass}>Adresse précise <span className={asteriskClass}>*</span></label>
              <div className="relative">
                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 hidden md:block" />
                <input 
                  required
                  className={`${inputClass} md:pl-11 font-medium ${errors.addressText ? "border-rose-100 dark:border-rose-900/50" : ""}`}
                  placeholder="Ex: Face à la BICIG, Centre-Ville"
                  value={partner.address.text}
                  onChange={e => setPartner({
                    ...partner,
                    address: { ...partner.address, text: e.target.value }
                  })} 
                />
              </div>
              {errors.addressText && <p className="text-rose-500 text-[8px] font-black uppercase mt-1 ml-2 italic tracking-widest">{errors.addressText}</p>}
            </div>
          </div>
        </div>

        {/* ACTIONS BUTTONS */}
        <div className="flex flex-col gap-3 pt-2">
          <button 
            type="submit"
            className="w-full py-5 bg-primary dark:bg-secondary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl shadow-primary/10 dark:shadow-none hover:bg-secondary dark:hover:bg-secondary/80 active:scale-[0.98] transition-all"
          >
            <Check size={18} strokeWidth={3} /> {isEdit ? "Sauvegarder les modifications" : "Créer le compte partenaire"}
          </button>
        </div>
      </form>
    </div>
  );
}