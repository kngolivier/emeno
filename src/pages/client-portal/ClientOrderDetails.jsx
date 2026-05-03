// FILE: src/pages/client-portal/ClientOrderDetails.jsx

// FILE: src/pages/client-portal/ClientOrderDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDeliveryById } from "../../api/deliveries.api";
import { useNavigate } from "react-router-dom";

import {
  Truck,
  MapPin,
  Package,
  CheckCircle,
  Circle,
  Clock,
  User,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";

export default function ClientOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchDeliveryById(id);
      setDelivery(res?.data);
    };
    load();
  }, [id]);

  if (!delivery) {
    return (
      <div className="p-10 text-center text-slate-500">
        Chargement...
      </div>
    );
  }

  const steps = [
    { label: "Commande créée", time: delivery.createdAt },
    { label: "Assignée", time: delivery.timestampsLog?.assignedAt },
    { label: "Récupérée", time: delivery.timestampsLog?.pickedUpAt },
    { label: "En cours", time: delivery.timestampsLog?.inProgressAt },
    { label: "Livrée", time: delivery.timestampsLog?.deliveredAt },
  ];

  const getStepIndex = () => {
    switch (delivery.status) {
      case "PENDING": return 0;
      case "ASSIGNED": return 1;
      case "PICKED_UP": return 2;
      case "IN_PROGRESS": return 3;
      case "DELIVERED": return 4;
      default: return 0;
    }
  };

  const activeStep = getStepIndex();

  const statusColor = {
    PENDING: "bg-amber-50 text-amber-600",
    ASSIGNED: "bg-blue-50 text-blue-600",
    IN_PROGRESS: "bg-cyan-50 text-cyan-600",
    DELIVERED: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* HEADER */}
    <div className="bg-white border rounded-2xl p-5 flex items-center justify-between shadow-sm">

    {/* LEFT */}
    <div className="flex items-center gap-4">

        {/* BACK BUTTON */}
        <button
        onClick={() => navigate("/client/orders")}
        className="p-2 rounded-xl border bg-slate-50 hover:bg-slate-100 transition"
        >
        <ChevronLeft size={18} className="text-slate-600" />
        </button>

        <div>
        <h1 className="text-xl font-bold text-slate-800">
            Commande #{delivery.orderNumber}
        </h1>

        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <Clock size={14} />
            {new Date(delivery.createdAt).toLocaleString()}
        </p>
        </div>

    </div>

    {/* STATUS */}
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[delivery.status] || "bg-slate-100 text-slate-600"}`}>
        {delivery.status}
    </span>

    </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TIMELINE */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <h2 className="font-semibold flex items-center gap-2 mb-4 text-slate-800">
            <Truck size={18} />
            Suivi livraison
          </h2>

          <div className="space-y-4">

            {steps.map((step, index) => {
              const done = index <= activeStep;

              return (
                <div key={index} className="flex items-start gap-3">

                  <div className="mt-1">
                    {done ? (
                      <CheckCircle className="text-emerald-600" size={18} />
                    ) : (
                      <Circle className="text-slate-300" size={18} />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className={`text-sm ${done ? "text-slate-800 font-medium" : "text-slate-400"}`}>
                      {step.label}
                    </p>

                    <p className="text-xs text-slate-400">
                      {step.time ? new Date(step.time).toLocaleString() : "En attente"}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* COLIS */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="font-semibold flex items-center gap-2 text-slate-800">
            <Package size={18} />
            Colis
          </h2>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-500">Catégorie</span>
              <span className="font-medium">{delivery.packageDetails?.category}</span>
            </div>

            <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-500">Fragile</span>
              <span className="font-medium">
                {delivery.packageDetails?.isFragile ? "Oui" : "Non"}
              </span>
            </div>

            <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-500">Poids</span>
              <span className="font-medium">
                {delivery.packageDetails?.weight || "-"} kg
              </span>
            </div>

          </div>

          {delivery.verificationCode && (
            <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-xl flex items-center gap-2 text-sm">
              <ShieldCheck size={16} />
              Code : <strong>{delivery.verificationCode}</strong>
            </div>
          )}

        </div>

        {/* LIVREUR */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="font-semibold flex items-center gap-2 text-slate-800">
            <User size={18} />
            Livreur
          </h2>

          {delivery.driverId ? (
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="font-semibold text-slate-800">
                {delivery.driverId.nom} {delivery.driverId.prenom}
              </p>
              <p className="text-sm text-slate-500">
                {delivery.driverId.telephone}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Aucun livreur assigné
            </p>
          )}

        </div>

      </div>

      {/* ADRESSES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <MapPin size={16} />
            Pickup
          </h3>
          <p className="text-sm text-slate-600">
            {delivery.pickupLocation}
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <MapPin size={16} />
            Dropoff
          </h3>
          <p className="text-sm text-slate-600">
            {delivery.dropoffLocation}
          </p>
        </div>

      </div>

    </div>
  );
}