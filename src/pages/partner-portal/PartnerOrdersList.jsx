// FILE: src/pages/partner-portal/PartnerOrdersList.jsx

import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Layers, PlusCircle, Search, Calendar, Eye, RefreshCw, Package, User, MapPin, DollarSign } from "lucide-react";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import { getCloudinaryUrl } from "../../utils/imageUtils";
import PartnerOrderDetailModal from "./PartnerOrderDetailModal";
import PageLoader from "../../components/ui/PageLoader";
import { STATUS_LABELS } from "../../constants/constants";

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

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-4 sm:space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen p-3 sm:p-4 md:p-6 transition-colors duration-300">
      
      {/* HEADER : COMPACTÉ POUR MOBILE */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {currentPartner?.logo?.url && (
              <img src={getCloudinaryUrl(currentPartner.logo.url, "w_80,h_80,c_fill")} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-800" alt="Logo" />
            )}
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-primary dark:text-white italic font-display uppercase tracking-tight flex items-center gap-1.5">
                <Layers className="text-secondary shrink-0" size={18} /> Expéditions
              </h1>
              <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                {currentPartner?.name}
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/partner/orders/new")} className="flex items-center gap-1.5 px-3 py-2.5 sm:px-5 sm:py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-lg shadow-secondary/20 transition-all text-[10px] sm:text-[11px] font-black uppercase tracking-wider active:scale-95 shrink-0">
            <PlusCircle size={14} /> <span className="hidden sm:inline">Nouvelle</span>
          </button>
        </div>
      </div>

      {/* FILTRES & RECHERCHE : OPTIMISÉS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-3 rounded-2xl shadow-sm space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 pl-9 pr-4 py-2.5 text-xs font-bold rounded-xl text-primary dark:text-white outline-none" />
        </div>

        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex items-center gap-1.5">
            {[ { id: "ALL", label: "Tous" }, { id: "PENDING", label: "Attente" }, { id: "IN_PROGRESS", label: "Cours" }, { id: "COMPLETED", label: "Livrés" } ].map(btn => (
              <button key={btn.id} onClick={() => setStatusFilter(btn.id)} className={`px-3 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${statusFilter === btn.id ? "bg-primary text-white dark:bg-secondary" : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                {btn.label}
              </button>
            ))}
          </div>
          <button onClick={loadOrders} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg hover:text-primary transition-colors shrink-0">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* LISTE DES COMMANDES */}
      {filteredDeliveries.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl py-12 text-center shadow-sm p-4">
          <Package className="mx-auto text-slate-300 dark:text-slate-700 mb-2" size={32} />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucune course trouvée</p>
        </div>
      ) : (
        <>
          {/* MOBILE : CARTES COMPACTES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery._id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-black text-primary dark:text-white block">#{delivery.orderNumber}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(delivery.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${["PENDING", "ASSIGNED"].includes(delivery.status) ? "bg-amber-500/10 text-amber-500" : delivery.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}>
                    {STATUS_LABELS[delivery.status]}
                  </span>
                </div>

                <div className="text-[11px] space-y-1.5 border-t border-slate-50 dark:border-slate-800 pt-2">
                  <div className="flex items-center gap-2 truncate text-slate-600 dark:text-slate-300">
                    <User size={12} className="text-slate-400" /> {delivery.dropoffContact?.name}
                  </div>
                  <div className="flex items-center gap-2 truncate text-slate-500 dark:text-slate-400">
                    <MapPin size={12} className="text-secondary" /> {delivery.dropoffLocation}
                  </div>
                  <div className="font-black text-primary dark:text-white flex items-center gap-2">
                    <DollarSign size={12} className="text-emerald-500" /> {delivery.totalAmount?.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>

                <button onClick={() => setSelectedDelivery(delivery)} className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase rounded-lg active:scale-95 transition-all">
                  Voir détails
                </button>
              </div>
            ))}
          </div>

          {/* DESKTOP : TABLEAU */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                    <th className="py-4 px-6">ID & Date</th>
                    <th className="py-4 px-6">Destinataire</th>
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-6">Statut</th>
                    <th className="py-4 px-6 text-right">Tarif</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDeliveries.map((delivery) => (
                    <tr key={delivery._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                      <td className="py-4 px-6">
                        <div className="text-primary dark:text-white font-black">#{delivery.orderNumber}</div>
                        <div className="text-[10px] text-slate-400">{new Date(delivery.createdAt).toLocaleDateString("fr-FR")}</div>
                      </td>
                      <td className="py-4 px-6 font-bold">{delivery.dropoffContact?.name}</td>
                      <td className="py-4 px-6 max-w-[150px] truncate">{delivery.dropoffLocation}</td>
                      <td className="py-4 px-6">
                         <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${["PENDING", "ASSIGNED"].includes(delivery.status) ? "bg-amber-500/10 text-amber-500" : delivery.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}>
                           {STATUS_LABELS[delivery.status]}
                         </span>
                      </td>
                      <td className="py-4 px-6 text-right font-black">{delivery.totalAmount?.toLocaleString("fr-FR")} FCFA</td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => setSelectedDelivery(delivery)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-primary"><Eye size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedDelivery && <PartnerOrderDetailModal delivery={selectedDelivery} onClose={() => setSelectedDelivery(null)} />}
    </div>
  );
}