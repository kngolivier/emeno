// FILE: src/pages/partners/PartnerDetails.jsx

import React, { useState, useEffect } from "react";
import { X, Calendar, MapPin, Phone, Mail, Building, UserPlus, ShieldCheck, User, RefreshCw } from "lucide-react";
import { useTheme } from "../../context/Theme/ThemeContext";
import { createPartnerManager, fetchUsers } from "../../api/users.api";
import PhoneInput from "../../components/forms/PhoneInput"; // Ajuste le chemin selon ton arborescence standard

const DEFAULT_PARTNER_LOGO_LIGHT = "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/logo-dark_rq7yhr";
const DEFAULT_PARTNER_LOGO_DARK = "https://res.cloudinary.com/dzzokuvat/image/upload/q_auto/f_auto/v1778897582/logo_nutvod.png";

export default function PartnerDetails({ partner, onClose }) {
  const { isDarkMode } = useTheme();
  
  // États pour la gestion des managers
  const [managers, setManagers] = useState([]);
  const [fetchingManagers, setFetchingManagers] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [managerForm, setManagerForm] = useState({ nom: "", prenom: "", telephone: "", email: "" });
  const [loadingManager, setLoadingManager] = useState(false);
  const [managerError, setManagerError] = useState(null);

  if (!partner) return null;

  const currentDefaultLogo = isDarkMode ? DEFAULT_PARTNER_LOGO_LIGHT : DEFAULT_PARTNER_LOGO_DARK;
  const partnerLogoUrl = partner.logo?.url || currentDefaultLogo;

  // Récupération dynamique des managers rattachés à ce partenaire
  const loadPartnerManagers = async () => {
    setFetchingManagers(true);
    try {
      // On filtre par rôle et idéalement ton API gère le filtrage par attributs via les params globaux
      const res = await fetchUsers({ role: "PARTNER_MANAGER", limit: 50 });
      const allUsers = res.data?.data || res.data || [];
      
      // Filtrage local basé sur le partnerId pour sécuriser l'affichage
      const filtered = allUsers.filter(user => user.partnerId === partner._id);
      setManagers(filtered);
    } catch (err) {
      console.error("Erreur récupération managers:", err);
    } finally {
      setFetchingManagers(false);
    }
  };

  useEffect(() => {
    loadPartnerManagers();
  }, [partner._id]);

  // Soumission du formulaire manager
  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    setLoadingManager(true);
    setManagerError(null);

    try {
      const payload = {
        ...managerForm,
        partnerId: partner._id
      };
      await createPartnerManager(payload);
      
      // Réinitialisation & rechargement complet depuis le serveur
      setManagerForm({ nom: "", prenom: "", telephone: "", email: "" });
      setShowManagerForm(false);
      await loadPartnerManagers();
    } catch (err) {
      setManagerError(err.response?.data?.message || err.message || "Erreur lors de la création");
    } finally {
      setLoadingManager(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-50 dark:border-slate-800 overflow-hidden w-full max-w-lg mx-auto animate-in scale-in duration-300 relative group">
      
      {/* FILIGRANE ARRIÈRE-PLAN */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center select-none">
        <img 
          src={partnerLogoUrl} 
          alt="" 
          onError={(e) => { e.target.src = currentDefaultLogo; }}
          className="w-80 h-80 object-cover opacity-[0.04] dark:opacity-[0.025] scale-150 rounded-full blur-[2px] filter grayscale dark:invert-0 transition-transform duration-700 group-hover:scale-[1.6]"
        />
      </div>

      {/* CONTENU RELATIF ET AU-DESSUS (Z-10) */}
      <div className="relative z-10 max-h-[85vh] overflow-y-auto scrollbar-hide">
        
        {/* GLAM HEADER */}
        <div className="relative h-32 bg-gradient-to-r from-primary to-slate-900 p-6 flex items-end justify-between">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all active:scale-90 z-20"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-4 translate-y-10 z-10">
            <img 
              src={partnerLogoUrl} 
              alt={partner.name} 
              onError={(e) => { e.target.src = currentDefaultLogo; }}
              className="w-20 h-20 rounded-[1.5rem] object-cover bg-white dark:bg-slate-800 p-1 border-2 border-slate-100 dark:border-slate-800 shadow-xl"
            />
          </div>
        </div>

        {/* CORE DETAILS BOX */}
        <div className="p-6 md:p-8 pt-14 space-y-6">
          <div>
            <span className={`inline-block text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-1 ${
              partner.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            }`}>
              Compte {partner.status === 'ACTIVE' ? 'Actif' : 'Suspendu'}
            </span>
            <h2 className="text-2xl font-black text-primary dark:text-white italic font-display uppercase tracking-tight">{partner.name}</h2>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Établissement Enregistré EMENO</p>
          </div>

          {/* METADATA GRID */}
          <div className="space-y-4 border-t border-b border-slate-50 dark:border-slate-800/80 py-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800/80 text-slate-400 rounded-xl flex items-center justify-center shadow-sm">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-300 dark:text-slate-600">Téléphone Principal</p>
                <p className="text-sm font-black text-primary dark:text-white">{partner.telephone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800/80 text-slate-400 rounded-xl flex items-center justify-center shadow-sm">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-300 dark:text-slate-600">Contact Email</p>
                <p className="text-sm font-bold text-primary dark:text-white truncate max-w-[240px]">{partner.email || "Non renseigné"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800/80 text-slate-400 rounded-xl flex items-center justify-center shadow-sm">
                <Building size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-300 dark:text-slate-600">Commune d'Implantation</p>
                <p className="text-sm font-bold text-primary dark:text-white">{partner.address?.commune?.name || "Libreville"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800/80 text-slate-400 rounded-xl flex items-center justify-center shadow-sm">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-300 dark:text-slate-600">Repérage Physique</p>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{partner.address?.text}</p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION DÉDIÉE : PARTNER_MANAGER (LISTE & AJOUT UNIQUE)   */}
          {/* ========================================================= */}
          <div className="pt-2 border-b border-slate-50 dark:border-slate-800/80 pb-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User size={14} className="text-secondary" /> Gestionnaires ({managers.length})
              </h4>
              {fetchingManagers && <RefreshCw size={12} className="animate-spin text-slate-400" />}
            </div>

            {/* Liste des gérants extraits depuis le serveur */}
            {managers.length > 0 && (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {managers.map((m) => (
                  <div key={m._id} className="bg-slate-50/50 dark:bg-white/[0.01] border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl flex items-center justify-between animate-in fade-in duration-200">
                    <div>
                      <p className="text-sm font-black text-primary dark:text-white">{m.nom} {m.prenom}</p>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{m.telephone}</p>
                      {m.email && <p className="text-[10px] text-slate-400/80 font-semibold">{m.email}</p>}
                    </div>
                    <div className="flex items-center gap-1 text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <ShieldCheck size={10} /> Actif
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Le bouton d'ajout reste actif/disponible même si la liste contient des éléments */}
            {!showManagerForm ? (
              <button
                onClick={() => setShowManagerForm(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-primary dark:hover:bg-secondary text-slate-400 hover:text-white rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest transition-all group/btn"
              >
                <UserPlus size={14} className="group-hover/btn:scale-110 transition-transform" /> 
                Associer un {managers.length > 0 ? "autre" : "nouveau"} gérant
              </button>
            ) : (
              /* Formulaire Inline de création */
              <form onSubmit={handleManagerSubmit} className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {managerError && (
                  <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-[9px] font-black uppercase">
                    ⚠️ {managerError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      required
                      type="text"
                      placeholder="Nom"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 text-xs font-bold rounded-xl outline-none text-primary dark:text-white"
                      value={managerForm.nom}
                      onChange={(e) => setManagerForm({ ...managerForm, nom: e.target.value })}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Prénom"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 text-xs font-bold rounded-xl outline-none text-primary dark:text-white"
                      value={managerForm.prenom}
                      onChange={(e) => setManagerForm({ ...managerForm, prenom: e.target.value })}
                    />
                  </div>

                  {/* Remplacement par ton PhoneInput EMENO personnalisé */}
                  <div className="text-left">
                    <PhoneInput
                      value={managerForm.telephone}
                      onChange={(val) => setManagerForm({ ...managerForm, telephone: val })}
                      placeholder="Numéro de téléphone"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email professionnel (Optionnel)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 text-xs font-bold rounded-xl outline-none text-primary dark:text-white"
                    value={managerForm.email}
                    onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowManagerForm(false)}
                    className="flex-1 py-2.5 bg-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loadingManager}
                    className="flex-1 py-2.5 bg-primary dark:bg-secondary text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                  >
                    {loadingManager ? "Génération..." : "Confirmer"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* REPERAGE SATELLITE INFO */}
          <div className="flex justify-between items-center bg-slate-50/30 dark:bg-white/[0.01] p-4 rounded-2xl border border-slate-100/60 dark:border-slate-800/40 text-xs font-bold text-slate-400 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Membre depuis :</span>
            </div>
            <span className="text-primary dark:text-white font-bold">
              {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long' }) : "Récemment"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}