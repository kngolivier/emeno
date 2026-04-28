// FILE: src/pages/orders/OrderTracking.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Truck,
  CreditCard,
  Clock,
  PackageCheck
} from "lucide-react";

import {
  fetchDeliveryById,
  assignDriver,
  cancelDelivery
} from "../../api/deliveries.api";

import { fetchAvailableDrivers } from "../../api/users.api";

export default function OrderTracking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssignBox, setShowAssignBox] = useState(false);

  // ======================
  // FETCH ORDER
  // ======================
  const loadOrder = async () => {
    try {
      const res = await fetchDeliveryById(id);
      setOrder(res.data);
    } catch (err) {
      console.error("Erreur chargement commande:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // FETCH AVAILABLE DRIVERS
  // ======================
  const loadDrivers = async () => {
    try {
      const res = await fetchAvailableDrivers();

      const list = Array.isArray(res)
        ? res
        : res?.data?.data || res?.data || [];

      setDrivers(list);
    } catch (err) {
      console.error("Erreur drivers:", err.message);
    }
  };

  useEffect(() => {
    loadOrder();
    loadDrivers();
  }, [id]);

  // ======================
  // ASSIGN DRIVER
  // ======================
  const handleAssign = async () => {
    if (!selectedDriver) return;

    try {
      setActionLoading(true);

      await assignDriver(order._id, selectedDriver);

      setShowAssignBox(false);
      setSelectedDriver("");

      await loadOrder();
      await loadDrivers(); // refresh disponibilité

    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ======================
  // CANCEL DELIVERY
  // ======================
  const handleCancel = async () => {
    const confirmCancel = confirm("Confirmer l'annulation de cette livraison ?");
    if (!confirmCancel) return;

    try {
      setActionLoading(true);
      await cancelDelivery(order._id);
      await loadOrder();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500">
        Chargement...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Commande introuvable</p>
        <Link
          to="/orders"
          className="text-blue-600 font-medium mt-4 inline-block"
        >
          Retour aux commandes
        </Link>
      </div>
    );
  }

  const formatPrice = (price) =>
    price?.toLocaleString() + " FCFA";

  // ======================
  // LOGIQUE D'ASSIGNATION (ALIGNÉ BACKEND)
  // ======================
  const canAssign =
    ["PENDING", "ASSIGNED"].includes(order.status) &&
    !["DELIVERED", "CANCELLED"].includes(order.status);

  const canCancel = ["PENDING", "ASSIGNED"].includes(order.status);

  const steps = [
    { label: "Créée", done: true, time: order.createdAt },

    {
      label: "Assignée",
      done: ["ASSIGNED", "PICKED_UP", "IN_PROGRESS", "DELIVERED"].includes(order.status),
      time: order.timestampsLog?.assignedAt,
    },

    {
      label: "Réassignée",
      done: !!order.timestampsLog?.reassignedAt,
      time: order.timestampsLog?.reassignedAt,
    },

    {
      label: "Récupérée",
      done: ["PICKED_UP", "IN_PROGRESS", "DELIVERED"].includes(order.status),
      time: order.timestampsLog?.pickedUpAt,
    },

    {
      label: "En cours",
      done: ["IN_PROGRESS", "DELIVERED"].includes(order.status),
      time: order.timestampsLog?.inProgressAt,
    },

    {
      label: "Livrée",
      done: order.status === "DELIVERED",
      time: order.timestampsLog?.deliveredAt,
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">
          <Link
            to="/deliveries"
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Commande #{order.orderNumber}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Clock size={14} />
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">

          {canAssign && (
            <button
              onClick={() => setShowAssignBox(!showAssignBox)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition"
            >
              Assigner livreur
            </button>
          )}

          {canCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-xl shadow-sm hover:bg-red-700 transition"
            >
              Annuler
            </button>
          )}

        </div>
      </div>

      {/* ASSIGN BOX */}
      {showAssignBox && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">

          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Truck size={18} className="text-blue-600" />
            Sélectionner un livreur disponible
          </div>

          {/* DROPDOWN */}
          <div>
            {drivers.length === 0 ? (
              <p className="text-sm text-slate-400">
                Aucun livreur disponible
              </p>
            ) : (
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          text-slate-700 font-medium cursor-pointer
                          hover:border-blue-300 transition"
              >
                <option value="" className="text-slate-400">
                  -- Sélectionner un livreur --
                </option>

                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                     {d.prenom} {d.nom} {d.telephone ? `- ${d.telephone}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-end gap-3">

            <button
              onClick={() => setShowAssignBox(false)}
              className="px-4 py-2 text-slate-500 hover:text-slate-700"
            >
              Annuler
            </button>

            <button
              onClick={handleAssign}
              disabled={!selectedDriver || actionLoading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              Confirmer assignation
            </button>

          </div>

        </div>
      )}

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* INFOS */}
        <div className="space-y-6">

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Client</p>
                <p className="font-semibold text-slate-800">
                  {order.creatorId?.nom}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Livreur</p>
                <p className="font-semibold text-slate-800">
                  {order.driverId?.nom || "Non assigné"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center shadow-md">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
                <p className="font-bold text-slate-800">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 font-bold uppercase">Statut</p>
              <p className="font-bold text-blue-600">{order.status}</p>
            </div>

          </div>

        </div>

        {/* TIMELINE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PackageCheck size={18} className="text-blue-600" />
            Suivi de la livraison
          </h3>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className={step.done ? "text-slate-800 font-semibold" : "text-slate-400"}>
                  {step.label}
                </span>

                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border">
                  {step.time
                    ? new Date(step.time).toLocaleTimeString()
                    : "--"}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}