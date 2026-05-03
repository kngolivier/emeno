// FILE: src/pages/client-portal/ClientDashboard.jsx

import { useEffect, useState } from "react";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Plus,
  Clock
} from "lucide-react";

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState([]);

  const navigate = useNavigate();

  // ======================
  // FETCH DATA
  // ======================
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchClientDeliveries({ page: 1, limit: 10 });
      setDeliveries(res.data.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ======================
  // STATS CALC
  // ======================
  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === "PENDING").length,
    inProgress: deliveries.filter(d =>
      ["ASSIGNED", "PICKED_UP", "IN_PROGRESS"].includes(d.status)
    ).length,
    delivered: deliveries.filter(d => d.status === "DELIVERED").length,
    cancelled: deliveries.filter(d => d.status === "CANCELLED").length
  };

  // ======================
  // UI BADGE STATUS
  // ======================
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "ASSIGNED":
      case "PICKED_UP":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Tableau de bord
          </h1>
          <p className="text-sm text-slate-500">
            Suivi de vos livraisons
          </p>
        </div>

        <button
          onClick={() => navigate("/client/new-order")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl"
        >
          <Plus size={16} />
          Nouvelle commande
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <StatCard icon={<Package />} label="Total" value={stats.total} />
        <StatCard icon={<Clock />} label="En attente" value={stats.pending} />
        <StatCard icon={<Truck />} label="En cours" value={stats.inProgress} />
        <StatCard icon={<CheckCircle />} label="Livrées" value={stats.delivered} />
        <StatCard icon={<XCircle />} label="Annulées" value={stats.cancelled} />

      </div>

      {/* LAST ORDERS */}
      <div className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-4">Dernières commandes</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-slate-500">Aucune commande</p>
        ) : (
          <div className="space-y-3">

            {deliveries.slice(0, 5).map((d) => (
              <div
                key={d._id}
                onClick={() => navigate(`/client/orders/${d._id}`)}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <p className="font-medium">
                    Commande #{d.orderNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    {d.pickupLocation} → {d.dropoffLocation}
                  </p>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(d.status)}`}>
                  {d.status}
                </span>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}

// ======================
// SMALL COMPONENT
// ======================
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border flex items-center gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}