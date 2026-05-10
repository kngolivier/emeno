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
  AlertCircle,
  Trash2,
  ShieldCheck, // Ajouté pour le code de sécurité
  Lock
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
  const [showCancelModal, setShowCancelModal] = useState(false);

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
  }, [id]); // Retrait de 'order' pour éviter les boucles infinies de re-render

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
    setActionLoading(true);
    try {
      await cancelDelivery(order._id);
      notifySuccess("Livraison annulée");
      setShowCancelModal(false);
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
        <Link to="/admin/deliveries" className="text-primary font-black uppercase text-xs mt-4 tracking-widest hover:text-secondary">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  // ======================
  // BUSINESS LOGIC
  // ======================
  const formatPrice = (price) => price?.toLocaleString() + " FCFA";
  
  const canAssign = ["PENDING", "ASSIGNED"].includes(order.status);
  const canCancel = ["PENDING", "ASSIGNED"].includes(order.status);

  const steps = [
    { label: "Créée", done: true, time: order.createdAt },
    { label: "Assignée", done: ["ASSIGNED", "PICKED_UP", "IN_PROGRESS", "DELIVERED"].includes(order.status), time: order.timestampsLog?.assignedAt },
    { label: "Récupérée", done: ["PICKED_UP", "IN_PROGRESS", "DELIVERED"].includes(order.status), time: order.timestampsLog?.pickedUpAt },
    { label: "En cours", done: ["IN_PROGRESS", "DELIVERED"].includes(order.status), time: order.timestampsLog?.inProgressAt },
    { label: "Livrée", done: order.status === "DELIVERED", time: order.timestampsLog?.deliveredAt },
  ];

  return (
    <div className="space-y-8 font-sans transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link to="/admin/deliveries" className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all text-primary dark:text-white group">
            <ChevronLeft size={24} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-primary font-display italic tracking-tighter uppercase">
              Commande <span className="text-secondary">#</span>{order.orderNumber}
            </h1>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
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
          {canCancel && order.status !== "CANCELLED" && (
            <button 
              onClick={() => setShowCancelModal(true)}
              disabled={actionLoading}
              className="px-6 py-4 bg-white dark:bg-slate-900 text-red-500 border border-red-100 dark:border-red-900/30 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center gap-2"
            >
              <XCircle size={14} /> Annuler
            </button>
          )}
        </div>
      </div>

      {/* ASSIGN BOX */}
      {showAssignBox && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-soft animate-fadeIn space-y-6">
          <div className="flex items-center gap-3 font-display font-black text-xl italic text-primary dark:text-white">
            <Truck className="text-secondary" />
            Livreurs disponibles
          </div>
          <select 
            value={selectedDriver} 
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-100 dark:border-slate-800 font-sans font-bold text-sm outline-none focus:ring-4 focus:ring-secondary/10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
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
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-soft space-y-4">
            {[
              { label: "Client", val: `${order.creatorId?.prenom || ""} ${order.creatorId?.nom || ""}`.trim() || "Client App", icon: User, col: "bg-blue-500" },
              { label: "Livreur", val: order.driverId ? `${order.driverId.prenom} ${order.driverId.nom}` : "En attente", icon: Truck, col: "bg-emerald-500" },
              { label: "Paiement", val: order.payerType === "SENDER" ? "Expéditeur" : "Destinataire", icon: Send, col: "bg-indigo-500" },
              { label: "Prix total", val: formatPrice(order.price), icon: CreditCard, col: "bg-secondary" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className={`w-12 h-12 ${item.col} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="font-display font-black text-lg text-primary dark:text-slate-200 italic tracking-tight">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DETAILED PACKAGE BOX */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-soft space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xl italic text-primary dark:text-white uppercase">Détails Colis</h3>
                <Package className="text-slate-200 dark:text-slate-700" size={24} />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">Catégorie</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{order.packageDetails?.category}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">Fragile</p>
                    <p className={`font-bold ${order.packageDetails?.isFragile ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        {order.packageDetails?.isFragile ? "OUI" : "NON"}
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl col-span-2">
                    <p className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">Poids estimé</p>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{order.packageDetails?.weight || "0"} kg</p>
                </div>
             </div>
             <div className="p-4 border-l-4 border-secondary bg-secondary/5 dark:bg-secondary/10 text-xs text-slate-500 dark:text-slate-400 italic font-sans">
                "{order.packageDetails?.description || "Aucune description fournie"}"
             </div>
          </div>
        </div>

        {/* CENTER COLUMN: LOGISTICS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-soft h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 dark:text-white">
                <MapPin size={120} />
            </div>
            
            <h3 className="font-display font-black text-xl italic text-primary dark:text-white mb-10 uppercase">Itinéraire</h3>
            
            <div className="relative space-y-12">
              <div className="absolute left-6 top-2 bottom-2 w-0.5 border-l-2 border-dashed border-slate-100 dark:border-slate-800" />

              {/* Pickup */}
              <div className="relative flex gap-8">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 border-4 border-blue-500 rounded-full z-10 flex items-center justify-center shadow-xl shadow-blue-100 dark:shadow-none">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Point d'enlèvement</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-tight mb-2">{order.pickupLocation}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500 font-sans italic">
                    <span className="flex items-center gap-1 font-bold text-slate-500 dark:text-slate-300"><User size={12} /> {order.pickupContact?.name}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {order.pricingSnapshot?.from || "N/A"}</span>
                    <span className="text-secondary font-black">{order.pickupContact?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Dropoff */}
              <div className="relative flex gap-8">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 border-4 border-emerald-500 rounded-full z-10 flex items-center justify-center shadow-xl shadow-emerald-100 dark:shadow-none">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Destination finale</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-tight mb-2">{order.dropoffLocation}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500 font-sans italic">
                    <span className="flex items-center gap-1 font-bold text-slate-500 dark:text-slate-300"><User size={12} /> {order.dropoffContact?.name}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {order.pricingSnapshot?.to || "N/A"}</span>
                    <span className="text-secondary font-black">{order.dropoffContact?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SECURITY & TIMELINE */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* SECURITY CODE BOX - Visible uniquement si non livré */}
          {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border-2 border-dashed border-secondary/30 shadow-soft">
               <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={18} className="text-secondary" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-white">Code de Validation</h4>
               </div>
               <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 py-4 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-3xl font-black tracking-[0.3em] text-primary dark:text-secondary italic">
                    {order.verificationCode || "----"}
                  </span>
                  <Lock size={12} className="absolute top-2 right-2 text-slate-300" />
               </div>
               <p className="text-[9px] text-slate-400 text-center mt-3 font-medium leading-tight">
                  À transmettre au livreur pour <br/> valider la livraison finale.
               </p>
            </div>
          )}

          {/* TRACKING TIMELINE */}
          <div className="bg-primary dark:bg-[#001D0E] p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            
            <h3 className="text-white font-display font-black text-2xl italic tracking-tight flex items-center gap-2 uppercase">
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
                    <div className={`w-3 h-3 ${order.status === 'CANCELLED' ? 'bg-red-500' : 'bg-secondary animate-pulse'} rounded-full`} />
                    <div>
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Actuel</p>
                        <p className="text-white font-bold text-sm tracking-wide">{order.status}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL D'ANNULATION */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 transform animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 mx-auto">
                <Trash2 size={32} />
            </div>
            
            <h3 className="text-2xl font-display font-black text-primary dark:text-white italic text-center uppercase tracking-tighter">
              Annuler la livraison ?
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm mt-4 leading-relaxed font-sans">
              Êtes-vous sûr de vouloir annuler la commande <span className="font-bold text-primary dark:text-slate-200">#{order.orderNumber}</span> ? 
              Cette action est irréversible et notifiera le client.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                Retour
              </button>
              <button 
                onClick={handleCancel}
                disabled={actionLoading}
                className="px-6 py-4 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {actionLoading ? "Annulation..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}