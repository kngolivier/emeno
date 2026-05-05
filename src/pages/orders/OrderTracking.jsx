// FILE: src/pages/orders/OrderTracking.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Truck,
  CreditCard,
  Clock,
  PackageCheck,
  MapPin,
  CheckCircle,
  Circle,
  Package,
  Send,
  XCircle,
  AlertCircle
} from "lucide-react";

import {
  fetchDeliveryById,
  assignDriver,
  cancelDelivery
} from "../../api/deliveries.api";

import { fetchAvailableDrivers } from "../../api/users.api";
import PageLoader from "../../components/ui/PageLoader";
import { notifySuccess, notifyError } from "../../utils/notify";

export default function OrderTracking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAssignBox, setShowAssignBox] = useState(false);

  // ======================
  // FETCH DATA
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

  const loadDrivers = async () => {
    try {
      const res = await fetchAvailableDrivers();
      const list = Array.isArray(res) ? res : res?.data?.data || res?.data || [];
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
  // ACTIONS logic
  // ======================
  const handleAssign = async () => {
    if (!selectedDriver) return;
    setActionLoading(true);
    try {
      await assignDriver(order._id, selectedDriver);
      notifySuccess("Livreur assigné avec succès");
      setShowAssignBox(false);
      setSelectedDriver("");
      await loadOrder();
      await loadDrivers();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Confirmer l'annulation de cette livraison ?");
    if (!confirmCancel) return;

    setActionLoading(true);
    try {
      await cancelDelivery(order._id);
      notifySuccess("Livraison annulée");
      await loadOrder();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-sans">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <p className="text-slate-500 font-bold italic">Commande introuvable</p>
        <Link to="/deliveries" className="text-primary font-black uppercase text-xs mt-4 tracking-widest hover:text-secondary">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  // ======================
  // BUSINESS LOGIC
  // ======================
  const formatPrice = (price) => price?.toLocaleString() + " FCFA";
  
  const canAssign = ["PENDING", "ASSIGNED"].includes(order.status) && !["DELIVERED", "CANCELLED"].includes(order.status);
  const canCancel = ["PENDING", "ASSIGNED"].includes(order.status);

  const steps = [
    { label: "Créée", done: true, time: order.createdAt },
    { label: "Assignée", done: ["ASSIGNED", "PICKED_UP", "IN_PROGRESS", "DELIVERED"].includes(order.status), time: order.timestampsLog?.assignedAt },
    { label: "Réassignée", done: !!order.timestampsLog?.reassignedAt, time: order.timestampsLog?.reassignedAt },
    { label: "Récupérée", done: ["PICKED_UP", "IN_PROGRESS", "DELIVERED"].includes(order.status), time: order.timestampsLog?.pickedUpAt },
    { label: "En cours", done: ["IN_PROGRESS", "DELIVERED"].includes(order.status), time: order.timestampsLog?.inProgressAt },
    { label: "Livrée", done: order.status === "DELIVERED", time: order.timestampsLog?.deliveredAt },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link to="/admin/deliveries" className="p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all text-primary group">
            <ChevronLeft size={24} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-primary font-display italic tracking-tighter">
              Commande #{order.orderNumber}
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <Clock size={12} className="text-secondary" />
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {canAssign && (
            <button 
              onClick={() => setShowAssignBox(!showAssignBox)} 
              className="px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-secondary transition-all"
            >
              Assigner livreur
            </button>
          )}
          {canCancel && (
            <button 
              onClick={handleCancel}
              disabled={actionLoading}
              className="px-6 py-4 bg-white text-red-500 border border-red-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <XCircle size={14} /> Annuler
            </button>
          )}
        </div>
      </div>

      {/* ASSIGN BOX MODAL-LIKE */}
      {showAssignBox && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-soft animate-fadeIn space-y-6">
          <div className="flex items-center gap-3 font-display font-black text-xl italic text-primary">
            <Truck className="text-secondary" />
            Unités disponibles
          </div>
          <select 
            value={selectedDriver} 
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-100 font-sans font-bold text-sm outline-none focus:ring-4 focus:ring-secondary/10 bg-slate-50"
          >
            <option value="">-- Choisir un livreur --</option>
            {drivers.map(d => (
              <option key={d._id} value={d._id}>
                {d.prenom} {d.nom} {d.telephone ? `(${d.telephone})` : ""}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-4">
            <button onClick={() => setShowAssignBox(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fermer</button>
            <button 
              onClick={handleAssign} 
              disabled={!selectedDriver || actionLoading} 
              className="px-8 py-3 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-30"
            >
              Confirmer
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PRIMARY INFOS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-soft space-y-4">
            {[
              { label: "Client", val: order.creatorId?.nom, icon: User, col: "bg-blue-500" },
              { label: "Livreur", val: order.driverId?.nom || "En attente", icon: Truck, col: "bg-emerald-500" },
              { label: "Paiement", val: order.payerType === "SENDER" ? "Expéditeur" : "Destinataire", icon: Send, col: "bg-indigo-500" },
              { label: "Prix total", val: formatPrice(order.price), icon: CreditCard, col: "bg-secondary" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-[1.5rem] hover:bg-slate-50 transition-colors">
                <div className={`w-12 h-12 ${item.col} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="font-display font-black text-lg text-primary italic tracking-tight">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 📦 DETAILED PACKAGE BOX */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-soft space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xl italic text-primary">Détails Colis</h3>
                <Package className="text-slate-200" size={24} />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Catégorie</p>
                    <p className="font-bold text-slate-700">{order.packageDetails?.category}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Fragile</p>
                    <p className={`font-bold ${order.packageDetails?.isFragile ? 'text-red-500' : 'text-slate-700'}`}>
                        {order.packageDetails?.isFragile ? "OUI" : "NON"}
                    </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl col-span-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Poids estimé</p>
                    <p className="font-bold text-slate-700">{order.packageDetails?.weight || "0"} kg</p>
                </div>
             </div>
             <div className="p-4 border-l-4 border-secondary bg-secondary/5 text-xs text-slate-500 italic font-sans">
                "{order.packageDetails?.description || "Aucune description fournie"}"
             </div>
          </div>
        </div>

        {/* CENTER COLUMN: LOGISTICS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-soft h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <MapPin size={120} />
            </div>
            
            <h3 className="font-display font-black text-xl italic text-primary mb-10">Itinéraire</h3>
            
            <div className="relative space-y-12">
              {/* Vertical line decor */}
              <div className="absolute left-6 top-2 bottom-2 w-0.5 border-l-2 border-dashed border-slate-100" />

              {/* Pickup */}
              <div className="relative flex gap-8">
                <div className="w-12 h-12 bg-white border-4 border-blue-500 rounded-full z-10 flex items-center justify-center shadow-xl shadow-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Point d'enlèvement</p>
                  <p className="font-bold text-slate-800 text-lg leading-tight mb-2">{order.pickupLocation}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-sans italic">
                    <span className="flex items-center gap-1 font-bold"><User size={12} /> {order.pickupContact?.name}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {order.pickupCommune}</span>
                    <span className="text-secondary font-black">{order.pickupContact?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Dropoff */}
              <div className="relative flex gap-8">
                <div className="w-12 h-12 bg-white border-4 border-emerald-500 rounded-full z-10 flex items-center justify-center shadow-xl shadow-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Destination finale</p>
                  <p className="font-bold text-slate-800 text-lg leading-tight mb-2">{order.dropoffLocation}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-sans italic">
                    <span className="flex items-center gap-1 font-bold"><User size={12} /> {order.dropoffContact?.name}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {order.dropoffCommune}</span>
                    <span className="text-secondary font-black">{order.dropoffContact?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRACKING TIMELINE */}
        <div className="lg:col-span-3">
          <div className="bg-primary p-8 rounded-[2.5rem] shadow-2xl h-full space-y-8 relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            
            <h3 className="text-white font-display font-black text-2xl italic tracking-tight flex items-center gap-2">
              <PackageCheck size={24} className="text-secondary" />
              Statut
            </h3>
            
            <div className="space-y-6 relative">
              {steps.map((step, i) => (
                <div key={i} className={`flex justify-between items-center transition-all ${step.done ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                        {step.done ? <CheckCircle size={20} className="text-secondary" /> : <Circle size={20} className="text-white" />}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-white/50 font-sans">
                    {step.time ? new Date(step.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                    <div>
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Actuel</p>
                        <p className="text-white font-bold text-sm tracking-wide">{order.status}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}