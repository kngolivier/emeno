// FILE: src/pages/partner-portal/PartnerDashboard.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { ShoppingBag, TrendingUp, Activity, ArrowUpRight, Truck, Eye, Store } from "lucide-react";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import { updatePartner } from "../../api/partners.api"; 
import PartnerOrderDetailModal from "./PartnerOrderDetailModal"; 
import PageLoader from "../../components/ui/PageLoader"; // Intégration du composant d'attente animé d'EMENO

export default function PartnerDashboard() {
  const { currentPartner } = useOutletContext();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Utilisation d'un drapeau de disponibilité plutôt que le statut d'activation global du compte
  const [isStoreOpen, setIsStoreOpen] = useState(currentPartner?.isOnline ?? currentPartner?.status === "ACTIVE");
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!currentPartner?._id) return;
      
      setLoading(true);
      try {
        // Transmission explicite du scope du partenaire pour éviter le rejet d'autorité globale
        const res = await fetchClientDeliveries({ 
          partnerId: currentPartner._id, 
          limit: 5 
        });
        setDeliveries(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Erreur de récupération des données analytiques", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, [currentPartner?._id]);

  const toggleStoreStatus = async () => {
    if (!currentPartner?._id) return;

    const nextState = !isStoreOpen;
    setIsStoreOpen(nextState);
    
    try {
      // Sécurité : On passe par updatePartner (route PUT autorisée au manager) 
      // pour piloter un état d'ouverture sans forcer le statut système global (ACTIVE/SUSPENDED)
      await updatePartner(currentPartner._id, {
        isOnline: nextState
      });
    } catch (err) {
      console.error("Erreur lors de la modification du statut de disponibilité", err);
      setIsStoreOpen(!nextState); // Rollback immédiat de l'UI en cas d'échec
    }
  };

  // Calculs financiers basés sur les données reçues
  const revenue = deliveries.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const activeCount = deliveries.filter(d => ["PENDING", "ASSIGNED", "PICKED_UP", "IN_PROGRESS"].includes(d.status)).length;

  // Intercepter l'état de chargement initial avec l'expérience visuelle immersive PageLoader
  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300">
      
      {/* SECTION BANNIÈRE D'ENTÊTE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary dark:text-white italic font-display uppercase tracking-tight">
            {currentPartner?.name || "Mon Établissement"}
          </h1>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Tableau de Bord Opérationnel EMENO
          </p>
        </div>

        {/* INTERRUPTEUR DE FLUX BOUTIQUE */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Store size={16} className={isStoreOpen ? "text-emerald-500" : "text-rose-500"} />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Flux d'accueil :</span>
            <span className={`text-xs font-black uppercase ${isStoreOpen ? "text-emerald-500" : "text-rose-500"}`}>
              {isStoreOpen ? "Ouvert" : "Fermé"}
            </span>
          </div>
          <button
            onClick={toggleStoreStatus}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto text-center ${
              isStoreOpen 
                ? "bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white" 
                : "bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white"
            }`}
          >
            {isStoreOpen ? "Passer Hors Ligne" : "Passer En Ligne"}
          </button>
        </div>
      </div>

      {/* METRICS REALTIME GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 sm:p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-primary dark:text-white"><ShoppingBag size={20} /></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 flex items-center gap-0.5">Live <Activity size={10} className="text-emerald-500 animate-pulse" /></span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-primary dark:text-white italic tracking-tight font-display">{activeCount}</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">En cours de préparation / Livraison</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 sm:p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-emerald-500"><TrendingUp size={20} /></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Volume</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-primary dark:text-white italic tracking-tight font-display">{revenue.toLocaleString("fr-FR")} FCFA</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Volume d'affaires enregistré</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 sm:p-6 rounded-[2rem] shadow-sm relative overflow-hidden sm:col-span-2 md:col-span-1">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-secondary"><Truck size={20} /></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-primary dark:text-white italic tracking-tight font-display">{deliveries.length}</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Expéditions globales du compte</p>
          </div>
        </div>
      </div>

      {/* CORE DISPLAY : RUNNING DELIVERIES & LOGISTICS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-primary dark:text-white flex items-center gap-2">
            <Truck size={16} className="text-secondary" /> Suivi Logistique Temps-Réel
          </h3>
          <button 
            onClick={() => navigate("/partner/orders")} 
            className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary dark:hover:text-white flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            Ouvrir la console d'envoi <ArrowUpRight size={12} />
          </button>
        </div>

        {deliveries.length === 0 ? (
          <div className="py-12 text-center text-xs font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest">
            Aucune activité logistique détectée
          </div>
        ) : (
          <div className="space-y-3">
            {deliveries.map((delivery) => (
              <div 
                key={delivery._id} 
                className="p-4 bg-slate-50/50 dark:bg-white/[0.01] border border-slate-100 dark:border-slate-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-primary dark:text-white">ID #{delivery.orderNumber}</span>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      ["PENDING", "ASSIGNED"].includes(delivery.status) ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                    }`}>{delivery.status}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    Destinataire : <strong className="text-slate-700 dark:text-slate-200">{delivery.dropoffContact?.name}</strong> • {delivery.dropoffLocation}
                  </p>
                </div>
                <div className="flex items-center justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                  <button 
                    onClick={() => setSelectedDelivery(delivery)}
                    className="w-full sm:w-auto p-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                  >
                    <Eye size={12} /> Fiche Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALE DE DETAIL POUR ACTIONNER LE RENVOI SMS */}
      {selectedDelivery && (
        <PartnerOrderDetailModal delivery={selectedDelivery} onClose={() => setSelectedDelivery(null)} />
      )}
    </div>
  );
}