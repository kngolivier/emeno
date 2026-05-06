// FILE: src/pages/client-portal/ClientOrders.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, X, Package, MapPin, Calendar, ArrowRight } from "lucide-react";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import PageLoader from "../../components/ui/PageLoader";
import { Pagination } from "../../components/Pagination";

export default function ClientOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orders = [], meta, loading, setPage } = usePaginatedFetch(fetchClientDeliveries, 10);

  const statusStyles = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-100",
    ASSIGNED: "bg-blue-500/10 text-blue-600 border-blue-100",
    PICKED_UP: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
    IN_PROGRESS: "bg-cyan-500/10 text-cyan-600 border-cyan-100",
    DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-100",
    CANCELLED: "bg-rose-500/10 text-rose-600 border-rose-100",
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
    <div className="space-y-8 font-sans pb-10">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary font-display italic tracking-tighter">
            Mes commandes
          </h1>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">
            Historique et suivi de vos livraisons
          </p>
        </div>

        <div className="relative group w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={16} strokeWidth={3} />
          <input
            className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-10 py-4 text-[11px] font-bold uppercase tracking-wider shadow-sm outline-none focus:border-secondary/30 transition-all placeholder:text-slate-300"
            placeholder="Numéro, lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500">
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* FILTERS SCROLLABLE */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${filter === s ? "bg-primary text-white border-primary shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`}
          >
            {s === "ALL" ? "Toutes les courses" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* --- VUE MOBILE : CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredOrders.map((d) => (
          <div 
            key={d._id} 
            onClick={() => navigate(`/client/orders/${d._id}`)}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm active:scale-95 transition-transform"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 text-primary flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Commande</p>
                  <p className="text-lg font-display font-black text-primary italic leading-none pt-1">#{d.orderNumber}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter border ${statusStyles[d.status]}`}>
                {d.status}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-secondary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-600 truncate">{d.pickupLocation}</p>
                  <ArrowRight size={10} className="text-slate-300 my-1" />
                  <p className="text-[11px] font-bold text-slate-600 truncate">{d.dropoffLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {new Date(d.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            <button className="w-full py-3 rounded-xl bg-slate-50 text-primary text-[9px] font-black uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2">
              Suivre le colis <Eye size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* --- VUE DESKTOP : TABLE --- */}
      <div className="hidden lg:block bg-white border border-slate-50 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Référence</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Itinéraire</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date de création</th>
              <th className="p-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.map((d) => (
              <tr 
                key={d._id} 
                className="hover:bg-slate-50/30 transition-colors group cursor-pointer" 
                onClick={() => navigate(`/client/orders/${d._id}`)}
              >
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package size={18} />
                    </div>
                    <span className="font-display font-black text-primary italic text-xl tracking-tighter">#{d.orderNumber}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col max-w-xs">
                    <span className="text-[11px] font-bold text-slate-700 truncate uppercase">{d.pickupLocation}</span>
                    <div className="flex items-center gap-2 my-1">
                      <div className="h-[1px] w-4 bg-slate-200"></div>
                      <ArrowRight size={10} className="text-secondary" strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 truncate uppercase italic">{d.dropoffLocation}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusStyles[d.status]}`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600">{new Date(d.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">à {new Date(d.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="inline-flex h-10 w-10 rounded-xl bg-slate-50 text-slate-300 items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all transform group-hover:rotate-12">
                    <Eye size={18} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
          <div className="h-16 w-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Aucune commande trouvée</p>
        </div>
      )}

      <Pagination meta={meta} setPage={setPage} />
    </div>
  );
}