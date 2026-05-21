// FILE: src/pages/client-portal/ClientOrderDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDeliveryById, cancelDelivery } from "../../api/deliveries.api";
import { 
  Truck, MapPin, Package, Clock, ShieldCheck, 
  ChevronLeft, XCircle, AlertTriangle, Loader2, Star, Copy, CheckCircle2
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
  const [copied, setCopied] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const loadDelivery = async () => {
    try {
      const res = await fetchDeliveryById(id);
      setDelivery(res?.data);
      if (res?.data?.status === "DELIVERED" && !res?.data?.hasFeedback) {
        setShowFeedbackModal(true);
      }
    } catch (err) {
      notifyError("Erreur lors du chargement de la commande");
    }
  };

  useEffect(() => {
    loadDelivery();
  }, [id]);

  // Fonction restaurée
  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      await cancelDelivery(id);
      notifySuccess("Commande annulée avec succès");
      setShowCancelModal(false);
      loadDelivery(); // Recharge les données pour mettre à jour le statut
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setIsCancelling(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    notifySuccess("Code copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!delivery) return <PageLoader />;
  
  const steps = [
    { label: "Créée", time: delivery.createdAt },
    { label: "Assignée", time: delivery.timestampsLog?.assignedAt },
    { label: "Récupérée", time: delivery.timestampsLog?.pickedUpAt },
    { label: "En cours", time: delivery.timestampsLog?.inProgressAt },
    { label: "Livrée", time: delivery.timestampsLog?.deliveredAt },
  ];

  const activeStep = ["PENDING", "ASSIGNED", "PICKED_UP", "IN_PROGRESS", "DELIVERED"].indexOf(delivery.status);
  const isCancelled = delivery.status === "CANCELLED";
  const canCancel = ["PENDING", "ASSIGNED"].includes(delivery.status);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => navigate(-1)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-black italic tracking-tighter uppercase">
              Commande <span className="text-secondary">#{delivery.orderNumber}</span>
            </h1>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">
              {new Date(delivery.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {delivery.status === "DELIVERED" && (
            <button onClick={() => setShowFeedbackModal(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all">
              <Star size={16} /> Notez
            </button>
          )}
          {canCancel && (
            <button onClick={() => setShowCancelModal(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-red-500 border border-red-100 dark:border-red-900/30 hover:bg-red-500 hover:text-white transition-all">
              <XCircle size={16} /> Annuler
            </button>
          )}
          <span className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${STATUS_COLORS[delivery.status]}`}>
            {STATUS_LABELS[delivery.status] || delivery.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TIMELINE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
          <h2 className="font-black uppercase tracking-widest text-[10px] mb-8 text-slate-400">Suivi du colis</h2>
          <div className="space-y-8 relative">
            <div className={`absolute left-[9px] top-2 bottom-2 w-0.5 ${isCancelled ? 'bg-red-200' : 'bg-slate-100 dark:bg-slate-800'}`} />
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 relative z-10">
                <div className={`mt-1 w-5 h-5 rounded-full border-4 ${index <= activeStep ? (isCancelled ? "border-red-500 bg-white" : "border-secondary bg-white") : "border-slate-100 dark:border-slate-800 bg-white"}`} />
                <div>
                  <p className={`text-sm font-black uppercase ${index <= activeStep ? "text-primary dark:text-slate-200" : "text-slate-300"}`}>{step.label}</p>
                  <p className="text-[10px] font-bold text-slate-400">{step.time ? new Date(step.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "En attente"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
            <h2 className="font-black uppercase tracking-widest text-[10px] mb-6 text-slate-400">Détails de livraison</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <InfoBox label="Type" value={CATEGORY_LABELS[delivery.packageDetails?.category]} />
              <InfoBox label="Poids" value={`${delivery.packageDetails?.weight || "_"} KG`} />
              <InfoBox label="Fragile" value={delivery.packageDetails?.isFragile ? "OUI" : "NON"} isAlert={delivery.packageDetails?.isFragile} />
            </div>

            {delivery.verificationCode && !isCancelled && delivery.status !== 'DELIVERED' && (
              <div className="bg-secondary/5 border-2 border-secondary/20 rounded-[1.5rem] p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Code de sécurité</p>
                  <p className="text-3xl font-black tracking-[0.2em]">{delivery.verificationCode}</p>
                </div>
                <button onClick={() => copyToClipboard(delivery.verificationCode)} className="p-3 bg-white dark:bg-slate-800 rounded-xl hover:text-secondary transition-colors">
                  {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddressCard title="Départ" address={delivery.pickupLocation} contact={delivery.pickupContact} />
            <AddressCard title="Arrivée" address={delivery.dropoffLocation} contact={delivery.dropoffContact} />
          </div>
        </div>
      </div>

      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} deliveryId={id} role="CLIENT" />
      
      {/* MODAL ANNULATION */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Confirmer l'annulation ?</h3>
            <p className="text-slate-500 text-sm mb-8">Cette action est irréversible et notifie le livreur.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-primary font-bold text-xs uppercase">Annuler</button>
              <button onClick={handleCancelOrder} disabled={isCancelling} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs uppercase">
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
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black uppercase ${isAlert ? "text-red-500" : "text-primary dark:text-white"}`}>{value}</p>
    </div>
  );
}

function AddressCard({ title, address, contact }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">{title}</h3>
      <p className="text-sm font-bold text-primary dark:text-white leading-relaxed mb-4">{address}</p>
      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contact</p>
        <p className="text-xs font-bold">{contact?.name || 'Inconnu'}</p>
        <p className="text-xs text-secondary font-bold">{contact?.phone}</p>
      </div>
    </div>
  );
}