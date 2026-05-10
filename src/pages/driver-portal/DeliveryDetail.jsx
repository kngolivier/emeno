// FILE: src/pages/driver-portal/DeliveryDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, Phone, ShieldCheck, ChevronLeft, 
  Package, User, Loader2, CheckCircle2 
} from "lucide-react";
import { fetchDeliveryById, validateDelivery } from "../../api/deliveries.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import FeedbackModal from "../../components/modals/FeedbackModal";
import { STATUS_COLORS, STATUS_LABELS } from "../../constants/constants";

export default function DeliveryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [delivery, setDelivery] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadDelivery = async () => {
    setLoading(true);
    try {
      const res = await fetchDeliveryById(id);
      setDelivery(res?.data);
    } catch (err) {
      notifyError("Impossible de charger la livraison");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDelivery();
  }, [id]);

  const handleValidate = async () => {
    if (code.length < 6) return;
    
    setIsValidating(true);
    try {
      await validateDelivery(id, code);
      notifySuccess("Livraison validée avec succès !");
      
      // On rafraîchit les données pour passer au statut DELIVERED
      await loadDelivery();
      
      // On déclenche la modal de feedback pour le livreur
      setShowFeedback(true);
    } catch (err) {
      notifyError(err.message || "Code de sécurité incorrect");
    } finally {
      setIsValidating(false);
    }
  };

  if (loading && !delivery) return <PageLoader />;
  if (!delivery) return null;

  const isCompleted = delivery.status === "DELIVERED";
  const isInProgress = delivery.status === "IN_PROGRESS";

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      
      {/* HEADER & RETOUR */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-all shadow-sm"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Détails de la course</p>
          <h1 className="text-xl font-black text-primary dark:text-white italic uppercase tracking-tighter">
            Commande <span className="text-secondary">#</span>{delivery.orderNumber}
          </h1>
        </div>
      </div>

      {/* STATUS CARD */}
      <div className={`p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden transition-all ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl text-white" />
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/30">
            {STATUS_LABELS[delivery.status]}
          </span>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest italic">Client</p>
              <h2 className="text-2xl font-black text-white italic truncate">{delivery.client?.nom || "Client EMENO"}</h2>
            </div>
            <a 
              href={`tel:${delivery.client?.telephone}`}
              className="p-4 bg-secondary text-primary rounded-2xl shadow-lg active:scale-90 transition-transform"
            >
              <Phone size={20} fill="currentColor" />
            </a>
          </div>
        </div>
      </div>

      {/* ITINÉRAIRE */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-6 shadow-soft">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-primary border-4 border-primary/20" />
            <div className="w-0.5 h-10 bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase text-slate-400 italic tracking-widest">Ramassage</p>
            <p className="text-sm font-bold text-primary dark:text-slate-200 uppercase leading-tight mt-1">{delivery.pickupLocation}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="w-4 h-4 rounded-full bg-secondary border-4 border-secondary/20 shadow-[0_0_10px_rgba(252,176,69,0.4)]" />
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase text-slate-400 italic tracking-widest">Destination</p>
            <p className="text-sm font-bold text-primary dark:text-slate-200 uppercase leading-tight mt-1">{delivery.dropoffLocation}</p>
          </div>
        </div>
      </div>

      {/* INFOS COLIS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
           <Package size={16} className="text-secondary mb-2" />
           <p className="text-[8px] font-black uppercase text-slate-400 italic">Colis</p>
           <p className="text-xs font-black text-primary dark:text-slate-200 uppercase truncate">{delivery.packageDetails?.category}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
           <User size={16} className="text-secondary mb-2" />
           <p className="text-[8px] font-black uppercase text-slate-400 italic">Destinataire</p>
           <p className="text-xs font-black text-primary dark:text-slate-200 uppercase truncate">{delivery.dropoffContact?.name || "N/A"}</p>
        </div>
      </div>

      {/* VALIDATION ACTION */}
      {isInProgress && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-secondary/20 animate-in zoom-in-95 duration-500">
          <div className="text-center mb-6">
            <ShieldCheck size={32} className="mx-auto text-secondary mb-2" />
            <h4 className="text-sm font-black text-primary dark:text-white uppercase italic">Validation Sécurisée</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Demandez le code au destinataire</p>
          </div>

          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            placeholder="......"
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-center text-3xl font-black tracking-[0.4em] text-primary dark:text-white focus:border-secondary outline-none transition-all placeholder:text-slate-200"
          />

          <button 
            disabled={code.length < 6 || isValidating}
            onClick={handleValidate}
            className="w-full mt-6 bg-primary py-5 rounded-2xl text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {isValidating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            {isValidating ? "Vérification..." : "Valider la remise"}
          </button>
        </div>
      )}

      {/* ETAT FINAL (SUCCÈS) */}
      {isCompleted && (
        <div className="bg-green-50 dark:bg-green-500/10 border-2 border-green-500/20 p-8 rounded-[2.5rem] text-center">
           <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
              <CheckCircle2 size={32} />
           </div>
           <h3 className="text-xl font-black text-green-600 uppercase italic">Course Terminée</h3>
           <p className="text-[10px] text-green-600/60 font-black uppercase tracking-widest mt-1">Merci pour votre excellent travail !</p>
        </div>
      )}

      {/* FEEDBACK MODAL (Livreur vers Client) */}
      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => {
          setShowFeedback(false);
          navigate("/driver/deliveries"); // Redirection après feedback
        }}
        deliveryId={id}
        role="DRIVER" // Précise le rôle pour charger les tags "Livreur"
      />

    </div>
  );
}