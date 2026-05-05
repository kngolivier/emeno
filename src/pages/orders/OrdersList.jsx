// FILE: src/pages/orders/OrdersList.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Plus, Search } from "lucide-react";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { Pagination } from "../../components/Pagination";
import { fetchAdminDeliveries, createDelivery } from "../../api/deliveries.api";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashbord/TotalCard";
import NewOrderForm from "./NewOrderForm";
import { notifySuccess, notifyError } from "../../utils/notify";

export default function OrdersList() {
  const [showForm, setShowForm] = useState(false);
  const { data: orders = [], meta, loading, setPage } = usePaginatedFetch(fetchAdminDeliveries, 10);
  const [filter, setFilter] = useState("ALL");

  const statusStyles = {
    PENDING: "bg-primary/5 text-primary border-primary/20",
    ASSIGNED: "bg-secondary/10 text-secondary border-secondary/20",
    PICKED_UP: "bg-secondary/5 text-secondary border-secondary/10",
    IN_PROGRESS: "bg-secondary text-white border-secondary shadow-sm shadow-secondary/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-200", // On peut garder une nuance verte pour le succès
    CANCELLED: "bg-red-500/10 text-red-600 border-red-200",
  };

  const handleCreateOrder = async (data) => {
    try {
      await createDelivery(data);
      notifySuccess("Commande créée avec succès");
      setShowForm(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary font-display italic tracking-tighter">
            Livraisons
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-[0.1em]">
            Flux opérationnel en temps réel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <TotalCard title="Volume Total" value={meta?.total || 0} subtitle="Commandes" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-[1.5rem] bg-primary text-white hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 text-xs font-black uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={3} />
            Créer
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
              ${filter === s ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-50 rounded-[2rem] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Commande</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Livreur</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6 font-display font-black text-primary italic text-lg tracking-tighter">
                    #{order.orderNumber}
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-slate-700 text-sm">{order.creatorId?.nom || "Client App"}</p>
                    <p className="text-[10px] text-slate-400 font-sans italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-6 text-sm font-bold text-slate-600">
                    {order.driverId ? `${order.driverId.prenom} ${order.driverId.nom}` : "---"}
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <Link
                      to={`/admin/deliveries/${order._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-primary hover:bg-secondary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Eye size={14} strokeWidth={3} /> Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination meta={meta} setPage={setPage} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md p-4">
          <NewOrderForm onAdd={handleCreateOrder} onClose={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}