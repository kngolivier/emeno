// FILE: src/pages/client-portal/ClientOrderDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDeliveryById, cancelDelivery } from "../../api/deliveries.api";
import { fetchFeedbacksByDelivery } from "../../api/feedback.api"; // Ajoutez cet import
import { 
  Truck, MapPin, Package, Clock, ShieldCheck, 
  ChevronLeft, XCircle, AlertTriangle, Loader2, Star, Copy, CheckCircle2
} from "lucide-react";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import FeedbackModal from "../../components/feedback/FeedbackModal";
import { STATUS_COLORS, STATUS_LABELS, CATEGORY_LABELS } from "../../constants/constants";
import { useAuth } from "../../context/AuthContext";

export default function ClientOrderDetails() {
  const { user } = useAuth();
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
      const deliveryData = res?.data;
      setDelivery(deliveryData);

      // 2. Vérification si la livraison est terminée
      if (deliveryData?.status === "DELIVERED") {
        try {
          // On récupère les feedbacks de cette livraison
          const feedbackRes = await fetchFeedbacksByDelivery(id);
          const feedbacks = feedbackRes?.data || [];
          
          // On vérifie si l'utilisateur actuel (le client) a déjà laissé un avis
          // Note : Vous aurez besoin de l'ID de l'utilisateur connecté 
          // (si vous l'avez dans un store ou contexte Auth)
          const hasAlreadyRated = feedbacks.some(f => f.authorId === user._id);

          if (!hasAlreadyRated) {
            setShowFeedbackModal(true);
          }
        } catch (err) {
          // Si l'API retourne une erreur ou si aucun feedback n'existe, on ignore simplement
          console.log("Aucun feedback trouvé ou erreur de vérification");
        }
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* HEADER CARD - Inspiré style Admin */}
      <div className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
              Commande <span className="text-secondary">#{delivery.orderNumber}</span>
            </h1>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">
              {new Date(delivery.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {delivery.status === "DELIVERED" && (
            <button onClick={() => setShowFeedbackModal(true)} className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all flex items-center gap-2">
              <Star size={14} /> Notez
            </button>
          )}
          {canCancel && (
            <button onClick={() => setShowCancelModal(true)} className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-100 dark:border-red-900/30 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
              <XCircle size={14} /> Annuler
            </button>
          )}
          <span className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[delivery.status]}`}>
            {STATUS_LABELS[delivery.status] || delivery.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE: Détails Package & Adresses */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-soft">
             <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-6">Détails colis</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                    <p className="font-bold text-sm mt-1">{CATEGORY_LABELS[delivery.packageDetails?.category]}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Poids</p>
                    <p className="font-bold text-sm mt-1">{delivery.packageDetails?.weight || "_"} KG</p>
                </div>
             </div>
          </div>

          <AddressCard title="Départ" address={delivery.pickupLocation} contact={delivery.pickupContact} />
          <AddressCard title="Arrivée" address={delivery.dropoffLocation} contact={delivery.dropoffContact} />
        </div>

        {/* COLONNE CENTRE: Timeline */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-soft">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-10">Suivi du trajet</h3>
          <div className="relative space-y-12">
            <div className="absolute left-6 top-2 bottom-2 w-0.5 border-l-2 border-dashed border-slate-100 dark:border-slate-800" />
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-8">
                <div className={`w-12 h-12 bg-white dark:bg-slate-900 border-4 rounded-full z-10 flex items-center justify-center shadow-xl ${index <= activeStep ? "border-secondary" : "border-slate-100 dark:border-slate-800"}`}>
                    <div className={`w-2 h-2 rounded-full ${index <= activeStep ? "bg-secondary" : "bg-slate-200"}`} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${index <= activeStep ? "text-secondary" : "text-slate-400"}`}>{step.label}</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{step.time ? new Date(step.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "En attente"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE: Code de sécurité & Status */}
        <div className="lg:col-span-3 space-y-6">
          {delivery.verificationCode && !isCancelled && delivery.status !== 'DELIVERED' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border-2 border-dashed border-secondary/30 shadow-soft">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Code de sécurité</h4>
               <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 py-6 rounded-2xl">
                  <span className="text-3xl font-black tracking-[0.3em] text-secondary italic">
                    {delivery.verificationCode}
                  </span>
                  <button onClick={() => copyToClipboard(delivery.verificationCode)} className="p-3 bg-white dark:bg-slate-800 rounded-xl hover:text-secondary transition-colors">
                    {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>

      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} deliveryId={id} role="CLIENT" />
      
      {/* MODAL ANNULATION */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black italic text-center uppercase mb-2">Confirmer ?</h3>
            <p className="text-slate-500 text-center text-xs mb-8">Action irréversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-black uppercase">Retour</button>
              <button onClick={handleCancelOrder} disabled={isCancelling} className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-xs font-black uppercase shadow-lg">
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