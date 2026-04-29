// FILE: src/pages/orders/OrdersList.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Eye } from "lucide-react";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { Pagination } from "../../components/Pagination";

import { fetchAdminDeliveries } from "../../api/deliveries.api";

export default function OrdersList() {

    // ======================
    // HOOK (SOURCE UNIQUE)
    // ======================
    const {
      data: orders = [],
      meta,
      loading,
      setPage,
      // refresh
    } = usePaginatedFetch(fetchAdminDeliveries, 10);
  
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");


  const getName = (user) => {
    if (!user) return "Inconnu";
    if (typeof user === "object") return `${user.nom || ""} ${user.prenom || ""}`;
    return "Client";
  };

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

    const matchesSearch =
      order.orderNumber?.toString().includes(search) ||
      order.creatorId?.nom?.toLowerCase().includes(search) ||
      order.driverId?.nom?.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 text-slate-500">
        Chargement des livraisons...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Livraisons
          </h1>
          <p className="text-slate-500 text-sm">
            Suivi et gestion des commandes
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />

          <input
            className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
            placeholder="ID, client, livreur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-1">

        {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "DELIVERED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm border transition whitespace-nowrap
              ${filter === s
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
          >
            {s}
          </button>
        ))}

      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4 text-left">Commande</th>
                <th className="text-left">Client</th>
                <th className="text-left">Livreur</th>
                <th className="text-left">Statut</th>
                <th className="text-left">Date</th>
                <th className="text-right p-4">Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >

                  <td className="p-4 font-semibold text-slate-800">
                    #{order.orderNumber}
                  </td>

                  <td className="text-slate-700">
                    {getName(order.creatorId)}
                  </td>

                  <td className="text-slate-700">
                    {getName(order.driverId)}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs border font-medium
                      ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="text-right p-4">
                    <Link
                      to={`/deliveries/${order._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5
                                 rounded-lg bg-blue-50 text-blue-600
                                 hover:bg-blue-100 transition text-xs font-medium"
                    >
                      <Eye size={14} />
                      Voir
                    </Link>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {filteredOrders.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            Aucune livraison trouvée
          </div>
        )}

      </div>
      <Pagination meta={meta} setPage={setPage} />
    </div>
  );
}