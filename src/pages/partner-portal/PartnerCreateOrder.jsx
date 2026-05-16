// FILE: src/pages/partner-portal/PartnerCreateOrder.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ShoppingBag, MapPin, DollarSign, Send, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createDelivery } from "../../api/deliveries.api";
import { fetchCommunes } from "../../api/communes.api";
import { fetchPartnerById } from "../../api/partners.api";
import { notifySuccess, notifyError } from "../../utils/notify";

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
};

export default function PartnerCreateOrder() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Récupération de l'utilisateur réel connecté
  
  const [partnerDetails, setPartnerDetails] = useState(null);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState([{ ...INITIAL_RECIPIENT, id: Date.now() }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({ current: 0, total: 0 });

  // Chargement des données réelles du partenaire lié et des communes du Gabon
  useEffect(() => {
    async function initPage() {
      try {
        setLoading(true);
        // 1. Récupération des communes pour le sélecteur
        const communesRes = await fetchCommunes();
        setCommunes(Array.isArray(communesRes) ? communesRes : communesRes?.data || []);

        // 2. Récupération de l'établissement rattaché à l'utilisateur connecté
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

  const handleFieldChange = (id, field, value) => {
    setRecipients(
      recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const calculateTotalEstimation = () => {
    return recipients.length * 2500; // Logique de calcul tarifaire d'EMENO
  };

  const handleSubmitBulk = async (e) => {
    e.preventDefault();
    if (!partnerDetails) {
      notifyError("Impossible d'expédier : aucun établissement valide trouvé.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitProgress({ current: 0, total: recipients.length });
    let successCount = 0;

    // Envoi séquentiel asynchrone (Anti-collision doublon)
    for (let i = 0; i < recipients.length; i++) {
      const target = recipients[i];
      
      const payload = {
        pickupContact: {
          name: partnerDetails.name,
          phone: partnerDetails.telephone,
        },
        dropoffContact: {
          name: target.name,
          phone: target.phone,
        },
        pickupLocation: partnerDetails.address?.text || "Adresse de l'établissement",
        dropoffLocation: target.dropoffLocation,
        pickupCommune: partnerDetails.address?.commune, // ID de référence Mongoose de la commune
        dropoffCommune: target.dropoffCommune,
        payerType: target.payerType,
        isForSomeoneElse: true,
        notes: `Commande groupée de l'enseigne ${partnerDetails.name}. ${target.description || ""}`,
        packageDetails: {
          category: target.category,
          description: target.description || "Colis partenaire",
          isFragile: target.isFragile,
          weight: Number(target.weight),
        },
      };

      try {
        await createDelivery(payload);
        successCount++;
        setSubmitProgress((prev) => ({ ...prev, current: i + 1 }));
      } catch (error) {
        console.error(`Erreur d'envoi à la ligne ${i + 1}:`, error);
      }
    }

    setIsSubmitting(false);
    if (successCount === recipients.length) {
      notifySuccess(`Félicitations ! Les ${successCount} courses ont été générées.`);
    } else {
      notifyError(`${successCount}/${recipients.length} commandes créées. Vérifiez la console.`);
    }
    navigate("/partner/orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs font-mono text-slate-400">
        <RefreshCw className="animate-spin text-emerald-400 mr-2" size={16} />
        Synchronisation des données de l'établissement en cours...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
            BULK <span className="text-emerald-400">DISPATCH</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Génération instantanée de courses B2C à partir de votre compte enseigne officiel.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Structure émettrice</p>
            <p className="text-sm font-bold text-white font-mono">{partnerDetails?.name || "Non rattaché"}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmitBulk} className="space-y-6">
        {/* RETRAIT DÉDUIT DE L'API */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[1.5rem] p-5">
          <div className="flex items-center gap-2 mb-4 text-slate-300 font-bold tracking-wide uppercase text-sm font-mono">
            <MapPin size={16} className="text-emerald-400" />
            <span>Adresse de collecte (Lue depuis l'API)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Enseigne partenaire</span>
              <span className="text-white font-bold">{partnerDetails?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Contact d'enlèvement</span>
              <span className="text-slate-200">{partnerDetails?.telephone}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Localisation point A</span>
              <span className="text-slate-200 block truncate">{partnerDetails?.address?.text}</span>
            </div>
          </div>
        </section>

        {/* RECIPIENTS LOOP */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
              Destinataires clients ({recipients.length})
            </h2>
            <button
              type="button"
              onClick={handleAddRecipient}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition duration-200 uppercase font-mono shadow-lg shadow-emerald-500/10"
            >
              <Plus size={14} strokeWidth={3} /> Ajout destinataire
            </button>
          </div>

          {recipients.map((recipient, index) => (
            <div key={recipient.id} className="relative bg-slate-900 border border-slate-800 rounded-[1.5rem] p-5">
              <div className="absolute top-4 left-4 w-6 h-6 bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center rounded-full border border-slate-700">
                {index + 1}
              </div>

              {recipients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRecipient(recipient.id)}
                  className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="pl-8 grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <div className="space-y-3 md:col-span-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wide">Contact Client</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nom complet"
                      value={recipient.name}
                      onChange={(e) => handleFieldChange(recipient.id, "name", e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 transition text-white w-full"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Téléphone"
                      value={recipient.phone}
                      onChange={(e) => handleFieldChange(recipient.id, "phone", e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 transition text-white font-mono w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Adresse, Repères de livraison..."
                      value={recipient.dropoffLocation}
                      onChange={(e) => handleFieldChange(recipient.id, "dropoffLocation", e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 transition text-white w-full"
                    />
                    <select
                      required
                      value={recipient.dropoffCommune}
                      onChange={(e) => handleFieldChange(recipient.id, "dropoffCommune", e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 transition text-slate-300 font-mono w-full"
                    >
                      <option value="">Commune de livraison</option>
                      {communes.map((c) => (
                        <option key={c._id} value={c._id}>{c.name || c.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wide">Le Paquet</h4>
                  <select
                    value={recipient.category}
                    onChange={(e) => handleFieldChange(recipient.id, "category", e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white w-full"
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
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50 transition text-white w-full"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wide">Frais de port</h4>
                  <select
                    value={recipient.payerType}
                    onChange={(e) => handleFieldChange(recipient.id, "payerType", e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono w-full"
                  >
                    <option value="RECEIVER">Payé par le Client (Destinataire)</option>
                    <option value="SENDER">Facturé au Partenaire (Émetteur)</option>
                  </select>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`fragile-${recipient.id}`}
                      checked={recipient.isFragile}
                      onChange={(e) => handleFieldChange(recipient.id, "isFragile", e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 bg-slate-950 border-slate-800 rounded"
                    />
                    <label htmlFor={`fragile-${recipient.id}`} className="text-xs text-slate-400 font-medium cursor-pointer select-none">
                      Contenu fragile
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* BOTTOM ACCUEIL DE PRIX RÉEL */}
        <footer className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl"><DollarSign size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase">Estimation Globale de la vague</p>
              <p className="text-xl font-black text-white font-mono">
                {calculateTotalEstimation().toLocaleString()} <span className="text-xs text-emerald-400">FCFA</span>
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-8 py-3.5 rounded-xl transition duration-200 uppercase font-mono shadow-xl shadow-emerald-500/10 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Envoi en cours ({submitProgress.current}/{submitProgress.total})...</span>
            ) : (
              <>
                <Send size={14} strokeWidth={2.5} />
                <span>Lancer la vague commerciale</span>
              </>
            )}
          </button>
        </footer>
      </form>
    </div>
  );
}