import React, { useState, useEffect } from "react";
import { useSettings } from "../../context/Settings/SettingsContext";
import { updateCompanySettings } from "../../api/companySettings.api";
import { toast } from "react-hot-toast";

// Import des composants modulaires
import PageLoader from "../../components/ui/PageLoader";
import GeneralSection from "../../components/company-settings/GeneralSection";
import ContactSection from "../../components/company-settings/ContactSection";
import DeliverySettings from "../../components/company-settings/DeliverySettings";
import SocialSection from "../../components/company-settings/SocialSection"; // À créer sur le même modèle

export default function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialisation du formulaire
  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const keys = name.split(".");
      if (keys.length === 2) {
        return { 
          ...prev, 
          [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } 
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateCompanySettings(formData);
      updateSettings(updated); // Mise à jour du contexte global
      toast.success("Paramètres mis à jour avec succès !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour des paramètres");
    } finally {
      setIsSaving(false);
    }
  };

  // Affichage du loader pendant le chargement initial ou si les données ne sont pas encore là
  if (loading || !formData) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-primary dark:text-white">
          Configuration
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
          Gestion des paramètres globaux de EMENO
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <GeneralSection formData={formData} handleChange={handleChange} />
        <ContactSection formData={formData} handleChange={handleChange} />
        <SocialSection formData={formData} handleChange={handleChange} />
        <DeliverySettings formData={formData} handleChange={handleChange} />

        {/* Bouton de sauvegarde fixe ou en bas de page */}
        <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-2xl font-black uppercase transition-all shadow-xl shadow-secondary/20 active:scale-95"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}