// FILE: src/pages/orders/OrdersList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, MapPin, User, PackageOpen, SearchX } from "lucide-react";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { Pagination } from "../../components/Pagination";
import { fetchAdminDeliveries, createDelivery } from "../../api/deliveries.api";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashboard/TotalCard";
import NewOrderForm from "./NewOrderForm";
import { notifySuccess, notifyError } from "../../utils/notify";

export default function OrdersList() {
  const [showForm, setShowForm] = useState(false);
  
  const { data: orders = [], meta, loading, setPage, setStatus, status, refresh } = usePaginatedFetch(fetchAdminDeliveries, 10);

  const statusTranslations = {
    PENDING: "Créée",
    ASSIGNED: "Assignée",
    PICKED_UP: "Récupérée",
    IN_PROGRESS: "En cours",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  const statusStyles = {
    PENDING: "bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary/90 dark:border-primary/30",
    ASSIGNED: "bg-secondary/10 text-secondary border-secondary/20",
    PICKED_UP: "bg-secondary/5 text-secondary border-secondary/10",
    IN_PROGRESS: "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-200 dark:bg-rose-500/5 dark:text-rose-400 dark:border-rose-500/20",
  };

  const handleCreateOrder = async (data) => {
    try {
      await createDelivery(data);
      notifySuccess("Commande créée avec succès");
      setShowForm(false);
      refresh();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const formatLocation = (order) => {
    const loc = order.pricingSnapshot?.to || order.dropoffLocation;
    if (typeof loc === 'string' && loc.includes("name:")) {
      const match = loc.match(/name:\s*'([^']+)'/);
      return match ? match[1] : loc;
    }
    return loc || "Gabon";
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 font-sans pb-10 transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary dark:text-white font-display italic tracking-tighter uppercase leading-none">
            Livraisons
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">
            Flux opérationnel • Temps réel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <TotalCard title="Volume" value={meta?.total || 0} subtitle="Commandes" />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary dark:bg-secondary text-white hover:opacity-90 transition-all shadow-xl shadow-primary/20 dark:shadow-none text-[10px] font-black uppercase tracking-widest active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            Nouvelle Commande
          </button>
        </div>
      </div>

      {/* STATUS FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95
              ${status === s 
                ? "bg-primary text-white border-primary shadow-lg dark:bg-secondary dark:border-secondary" 
                : "bg-white text-slate-400 border-slate-100 hover:border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:text-white"}`}
          >
            {s === "ALL" ? "Tous" : statusTranslations[s]}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      {!loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 rotate-3">
            {status === "ALL" ? <PackageOpen size={40} strokeWidth={1.5} /> : <SearchX size={40} strokeWidth={1.5} />}
          </div>
          <h3 className="text-xl font-display font-black text-primary dark:text-white italic uppercase tracking-tighter">
            Aucune livraison
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 max-w-[200px] mx-auto uppercase font-bold leading-relaxed tracking-tighter">
            {status === "ALL" 
              ? "Le carnet de commandes est actuellement vide." 
              : `Aucun résultat pour le filtre "${statusTranslations[status]}".`}
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE LIST VIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {orders.map((order) => (
              <Link 
                to={`/admin/deliveries/${order._id}`}
                key={order._id} 
                className="bg-white dark:bg-white/[0.03] p-6 rounded-[2.5rem] border border-slate-50 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="text-2xl font-black text-primary dark:text-white italic tracking-tighter block leading-none">#{order.orderNumber}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-2 block">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${statusStyles[order.status]}`}>
                    {statusTranslations[order.status]}
                  </span>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-600">
                      <User size={14} />
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 italic uppercase">
                      {order.creatorId?.prenom} {order.creatorId?.nom || "Client"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-600">
                      <MapPin size={14} />
                    </div>
                    <p className="text-xs font-bold text-primary dark:text-secondary truncate italic uppercase">
                      {formatLocation(order)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-white/[0.03] border-b border-slate-100 dark:border-white/5">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ref</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Client</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Destination</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Livreur</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Statut</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <span className="font-display font-black text-primary dark:text-white italic text-2xl tracking-tighter">#{order.orderNumber}</span>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-slate-700 dark:text-slate-200 text-sm uppercase italic">
                        {order.creatorId?.prenom} {order.creatorId?.nom || "Admin"}
                      </p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-6">
                        <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-secondary" />
                            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                {formatLocation(order)}
                            </span>
                        </div>
                    </td>
                    <td className="p-6">
                      {order.driverId ? (
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl w-fit border border-emerald-100 dark:border-emerald-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">{order.driverId.prenom}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase italic tracking-widest">Attente...</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border inline-block ${statusStyles[order.status]}`}>
                        {statusTranslations[order.status]}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <Link
                        to={`/admin/deliveries/${order._id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-secondary dark:hover:bg-secondary hover:text-white dark:hover:text-white transition-all text-[9px] font-black uppercase tracking-widest group-hover:-translate-x-1"
                      >
                        <Eye size={14} strokeWidth={3} /> Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination meta={meta} setPage={setPage} />
        </>
      )}

      {/* OVERLAY MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl transform animate-in slide-in-from-bottom-10 duration-500">
            <NewOrderForm onAdd={handleCreateOrder} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}