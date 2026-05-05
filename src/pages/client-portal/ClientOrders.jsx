// FILE: src/pages/client-portal/ClientOrders.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, X, Filter } from "lucide-react";
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
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ASSIGNED: "bg-blue-50 text-blue-700 border-blue-200",
    PICKED_UP: "bg-indigo-50 text-indigo-700 border-indigo-200",
    IN_PROGRESS: "bg-cyan-50 text-cyan-700 border-cyan-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "ALL" || order.status === filter;
    const search = searchTerm.toLowerCase();
    const matchesSearch = order.orderNumber?.toString().includes(search) || 
                          order.creatorId?.nom?.toLowerCase().includes(search) || 
                          order.driverId?.nom?.toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Mes commandes</h1>
          <p className="text-slate-400 font-medium italic">Historique et suivi en temps réel</p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={18} />
          <input
            className="w-full bg-white border-2 border-slate-50 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-bold shadow-soft outline-none focus:border-secondary/20 transition-all"
            placeholder="Rechercher un numéro, un nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap
              ${filter === s ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-slate-400 border-slate-50 hover:border-slate-200"}`}
          >
            {s === "ALL" ? "TOUS" : s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Commande</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Trajet</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                <th className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="p-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((d) => (
                <tr key={d._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/client/orders/${d._id}`)}>
                  <td className="p-6 font-black text-primary italic">#{d.orderNumber}</td>
                  <td className="text-sm font-bold text-slate-600">
                    {d.pickupLocation} <span className="text-secondary mx-1">→</span> {d.dropoffLocation}
                  </td>
                  <td>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${statusStyles[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="text-sm font-bold text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="p-6 text-right">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                      <Eye size={18} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && <div className="p-20 text-center font-bold text-slate-300 uppercase tracking-widest">Aucun résultat</div>}
      </div>

      <Pagination meta={meta} setPage={setPage} />
    </div>
  );
}