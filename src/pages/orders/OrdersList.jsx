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
    PENDING: "bg-primary/5 text-primary border-primary/20 dark:bg-primary/10 dark:text-primary/90",
    ASSIGNED: "bg-secondary/10 text-secondary border-secondary/20",
    PICKED_UP: "bg-secondary/5 text-secondary border-secondary/10",
    IN_PROGRESS: "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30",
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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary font-display italic tracking-tighter uppercase">
            Livraisons
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
            Flux opérationnel en temps réel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <TotalCard title="Volume" value={meta?.total || 0} subtitle="Commandes" />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Nouvelle Commande
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${status === s 
                ? "bg-primary text-white border-primary shadow-md dark:bg-secondary dark:border-secondary" 
                : "bg-white text-slate-400 border-slate-100 hover:border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white"}`}
          >
            {s === "ALL" ? "Tous" : statusTranslations[s]}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
            {status === "ALL" ? <PackageOpen size={40} /> : <SearchX size={40} />}
          </div>
          <h3 className="text-xl font-display font-black text-primary dark:text-white italic uppercase tracking-tighter">
            Aucune livraison trouvée
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 max-w-xs mx-auto">
            {status === "ALL" 
              ? "Il n'y a pas encore de commandes enregistrées dans le système." 
              : `Aucune commande n'est actuellement au statut "${statusTranslations[status]}".`}
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {orders.map((order) => (
              <Link 
                to={`/admin/deliveries/${order._id}`}
                key={order._id} 
                className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-primary dark:text-white italic tracking-tighter">#{order.orderNumber}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${statusStyles[order.status]} dark:text-white`}>
                    {statusTranslations[order.status]}
                  </span>
                </div>

                <div className="space-y-3 border-t border-slate-50 dark:border-slate-800 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest leading-none">Créateur</p>
                      <p className="text-xs font-bold text-primary dark:text-slate-200">
                        {order.creatorId?.prenom} {order.creatorId?.nom || "Admin"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest leading-none">Destination</p>
                      <p className="text-xs font-bold text-primary dark:text-slate-200 truncate max-w-[200px]">
                        {formatLocation(order)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Référence</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Client</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Destination</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Livreur</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Statut</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="p-6 font-display font-black text-primary dark:text-white italic text-xl tracking-tighter">
                      #{order.orderNumber}
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                        {order.creatorId?.prenom} {order.creatorId?.nom || "Admin"}
                      </p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-6 text-center">
                        <span className="text-xs font-black text-slate-400 dark:text-slate-100 uppercase bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg">
                            {formatLocation(order)}
                        </span>
                    </td>
                    <td className="p-6">
                      {order.driverId ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{order.driverId.prenom}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase italic">Non assignée</span>
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusStyles[order.status]} dark:text-white`}>
                        {statusTranslations[order.status]}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <Link
                        to={`/admin/deliveries/${order._id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-primary dark:text-slate-300 hover:bg-secondary hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
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

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-primary/40 dark:bg-black/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl transform animate-in slide-in-from-bottom-8 duration-500">
            <NewOrderForm onAdd={handleCreateOrder} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}