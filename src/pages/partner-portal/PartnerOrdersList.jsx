// FILE: src/pages/partner-portal/PartnerOrdersList.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { 
  Layers, PlusCircle, Search, Calendar, Eye, RefreshCw, Package, User, MapPin, DollarSign 
} from "lucide-react";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import PartnerOrderDetailModal from "./PartnerOrderDetailModal";
import PageLoader from "../../components/ui/PageLoader"; // Intégration de ton loader d'application

export default function PartnerOrdersList() {
  const { currentPartner } = useOutletContext();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const loadOrders = async () => {
    if (!currentPartner?._id) return;
    setLoading(true);
    try {
      const res = await fetchClientDeliveries({ partnerId: currentPartner._id });
      setDeliveries(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Erreur de rafraîchissement des expéditions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentPartner?._id]);

  // Filtrage combiné : Recherche sécurisée (orderNumber converti en String) + Statut Logistique
  const filteredDeliveries = deliveries.filter(d => {
    const orderNumberStr = d.orderNumber ? String(d.orderNumber).toLowerCase() : "";
    const recipientNameStr = d.dropoffContact?.name ? String(d.dropoffContact.name).toLowerCase() : "";
    const searchStr = search.toLowerCase();

    const matchesSearch = orderNumberStr.includes(searchStr) || recipientNameStr.includes(searchStr);
    
    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "PENDING") return matchesSearch && ["PENDING", "ASSIGNED"].includes(d.status);
    if (statusFilter === "IN_PROGRESS") return matchesSearch && ["PICKED_UP", "IN_PROGRESS"].includes(d.status);
    if (statusFilter === "COMPLETED") return matchesSearch && d.status === "DELIVERED";
    return matchesSearch;
  });

  // Utilisation immédiate de ton PageLoader immersif lors de la synchronisation réseau
  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300">
      
      {/* BANNIÈRE ET ACTION PRINCIPALE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary dark:text-white italic font-display uppercase tracking-tight flex items-center gap-2">
            <Layers className="text-secondary" size={24} /> Carnet d'expéditions
          </h1>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Historique et tracking de vos flux de livraison EMENO
          </p>
        </div>

        <button 
          onClick={() => navigate("/partner/orders/new")}
          className="flex items-center justify-center gap-2 px-5 py-4 bg-secondary hover:bg-secondary/90 text-white rounded-2xl shadow-lg shadow-secondary/20 transition-all text-[11px] font-black uppercase tracking-wider w-full sm:w-auto active:scale-98"
        >
          <PlusCircle size={16} /> Nouvelle Expédition
        </button>
      </div>

      {/* CONTROLES DE RECHERCHE ET BARRE DE FILTRES RESPONSIVE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-3 sm:p-4 rounded-[2rem] shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="w-full xl:max-w-md relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un numéro, un client..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 pl-11 pr-4 py-3.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div className="w-full xl:w-auto flex items-center justify-between sm:justify-end gap-2 overflow-x-auto scrollbar-hide pb-1 xl:pb-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              { id: "ALL", label: "Tous" },
              { id: "PENDING", label: "En attente" },
              { id: "IN_PROGRESS", label: "En cours" },
              { id: "COMPLETED", label: "Livrés" }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setStatusFilter(btn.id)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                  statusFilter === btn.id
                    ? "bg-primary text-white dark:bg-secondary"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button 
            onClick={loadOrders} 
            className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary dark:hover:text-white rounded-xl transition-colors shrink-0"
            title="Actualiser les données"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ZONE DE GRILLE DES ENVOIS */}
      {filteredDeliveries.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] py-16 text-center shadow-sm p-4">
          <Package className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={40} />
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Aucune course ne correspond aux critères</p>
        </div>
      ) : (
        <>
          {/* AFFICHAGE RESPONSIVE MOBILE : CARTES VISUELLES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {filteredDeliveries.map((delivery) => (
              <div 
                key={delivery._id}
                className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xl font-black text-primary dark:text-white italic tracking-tighter block">#{delivery.orderNumber}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                      <Calendar size={10} /> {new Date(delivery.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    ["PENDING", "ASSIGNED"].includes(delivery.status) 
                      ? "bg-amber-500/10 text-amber-500" 
                      : delivery.status === "DELIVERED" 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-blue-500/10 text-blue-500"
                  }`}>
                    {delivery.status}
                  </span>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-50 dark:border-slate-800/50 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <User size={13} className="text-slate-400" />
                    <span className="truncate font-black">{delivery.dropoffContact?.name}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin size={13} className="text-secondary shrink-0 mt-0.5" />
                    <span className="truncate">{delivery.dropoffLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary dark:text-white font-black pt-1">
                    <DollarSign size={13} className="text-emerald-500" />
                    <span>{delivery.totalAmount?.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedDelivery(delivery)}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Eye size={12} /> Voir la fiche course
                </button>
              </div>
            ))}
          </div>

          {/* AFFICHAGE DESKTOP : SCRAN DE TABLE LARGE */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-white/[0.01]">
                    <th className="py-4 px-6">ID & Date</th>
                    <th className="py-4 px-6">Destinataire</th>
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-6">Statut</th>
                    <th className="py-4 px-6 text-right">Tarif</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {filteredDeliveries.map((delivery) => (
                    <tr key={delivery._id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.01] transition-colors group">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-primary dark:text-white font-black">#{delivery.orderNumber}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                          <Calendar size={10} /> {new Date(delivery.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-slate-900 dark:text-slate-200 font-black">{delivery.dropoffContact?.name}</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{delivery.dropoffContact?.phone}</div>
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{delivery.dropoffLocation}</span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          ["PENDING", "ASSIGNED"].includes(delivery.status) 
                            ? "bg-amber-500/10 text-amber-500" 
                            : delivery.status === "DELIVERED" 
                            ? "bg-emerald-500/10 text-emerald-500" 
                            : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-black whitespace-nowrap text-primary dark:text-white">
                        {delivery.totalAmount?.toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedDelivery(delivery)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-secondary dark:hover:text-white rounded-xl transition-all opacity-80 group-hover:opacity-100"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedDelivery && (
        <PartnerOrderDetailModal delivery={selectedDelivery} onClose={() => setSelectedDelivery(null)} />
      )}
    </div>
  );
}