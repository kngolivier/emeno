// FILE: src/pages/client-portal/ClientOrderDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDeliveryById, cancelDelivery } from "../../api/deliveries.api";
import { 
  Truck, MapPin, Package, Clock, ShieldCheck, 
  ChevronLeft, XCircle, AlertTriangle, Loader2 
} from "lucide-react";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";

export default function ClientOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fonction pour charger ou rafraîchir les données
  const loadDelivery = async () => {
    try {
      const res = await fetchDeliveryById(id);
      setDelivery(res?.data);
    } catch (err) {
      notifyError("Erreur lors du chargement de la commande");
    }
  };

  useEffect(() => {
    loadDelivery();
  }, [id]);

  if (!delivery) return <PageLoader />;
  const steps = [
    { label: "Créée", time: delivery.createdAt },
    { label: "Assignée", time: delivery.timestampsLog?.assignedAt },
    { label: "Récupérée", time: delivery.timestampsLog?.pickedUpAt },
    { label: "En cours", time: delivery.timestampsLog?.inProgressAt },
    { label: "Livrée", time: delivery.timestampsLog?.deliveredAt },
  ];

  const activeStep = ["PENDING", "ASSIGNED", "PICKED_UP", "IN_PROGRESS", "DELIVERED"].indexOf(delivery.status);

  // Une commande peut être annulée seulement si elle n'est pas encore récupérée
  const canCancel = ["PENDING", "ASSIGNED"].includes(delivery.status);

  const handleCancelOrder = async () => {
    try {
      // TODO: Ajouter la redirection vers le dashboard
      setIsCancelling(true);
      await cancelDelivery(id);
      notifySuccess("Commande annulée avec succès");
      setShowCancelModal(false);
      loadDelivery(); // On rafraîchit pour voir le statut CANCELLED
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* HEADER CARD */}
      <div className="bg-white border-2 border-slate-50 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between shadow-soft gap-4 sm:gap-6">
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
          {/* Bouton retour plus compact sur mobile */}
          <button 
            onClick={() => navigate("/client/orders")} 
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm shrink-0"
          >
            <ChevronLeft size={20} sm:size={24} strokeWidth={3} />
          </button>
          
          <div className="min-w-0"> {/* min-w-0 permet au texte de tronquer si besoin */}
            <h1 className="text-xl sm:text-3xl font-black text-primary italic tracking-tighter truncate">
              Commande <span className="text-secondary">#</span>{delivery.orderNumber}
            </h1>
            <p className="text-[9px] sm:text-xs font-black uppercase text-slate-300 tracking-widest mt-1 flex items-center gap-2">
              <Clock size={10} sm:size={12} /> {new Date(delivery.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* BLOC ACTIONS : Ajusté pour être compact et flexible */}
        <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-end">
          {/* BOUTON ANNULER : Plus petit et sans texte sur très petits écrans si nécessaire */}
          {canCancel && (
            <button 
              onClick={() => setShowCancelModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-widest text-red-500 border-2 border-red-50 hover:bg-red-500 hover:text-white transition-all flex-1 md:flex-none"
            >
              <XCircle size={14} sm:size={16} /> 
              <span>Annuler</span> {/* Texte raccourci pour mobile */}
            </button>
          )}

          {/* BADGE STATUT : Moins de padding horizontal */}
          <span className={`flex-1 md:flex-none text-center px-4 py-2.5 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-widest border-2 whitespace-nowrap 
            ${delivery.status === 'DELIVERED' ? 'bg-success/10 text-success border-success/20' : 
              delivery.status === 'CANCELLED' ? 'bg-slate-100 text-slate-400 border-slate-200' :
              'bg-secondary/10 text-secondary border-secondary/20'}`}>
            {delivery.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TIMELINE */}
        <div className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-soft">
          <h2 className="font-black text-primary uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
            <Truck size={16} className="text-secondary" /> Suivi Expédition
          </h2>
          <div className="space-y-8 relative">
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-100" />
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 relative z-10">
                <div className={`mt-1.5 w-5 h-5 rounded-full border-4 bg-white transition-all duration-500
                  ${index <= activeStep ? "border-secondary scale-110 shadow-lg shadow-secondary/20" : "border-slate-100"}`} />
                <div>
                  <p className={`text-sm font-black uppercase tracking-tight ${index <= activeStep ? "text-primary" : "text-slate-300"}`}>{step.label}</p>
                  <p className="text-[10px] font-bold text-slate-400">{step.time ? new Date(step.time).toLocaleString() : "..."}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLIS & CODE */}
        <div className="space-y-8 lg:col-span-2">
          <div className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-soft">
            <h2 className="font-black text-primary uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <Package size={16} className="text-secondary" /> Informations Colis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <InfoBox label="Catégorie" value={delivery.packageDetails?.category} />
              <InfoBox label="Poids" value={`${delivery.packageDetails?.weight || "-"} KG`} />
              <InfoBox label="Fragile" value={delivery.packageDetails?.isFragile ? "OUI" : "NON"} isAlert={delivery.packageDetails?.isFragile} />
            </div>

            {/* CODE DE SÉCURITÉ - Version ultra-compacte */}
            {delivery.verificationCode && delivery.status !== 'CANCELLED' && (
              <div className="bg-secondary/5 border-2 border-secondary/10 rounded-[1.5rem] p-3.5 sm:p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-4 text-secondary shrink-0">
                  <ShieldCheck size={18} sm:size={24} className="shrink-0" />
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider leading-tight">
                    Code <br className="sm:hidden" /> Sécurité
                  </span>
                </div>
                
                {/* 
                  Réduction de text-xl à text-lg sur mobile 
                  Réduction du tracking de 0.2em à normal sur mobile
                */}
                <span className="text-lg sm:text-2xl font-black text-primary tracking-normal sm:tracking-widest tabular-nums bg-white/50 px-3 py-1 rounded-lg border border-secondary/5">
                  {delivery.verificationCode}
                </span>
              </div>
            )}

            {delivery.status === 'CANCELLED' && (
              <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 flex items-center gap-4 text-slate-400">
                <XCircle size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Cette commande a été annulée</span>
              </div>
            )}
          </div>

          {/* ADRESSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AddressCard title="Enlèvement" address={delivery.pickupLocation} color="primary" />
            <AddressCard title="Destination" address={delivery.dropoffLocation} color="secondary" />
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMATION */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-primary italic tracking-tighter mb-2">Annuler la commande ?</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Êtes-vous sûr de vouloir annuler cette livraison ? Cette action est irréversible et le livreur en sera informé.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all"
              >
                Retour
              </button>
              <button 
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isCancelling ? <Loader2 className="animate-spin" size={16} /> : "Confirmer"}
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
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
      <p className={`text-lg font-black italic ${isAlert ? "text-red-500" : "text-primary"}`}>{value}</p>
    </div>
  );
}

function AddressCard({ title, address, color }) {
  return (
    <div className="bg-white border border-slate-50 rounded-[2rem] p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${color === 'primary' ? 'bg-primary' : 'bg-secondary'}`}>
          <MapPin size={14} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h3>
      </div>
      <p className="text-sm font-bold text-primary leading-relaxed">{address}</p>
    </div>
  );
}