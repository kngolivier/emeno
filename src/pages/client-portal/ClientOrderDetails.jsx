// FILE: src/pages/client-portal/ClientOrderDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDeliveryById, cancelDelivery } from "../../api/deliveries.api";
import { 
  Truck, MapPin, Package, Clock, ShieldCheck, 
  ChevronLeft, XCircle, AlertTriangle, Loader2, Star
} from "lucide-react";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import FeedbackModal from "../../components/feedback/FeedbackModal";
import { STATUS_COLORS, STATUS_LABELS, CATEGORY_LABELS } from "../../constants/constants";

export default function ClientOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [delivery, setDelivery] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // État pour la modal de feedback
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const loadDelivery = async () => {
    try {
      const res = await fetchDeliveryById(id);
      const data = res?.data;
      setDelivery(data);

      // Si la commande est livrée et n'a pas encore de feedback, on propose la modal
      if (data?.status === "DELIVERED" && !data?.hasFeedback) {
        setShowFeedbackModal(true);
      }
    } catch (err) {
      notifyError("Erreur lors du chargement de la commande");
    }
  };

  useEffect(() => {
    loadDelivery();
    // On retire 'delivery' des dépendances pour éviter les boucles infinies, 
    // on ne recharge que si l'ID change ou via un appel manuel
  }, [id]);

  if (!delivery) return <PageLoader />;
  
  const steps = [
    { label: "Créée", time: delivery.createdAt },
    { label: "Assignée", time: delivery.timestampsLog?.assignedAt },
    { label: "Récupérée", time: delivery.timestampsLog?.pickedUpAt },
    { label: "En cours de livraison", time: delivery.timestampsLog?.inProgressAt },
    { label: "Livrée", time: delivery.timestampsLog?.deliveredAt },
  ];

  const activeStep = ["PENDING", "ASSIGNED", "PICKED_UP", "IN_PROGRESS", "DELIVERED"].indexOf(delivery.status);
  const canCancel = ["PENDING", "ASSIGNED"].includes(delivery.status);

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      await cancelDelivery(id);
      notifySuccess("Commande annulée avec succès");
      setShowCancelModal(false);
      loadDelivery();
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative transition-colors">
      
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between shadow-soft gap-4">
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
          <button 
            onClick={() => navigate("/client/orders")} 
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-primary dark:hover:bg-secondary hover:text-white transition-all shadow-sm shrink-0"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-black text-primary dark:text-white italic tracking-tighter uppercase">
              Commande <span className="text-secondary">#</span>{delivery.orderNumber}
            </h1>
            <p className="text-[9px] sm:text-xs font-black uppercase text-slate-300 dark:text-slate-600 tracking-widest mt-1 flex items-center gap-2 italic">
              <Clock size={12} className="text-secondary" /> {new Date(delivery.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-end">
          {/* Bouton Feedback manuel si déjà livré */}
          {delivery.status === "DELIVERED" && (
            <button 
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-widest text-secondary border-2 border-secondary/10 hover:bg-secondary hover:text-primary transition-all flex-1 md:flex-none"
            >
              <Star size={16} fill="currentColor" />
              <span>{delivery.hasFeedback ? "Modifier Avis" : "Noter"}</span>
            </button>
          )}

          {canCancel && (
            <button 
              onClick={() => setShowCancelModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-widest text-red-500 border-2 border-red-50 dark:border-red-900/20 hover:bg-red-500 hover:text-white transition-all flex-1 md:flex-none"
            >
              <XCircle size={16} /> 
              <span>Annuler</span>
            </button>
          )}

          <span className={`flex-1 md:flex-none text-center px-4 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-widest border-2 whitespace-nowrap 
            ${STATUS_COLORS[delivery.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
            {STATUS_LABELS[delivery.status] || delivery.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TIMELINE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-soft">
          <h2 className="font-black text-primary dark:text-white uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2 italic">
            <Truck size={16} className="text-secondary" /> Suivi Expédition
          </h2>
          <div className="space-y-8 relative">
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 relative z-10">
                <div className={`mt-1.5 w-5 h-5 rounded-full border-4 dark:bg-slate-900 transition-all duration-500
                  ${index <= activeStep ? "border-secondary scale-110 shadow-lg shadow-secondary/20 bg-white" : "border-slate-100 dark:border-slate-800 bg-white"}`} />
                <div>
                  <p className={`text-sm font-black uppercase tracking-tight ${index <= activeStep ? "text-primary dark:text-slate-200" : "text-slate-300 dark:text-slate-700"}`}>{step.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600">{step.time ? new Date(step.time).toLocaleString() : "..."}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLIS & CODE */}
        <div className="space-y-8 lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-soft">
            <h2 className="font-black text-primary dark:text-white uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2 italic">
              <Package size={16} className="text-secondary" /> Informations Colis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <InfoBox label="Catégorie" value={CATEGORY_LABELS[delivery.packageDetails?.category] || delivery.packageDetails?.category} />
              <InfoBox label="Poids" value={`${delivery.packageDetails?.weight || "-"} KG`} />
              <InfoBox label="Fragile" value={delivery.packageDetails?.isFragile ? "OUI" : "NON"} isAlert={delivery.packageDetails?.isFragile} />
            </div>

            {delivery.verificationCode && delivery.status !== 'CANCELLED' && delivery.status !== 'DELIVERED' && (
              <div className="bg-secondary/5 dark:bg-secondary/10 border-2 border-secondary dark:border-secondary/20 rounded-[1.5rem] p-4 sm:p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-4 text-secondary shrink-0">
                  <ShieldCheck size={24} className="shrink-0" />
                  {/* <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider leading-tight">
                    Code <br className="sm:hidden" /> Sécurité
                  </span> */}
                </div>
                <span className="text-xl sm:text-3xl font-black text-primary dark:text-white tracking-[0.2em] tabular-nums bg-white/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-xl border-none border-secondary/5">
                  {delivery.verificationCode}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AddressCard title="Récupération" address={delivery.pickupLocation} color="primary" contact={delivery.pickupContact} />
            <AddressCard title="Destination" address={delivery.dropoffLocation} color="secondary" contact={delivery.dropoffContact} />
          </div>
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        deliveryId={id}
        role="CLIENT"
      />

      {/* MODAL ANNULATION */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-primary dark:text-white italic tracking-tighter mb-2 text-center uppercase">Annuler ?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide text-center leading-relaxed mb-8 opacity-70">
              Cette action est irréversible. Le livreur sera immédiatement notifié.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest"
              >
                Retour
              </button>
              <button 
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20"
              >
                {isCancelling ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value, isAlert }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">{label}</p>
      <p className={`text-lg font-black italic tracking-tighter uppercase ${isAlert ? "text-red-500" : "text-primary dark:text-slate-200"}`}>{value}</p>
    </div>
  );
}

function AddressCard({ title, address, color, contact }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2rem] p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${color === 'primary' ? 'bg-primary' : 'bg-secondary'}`}>
          <MapPin size={14} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 italic">{title}</h3>
      </div>
      <p className="text-sm font-black text-primary dark:text-slate-200 leading-tight uppercase italic mb-3">{address}</p>
      <div className="pt-3 border-t border-slate-50 dark:border-slate-800/50">
         <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-1">Contact</p>
         <p className="text-[11px] font-bold text-primary dark:text-slate-400 uppercase tracking-tighter">{contact?.name || 'Inconnu'} • <span className="text-secondary italic">{contact?.phone}</span></p>
      </div>
    </div>
  );
}