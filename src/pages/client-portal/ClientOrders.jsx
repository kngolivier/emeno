// src/pages/client-portal/ClientOrders.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, X, Package, MapPin, Calendar, ArrowRight, Filter } from "lucide-react";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import PageLoader from "../../components/ui/PageLoader";
import { Pagination } from "../../components/Pagination";
import { STATUS_LABELS } from "../../constants/constants";

export default function ClientOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orders = [], meta, loading, setPage } = usePaginatedFetch(fetchClientDeliveries, 10);

  // Styles de statuts adaptés au Dark Mode (plus vibrants)
  const statusStyles = {
    PENDING: "dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 bg-amber-50 text-amber-600 border-amber-100",
    ASSIGNED: "dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 bg-blue-50 text-blue-600 border-blue-100",
    PICKED_UP: "dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 bg-indigo-50 text-indigo-600 border-indigo-100",
    IN_PROGRESS: "dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 bg-cyan-50 text-cyan-600 border-cyan-100",
    DELIVERED: "dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 bg-emerald-50 text-emerald-600 border-emerald-100",
    CANCELLED: "dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 bg-rose-50 text-rose-600 border-rose-100",
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "ALL" || order.status === filter;
    const search = searchTerm.toLowerCase();
    return matchesStatus && (
      order.orderNumber?.toString().includes(search) || 
      order.pickupLocation?.toLowerCase().includes(search) ||
      order.dropoffLocation?.toLowerCase().includes(search)
    );
  });

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      {/* HEADER & RECHERCHE */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary dark:text-white italic tracking-tighter uppercase">
            Mes commandes
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.2em] italic">
            Historique & Suivi EMENO
          </p>
        </div>

        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-secondary transition-colors" size={18} strokeWidth={3} />
          <input
            className="w-full bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[1.5rem] pl-14 pr-12 py-4 text-[11px] font-bold uppercase tracking-wider shadow-soft outline-none focus:border-secondary/20 dark:focus:border-secondary/40 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 text-primary dark:text-white"
            placeholder="Rechercher par numéro ou lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors">
              <X size={18} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* FILTRES SCROLLABLES */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400">
          <Filter size={16} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
          {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap px-6 py-3 rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest border-2 transition-all
                ${filter === s 
                  ? "bg-primary dark:bg-secondary text-white dark:text-primary border-primary dark:border-secondary shadow-lg shadow-primary/10" 
                  : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-50 dark:border-slate-800 hover:border-slate-100 dark:hover:border-slate-700"}`}
            >
              {s === "ALL" ? "Toutes les courses" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* --- VUE MOBILE : CARDS (AMÉLIORÉES) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:hidden">
        {filteredOrders.map((d) => (
          <div 
            key={d._id} 
            onClick={() => navigate(`/client/orders/${d._id}`)}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-soft active:scale-95 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-primary dark:text-secondary flex items-center justify-center shadow-inner">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none italic">Réf.</p>
                  <p className="text-xl font-black text-primary dark:text-white italic leading-none pt-1">#{d.orderNumber}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-tighter border-2 ${statusStyles[d.status]}`}>
                {STATUS_LABELS[d.status]}
              </span>
            </div>

            <div className="space-y-4 bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-[2rem] mb-6 border border-slate-50/50 dark:border-slate-800/50">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700"></div>
                  <MapPin size={14} className="text-primary dark:text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Départ</p>
                  <p className="text-[12px] font-bold text-primary dark:text-white truncate">{d.pickupLocation}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-2">Arrivée</p>
                  <p className="text-[12px] font-bold text-primary dark:text-white truncate">{d.dropoffLocation}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
                <Calendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest italic">
                  {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <button className="p-3 rounded-xl bg-primary dark:bg-secondary text-white dark:text-primary transition-all shadow-lg shadow-primary/10 dark:shadow-none">
                <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- VUE DESKTOP : TABLE (CHIC DARK) --- */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] shadow-soft overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800">
              <th className="p-7 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Référence</th>
              <th className="p-7 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Itinéraire</th>
              <th className="p-7 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic text-center">Statut</th>
              <th className="p-7 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Date</th>
              <th className="p-7"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredOrders.map((d) => (
              <tr 
                key={d._id} 
                className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group cursor-pointer" 
                onClick={() => navigate(`/client/orders/${d._id}`)}
              >
                <td className="p-7">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 dark:bg-secondary/5 text-primary dark:text-secondary flex items-center justify-center group-hover:scale-110 transition-all border border-transparent group-hover:border-primary/10 dark:group-hover:border-secondary/20">
                      <Package size={22} />
                    </div>
                    <span className="font-black text-primary dark:text-white italic text-2xl tracking-tighter">#{d.orderNumber}</span>
                  </div>
                </td>
                <td className="p-7">
                  <div className="flex flex-col max-w-xs">
                    <span className="text-[12px] font-bold text-primary dark:text-white truncate uppercase tracking-tight">{d.pickupLocation}</span>
                    <div className="flex items-center gap-3 my-1">
                      <div className="h-[1px] w-6 bg-slate-100 dark:bg-slate-800"></div>
                      <ArrowRight size={12} className="text-secondary" strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 truncate uppercase italic">{d.dropoffLocation}</span>
                  </div>
                </td>
                <td className="p-7 text-center">
                  <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 ${statusStyles[d.status]}`}>
                    {STATUS_LABELS[d.status]}
                  </span>
                </td>
                <td className="p-7">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-primary dark:text-white">{new Date(d.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">à {new Date(d.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="p-7 text-right">
                  <div className="inline-flex h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-700 items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all transform group-hover:rotate-12 shadow-inner">
                    <Eye size={20} strokeWidth={2.5} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {filteredOrders.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-50 dark:border-slate-800 p-24 text-center">
          <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Package size={40} />
          </div>
          <p className="text-[12px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em] italic">Aucune commande trouvée</p>
          <button 
            onClick={() => navigate('/client/new-order')}
            className="mt-8 text-secondary font-black uppercase text-[10px] tracking-widest hover:underline"
          >
            Lancer une nouvelle livraison
          </button>
        </div>
      )}

      <div className="pt-4">
        <Pagination meta={meta} setPage={setPage} />
      </div>
    </div>
  );
}