// FILE: src/pages/partner-portal/PartnerSettings.jsx

import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { User, Building, Save, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { updateMyProfile } from "../../api/users.api";
import { updatePartner } from "../../api/partners.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import { getCloudinaryUrl } from "../../utils/imageUtils";
import PhoneInput from "../../components/forms/PhoneInput";
import PageLoader from "../../components/ui/PageLoader";

export default function PartnerSettings() {
  const { currentUser, currentPartner } = useOutletContext();

  const [userForm, setUserForm] = useState({
    nom: currentUser?.nom || "",
    prenom: currentUser?.prenom || "",
    email: currentUser?.email || ""
  });
  const [loadingUser, setLoadingUser] = useState(false);

  const [partnerForm, setPartnerForm] = useState({
    name: currentPartner?.name || "",
    telephone: currentPartner?.telephone || "",
    email: currentPartner?.email || "",
    textAddress: currentPartner?.address?.text || "",
    commune: currentPartner?.address?.commune?._id || currentPartner?.address?.commune || "", 
    lat: currentPartner?.address?.coordinates?.lat || 0,
    lng: currentPartner?.address?.coordinates?.lng || 0
  });
  
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [files, setFiles] = useState({ logo: null, coverImage: null });
  const [previews, setPreviews] = useState({ 
    logo: getCloudinaryUrl(currentPartner?.logo?.url), 
    coverImage: getCloudinaryUrl(currentPartner?.coverImage?.url) 
  });
  
  const [loadingPartner, setLoadingPartner] = useState(false);

  useEffect(() => {
    if (currentPartner) {
      setPreviews({
        logo: getCloudinaryUrl(currentPartner.logo?.url),
        coverImage: getCloudinaryUrl(currentPartner.coverImage?.url)
      });
      setPartnerForm({
        name: currentPartner.name || "",
        telephone: currentPartner.telephone || "",
        email: currentPartner.email || "",
        textAddress: currentPartner.address?.text || "",
        commune: currentPartner.address?.commune?._id || currentPartner.address?.commune || "",
        lat: currentPartner.address?.coordinates?.lat || 0,
        lng: currentPartner.address?.coordinates?.lng || 0
      });
    }
  }, [currentPartner]);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [key]: file });
      setPreviews({ ...previews, [key]: URL.createObjectURL(file) });
    }
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setLoadingUser(true);
    try {
      await updateMyProfile(userForm);
      notifySuccess("Profil utilisateur mis à jour !");
    } catch (err) {
      notifyError("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoadingUser(false);
    }
  };

  const handlePartnerUpdate = async (e) => {
    e.preventDefault();
    setLoadingPartner(true);
    try {
      const payload = new FormData();
      payload.append("name", partnerForm.name);
      payload.append("telephone", partnerForm.telephone);
      payload.append("email", partnerForm.email);
      payload.append("address[text]", partnerForm.textAddress);
      payload.append("address[commune]", partnerForm.commune); 
      payload.append("address[coordinates][lat]", partnerForm.lat);
      payload.append("address[coordinates][lng]", partnerForm.lng);
      if (files.logo) payload.append("logo", files.logo);
      if (files.coverImage) payload.append("coverImage", files.coverImage);

      await updatePartner(currentPartner._id, payload);
      notifySuccess("Fiche établissement mise à jour avec succès !");
    } catch (err) {
      notifyError("Erreur lors de la mise à jour de l'établissement.");
    } finally {
      setLoadingPartner(false);
    }
  };

  if (!currentUser || !currentPartner) return <PageLoader />;

  return (
    <div className="space-y-6 sm:space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary dark:text-white italic font-display uppercase tracking-tight">Configurations Comptes</h1>
        <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Données d'identité privées et corporatives EMENO</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* FORMULAIRE GÉRANT */}
        <form onSubmit={handleUserUpdate} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-5 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><User size={14} className="text-secondary" /> Profil Personnel (Gérant)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Nom</label>
              <input required type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none" value={userForm.nom} onChange={(e) => setUserForm({...userForm, nom: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Prénom</label>
              <input required type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none" value={userForm.prenom} onChange={(e) => setUserForm({...userForm, prenom: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={loadingUser} className="w-full flex items-center justify-center gap-2 py-4 bg-primary dark:bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all hover:opacity-90">
            {loadingUser ? <Loader2 className="animate-spin" /> : <><Save size={14} /> Sauvegarder mon profil</>}
          </button>
        </form>

        {/* FORMULAIRE ÉTABLISSEMENT */}
        <form onSubmit={handlePartnerUpdate} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-5 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Building size={14} className="text-secondary" /> Identité Globale du Commerce</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-400">Logo</label>
              <div onClick={() => logoInputRef.current.click()} className="h-24 w-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                {previews.logo ? <img src={previews.logo} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-300"/>}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center"><Upload className="text-white" size={16}/></div>
              </div>
              <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'logo')} className="hidden" accept="image/*" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-400">Couverture</label>
              <div onClick={() => coverInputRef.current.click()} className="h-24 w-full rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                {previews.coverImage ? <img src={previews.coverImage} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-300"/>}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center"><Upload className="text-white" size={16}/></div>
              </div>
              <input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'coverImage')} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Nom du Commerce</label>
              <input required type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none" value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Ligne Directe</label>
              <PhoneInput value={partnerForm.telephone} onChange={(val) => setPartnerForm({...partnerForm, telephone: val})} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Adresse</label>
              <input required type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none" value={partnerForm.textAddress} onChange={(e) => setPartnerForm({...partnerForm, textAddress: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loadingPartner} className="w-full flex items-center justify-center gap-2 py-4 bg-slate-950 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-slate-900">
            {loadingPartner ? <Loader2 className="animate-spin" /> : <><Save size={14} /> Mettre à jour l'établissement</>}
          </button>
        </form>
      </div>
    </div>
  );
}