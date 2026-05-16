// FILE: src/pages/partner-portal/PartnerSettings.jsx

import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { User, Building, Save } from "lucide-react";
import { updateMyProfile } from "../../api/users.api";
import { updatePartner } from "../../api/partners.api";
import PhoneInput from "../../components/forms/PhoneInput";
import PageLoader from "../../components/ui/PageLoader"; // Intégration de ton loader d'application

export default function PartnerSettings() {
  const { currentUser, currentPartner } = useOutletContext();

  const [userForm, setUserForm] = useState({
    nom: currentUser?.nom || "",
    prenom: currentUser?.prenom || "",
    email: currentUser?.email || ""
  });
  const [loadingUser, setLoadingUser] = useState(false);
  const [userSuccess, setUserSuccess] = useState(false);
  const [userError, setUserError] = useState("");

  const [partnerForm, setPartnerForm] = useState({
    name: currentPartner?.name || "",
    telephone: currentPartner?.telephone || "",
    email: currentPartner?.email || "",
    textAddress: currentPartner?.address?.text || ""
  });
  const [loadingPartner, setLoadingPartner] = useState(false);
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [partnerError, setPartnerError] = useState("");

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setLoadingUser(true);
    setUserSuccess(false);
    setUserError("");
    try {
      await updateMyProfile(userForm);
      setUserSuccess(true);
    } catch (err) {
      console.error(err);
      setUserError(err.response?.data?.message || "Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setLoadingUser(false);
    }
  };

  const handlePartnerUpdate = async (e) => {
    e.preventDefault();
    setLoadingPartner(true);
    setPartnerSuccess(false);
    setPartnerError("");
    try {
      await updatePartner(currentPartner._id, {
        name: partnerForm.name,
        telephone: partnerForm.telephone,
        email: partnerForm.email,
        address: {
          ...currentPartner?.address,
          text: partnerForm.textAddress
        }
      });
      setPartnerSuccess(true);
    } catch (err) {
      console.error(err);
      setPartnerError(err.response?.data?.message || "Une erreur est survenue lors de la mise à jour de l'établissement.");
    } finally {
      setLoadingPartner(false);
    }
  };

  // Loader immersif global si l'une des requêtes d'initialisation ou d'attente est active
  if (loadingUser && loadingPartner) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300">
      
      {/* BANNIÈRE ET ENTÊTE */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary dark:text-white italic font-display uppercase tracking-tight">
          Configurations Comptes
        </h1>
        <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
          Données d'identité privées et corporatives EMENO
        </p>
      </div>

      {/* GRILLE DES FORMULAIRES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* FORMULAIRE GÉRANT */}
        <form onSubmit={handleUserUpdate} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-5 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <User size={14} className="text-secondary" /> Profil Personnel (Gérant)
            </h3>
            
            {userSuccess && (
              <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-wider animate-in fade-in duration-200">
                ✓ Coordonnées privées sauvegardées
              </div>
            )}
            {userError && (
              <div className="p-3.5 bg-rose-500/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-wider animate-in fade-in duration-200">
                {userError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Nom</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none focus:border-secondary transition-colors" 
                    value={userForm.nom} 
                    onChange={(e) => setUserForm({...userForm, nom: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Prénom</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none focus:border-secondary transition-colors" 
                    value={userForm.prenom} 
                    onChange={(e) => setUserForm({...userForm, prenom: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Email Privé</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none focus:border-secondary transition-colors" 
                  value={userForm.email} 
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loadingUser} 
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary dark:bg-secondary hover:opacity-90 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-98 disabled:opacity-40 mt-4 shadow-md"
          >
            <Save size={14} /> {loadingUser ? "Enregistrement..." : "Sauvegarder mon profil"}
          </button>
        </form>

        {/* FORMULAIRE ÉTABLISSEMENT */}
        <form onSubmit={handlePartnerUpdate} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-5 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Building size={14} className="text-secondary" /> Identité Globale du Commerce
            </h3>
            
            {partnerSuccess && (
              <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-wider animate-in fade-in duration-200">
                ✓ Fiche établissement mise à jour
              </div>
            )}
            {partnerError && (
              <div className="p-3.5 bg-rose-500/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-wider animate-in fade-in duration-200">
                {partnerError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Nom du Commerce</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none focus:border-secondary transition-colors" 
                  value={partnerForm.name} 
                  onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Ligne Directe Établissement</label>
                <PhoneInput 
                  value={partnerForm.telephone} 
                  onChange={(val) => setPartnerForm({...partnerForm, telephone: val})} 
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Email Générique</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none focus:border-secondary transition-colors" 
                  value={partnerForm.email} 
                  onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5 tracking-wider">Adresse de Repérage Physique</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none focus:border-secondary transition-colors" 
                  value={partnerForm.textAddress} 
                  onChange={(e) => setPartnerForm({...partnerForm, textAddress: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loadingPartner} 
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-98 disabled:opacity-40 mt-4 shadow-md"
          >
            <Save size={14} /> {loadingPartner ? "Enregistrement..." : "Mettre à jour l'établissement"}
          </button>
        </form>

      </div>
    </div>
  );
}