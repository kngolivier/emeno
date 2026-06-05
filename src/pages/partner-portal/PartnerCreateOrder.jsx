// FILE: src/pages/partner-portal/PartnerCreateOrder.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ShoppingBag, MapPin, DollarSign, Send, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createBulkDeliveries } from "../../api/deliveries.api";
import { fetchCommunes } from "../../api/commune.api";
import { fetchPartnerById } from "../../api/partners.api";
import { calculatePrice } from "../../api/pricing.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader"; // Utilisation de ton loader immersif standardisé
import { getAll as getServices } from "../../api/service.api";
import CompactPhoneInput from "../../components/forms/CompactPhoneInput";

const INITIAL_RECIPIENT = {
  name: "",
  phone: "+241",
  dropoffLocation: "",
  dropoffCommune: "",
  category: "FOOD",
  description: "",
  isFragile: false,
  weight: 1,
  payerType: "RECEIVER",
  estimatedPrice: 0,
};

export default function PartnerCreateOrder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [partnerDetails, setPartnerDetails] = useState(null);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState([{ ...INITIAL_RECIPIENT, id: Date.now() }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    serviceId: ""
  });
  const inputClass =
  "w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none focus:border-secondary transition-colors text-primary dark:text-white";

  useEffect(() => {
    getServices({ activeOnly: true })
      .then(res => {
        const list = res.data?.data || res.data || [];
        setServices(list);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    async function initPage() {
      try {
        setLoading(true);
        const communesRes = await fetchCommunes();
        setCommunes(Array.isArray(communesRes) ? communesRes : communesRes?.data || []);

        const partnerId = user?.partnerId || user?.partner?._id;
        if (partnerId) {
          const partnerRes = await fetchPartnerById(partnerId);
          setPartnerDetails(partnerRes?.data || partnerRes);
        } else {
          console.error("Aucun établissement rattaché à ce compte utilisateur.");
        }
      } catch (err) {
        notifyError("Erreur lors de l'initialisation du tunnel de commande");
      } finally {
        setLoading(false);
      }
    }
    if (user) initPage();
  }, [user]);

  const handleAddRecipient = () => {
    setRecipients([...recipients, { ...INITIAL_RECIPIENT, id: Date.now() }]);
  };

  const handleRemoveRecipient = (id) => {
    if (recipients.length === 1) return;
    setRecipients(recipients.filter((r) => r.id !== id));
  };

  const handleFieldChange = async (id, field, value) => {
    let updatedRecipients = recipients.map((r) => 
      r.id === id ? { ...r, [field]: value } : r
    );
    setRecipients(updatedRecipients);

    if (field === "dropoffCommune") {
      const rawCommune = partnerDetails?.address?.commune;
      const fromCommune = rawCommune?.$oid || (typeof rawCommune === 'object' ? rawCommune._id : rawCommune);
      const toCommune = value;

      if (!fromCommune) {
        notifyError("L'adresse de collecte de votre établissement est manquante pour calculer le prix.");
        return;
      }

      if (!toCommune) {
        setRecipients(prev => prev.map(r => r.id === id ? { ...r, estimatedPrice: 0 } : r));
        return;
      }

      try {
        const res = await calculatePrice(fromCommune, toCommune);
        const priceCalculated = res?.data?.price || res?.data?.amount || res?.price || 0;

        setRecipients(prev => prev.map(r => 
          r.id === id ? { ...r, estimatedPrice: priceCalculated } : r
        ));
      } catch (err) {
        console.error("Erreur de calcul tarifaire EMENO:", err);
        setRecipients(prev => prev.map(r => r.id === id ? { ...r, estimatedPrice: 0 } : r));
        notifyError("Tarif introuvable ou non configuré pour cette commune.");
      }
    }
  };

  const calculateTotalEstimation = () => {
    return recipients.reduce((sum, r) => sum + (r.estimatedPrice || 0), 0);
  };

  const handleSubmitBulk = async (e) => {
    e.preventDefault();
    if (!partnerDetails) {
      notifyError("Impossible d'expédier : aucun établissement valide trouvé.");
      return;
    }

    const hasUnpricedOrder = recipients.some(r => !r.estimatedPrice || r.estimatedPrice <= 0);
    if (hasUnpricedOrder) {
      notifyError("Veuillez sélectionner une commune de livraison valide pour chaque destinataire.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const ordersPayload = recipients.map(target => ({
      name: target.name,
      phone: target.phone,
      dropoffLocation: target.dropoffLocation,
      dropoffCommune: target.dropoffCommune,
      payerType: target.payerType,
      category: target.category,
      description: target.description,
      isFragile: target.isFragile,
      weight: Number(target.weight),
    }));

    try {
      await createBulkDeliveries({
        serviceId: formData.serviceId,
        orders: ordersPayload
      });
      notifySuccess(`Félicitations ! Votre vague commerciale a été lancée avec succès.`);
      navigate("/partner/orders");
    } catch (error) {
      console.error("Erreur d'envoi de la vague groupée:", error);
      notifyError(error?.response?.data?.message || "Une erreur est survenue lors de la création du lot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-2 sm:p-4 md:p-6 lg:p-8 font-sans transition-colors duration-300">
      
      {/* HEADER PRINCIPAL */}
      <header className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary dark:text-white uppercase italic font-display">
            Nouvelles <span className="text-secondary">Livraisons</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1 font-medium">
            Génération instantanée de courses B2C à partir de votre compte gérant.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-3 rounded-2xl shadow-sm">
          <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Structure émettrice</p>
            <p className="text-xs sm:text-sm font-black text-primary dark:text-white">{partnerDetails?.name || "Non rattaché"}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmitBulk} className="space-y-6">
        
        {/* SECTION COLLECTE AUTOMATIQUE */}
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2rem] p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-black tracking-widest uppercase text-[10px]">
            <MapPin size={14} className="text-secondary" />
            <span>Adresse de collecte (Lue depuis l'API)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40">
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider block mb-0.5">Enseigne partenaire</span>
              <span className="text-primary dark:text-white font-black uppercase italic">{partnerDetails?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider block mb-0.5">Contact d'enlèvement</span>
              <span className="font-mono">{partnerDetails?.telephone}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider block mb-0.5">Localisation point A</span>
              <span className="block truncate">{partnerDetails?.address?.text}</span>
            </div>
          </div>
        </section>

        {/* CONTENEUR DE LA BOUCLE DESTINATAIRES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">
              Destinataires clients ({recipients.length})
            </h2>
            <button
              type="button"
              onClick={handleAddRecipient}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-black text-[10px] px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 uppercase tracking-wider"
            >
              <Plus size={12} strokeWidth={3} /> Ajout destinataire
            </button>
          </div>

          <section className="bg-white dark:bg-slate-900 border rounded-2xl p-4">
            <label className="text-[10px] font-black uppercase text-slate-400">
              Service (obligatoire)
            </label>

            <select
              value={formData.serviceId}
              onChange={(e) => {
                const service = services.find(s => s._id === e.target.value);
                setSelectedService(service);

                setFormData(prev => ({
                  ...prev,
                  serviceId: e.target.value
                }));
              }}
              className={inputClass}
              required
            >
              <option value="">-- choisir un service --</option>
              {services.map(s => (
                <option key={s._id} value={s._id}>
                  {s.title}
                </option>
              ))}
            </select>

            {!formData.serviceId && (
              <p className="text-[10px] text-rose-400 mt-2 font-bold">
                Service requis pour continuer
              </p>
            )}
          </section>

          {recipients.map((recipient, index) => (
            <div key={recipient.id} className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-5 sm:p-6 shadow-sm">
              
              {/* Badge d'indexation */}
              <div className="absolute top-4 left-4 w-6 h-6 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700">
                {index + 1}
              </div>

              {recipients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRecipient(recipient.id)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  title="Supprimer ce destinataire"
                >
                  <Trash2 size={15} />
                </button>
              )}

              <div className="pl-0 sm:pl-8 grid grid-cols-1 md:grid-cols-4 gap-6 mt-4 sm:mt-2">
                
                {/* Colonne Contact Client */}
                <div className="space-y-3 md:col-span-2">
                  <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest">Contact Client</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Nom complet"
                      value={recipient.name}
                      onChange={(e) => handleFieldChange(recipient.id, "name", e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none focus:border-secondary transition-colors text-primary dark:text-white w-full"
                    />
                    <CompactPhoneInput 
                      value={recipient.phone} 
                      onChange={(val) => handleFieldChange(recipient.id, "phone", val)} 
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Adresse, Repères de livraison..."
                      value={recipient.dropoffLocation}
                      onChange={(e) => handleFieldChange(recipient.id, "dropoffLocation", e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none focus:border-secondary transition-colors text-primary dark:text-white w-full"
                    />
                    <select
                      required
                      value={recipient.dropoffCommune}
                      onChange={(e) => handleFieldChange(recipient.id, "dropoffCommune", e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none focus:border-secondary transition-colors text-slate-700 dark:text-slate-300 w-full"
                    >
                      <option value="">Commune de livraison</option>
                      {communes.map((c) => (
                        <option key={c._id} value={c._id}>{c.name || c.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Colonne Descriptif Colis */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest">Le Paquet</h4>
                  <select
                    value={recipient.category}
                    onChange={(e) => handleFieldChange(recipient.id, "category", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-3 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 w-full"
                  >
                    <option value="FOOD">Nourriture / Restauration</option>
                    <option value="MEDICINE">Pharmacie / Médicaments</option>
                    <option value="DOCUMENT">Documents / Plis</option>
                    <option value="ELECTRONICS">Électronique</option>
                    <option value="OTHER">Autre</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Contenu précis"
                    value={recipient.description}
                    onChange={(e) => handleFieldChange(recipient.id, "description", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none focus:border-secondary transition-colors text-primary dark:text-white w-full"
                  />
                </div>

                {/* Colonne Facturation & Options */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest">Frais & Options</h4>
                  <select
                    value={recipient.payerType}
                    onChange={(e) => handleFieldChange(recipient.id, "payerType", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl px-3 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 w-full"
                  >
                    <option value="RECEIVER">Payé par le Client (Destinataire)</option>
                    <option value="SENDER">Facturé au Partenaire (Émetteur)</option>
                  </select>
                  
                  <div className="flex items-center justify-between pt-2 gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`fragile-${recipient.id}`}
                        checked={recipient.isFragile}
                        onChange={(e) => handleFieldChange(recipient.id, "isFragile", e.target.checked)}
                        className="w-4 h-4 accent-secondary bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded cursor-pointer"
                      />
                      <label htmlFor={`fragile-${recipient.id}`} className="text-xs text-slate-500 dark:text-slate-400 font-bold cursor-pointer select-none">
                        Fragile
                      </label>
                    </div>

                    <div className="text-right font-black text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-xl">
                      {recipient.estimatedPrice > 0 ? (
                        <span className="text-emerald-500 dark:text-emerald-400 font-black">+{recipient.estimatedPrice.toLocaleString()} FCFA</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 flex items-center gap-1"><AlertCircle size={11}/> -- FCFA</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </section>

        {/* PIED DE PAGE : TOTAL GLOBALE ESTIMATIF */}
        <footer className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Estimation Globale de la vague</p>
              <p className="text-xl font-black text-primary dark:text-white font-mono">
                {calculateTotalEstimation().toLocaleString()} <span className="text-xs font-black text-emerald-500 dark:text-emerald-400">FCFA</span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.serviceId}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary dark:bg-secondary hover:opacity-90 text-white font-black text-xs px-8 py-4 rounded-2xl transition-all shadow-lg active:scale-98 uppercase tracking-widest disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Lancement de la vague...</span>
            ) : (
              <>
                <Send size={12} strokeWidth={2.5} />
                <span>Lancer la vague commerciale</span>
              </>
            )}
          </button>
        </footer>
      </form>
    </div>
  );
}