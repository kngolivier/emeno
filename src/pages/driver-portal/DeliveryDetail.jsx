// FILE: src/pages/driver-portal/DeliveryDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
NPTQ_TEST
import { 
  MapPin, Phone, ShieldCheck, ChevronLeft, 
  Package, User, Loader2, CheckCircle2, Navigation,
  Clock, Hash, AlertCircle, Award, DollarSign, ShieldAlert
} from "lucide-react";
import { fetchDeliveryById, validateDelivery } from "../../api/deliveries.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import FeedbackModal from "../../components/modals/FeedbackModal";
import { CATEGORY_LABELS, STATUS_LABELS } from "../../constants/constants";

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
      if (res?.data) {
        setDelivery(res.data);
        // On log "res.data" car l'état "delivery" ne sera disponible qu'au prochain render
        console.log("Détails de la livraison chargée :", res.data);
      }
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
      await loadDelivery();
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
  const isFragile = delivery.packageDetails?.isFragile;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pb-32">
      <div className="max-w-md mx-auto p-5 space-y-6">
        
        {/* --- NAVIGATION & TITRE --- */}
        <header className="flex items-center gap-5 pt-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Hash size={12} className="text-secondary" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Mission</p>
            </div>
            <h1 className="text-2xl font-black text-primary dark:text-white italic uppercase tracking-tighter truncate leading-none">
              Détails <span className="text-secondary">#{delivery.orderNumber}</span>
            </h1>
          </div>
        </header>

        {/* --- CARTE TARIF & STATUS PRIORITAIRE --- */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className={`p-7 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all duration-700 ${isCompleted ? 'bg-emerald-500' : 'bg-primary'}`}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10 flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-white border border-white/20 italic">
                {STATUS_LABELS[delivery.status] || delivery.status}
              </span>
              <div className="mt-4">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest italic mb-0.5">Rémunération course</p>
                <h2 className="text-3xl font-black text-white italic truncate leading-none uppercase tracking-tighter">
                  {delivery.price ? `${delivery.price.toLocaleString('fr-FR')} FCFA` : "Tarif non défini"}
                </h2>
              </div>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl flex flex-col items-center justify-center min-w-[70px]">
              <DollarSign size={20} strokeWidth={2.5} className="text-secondary mb-1" />
              <span className="text-[9px] font-black uppercase tracking-wide">{delivery.payerType === "RECEIVER" ? "Recette" : "Cash"}</span>
            </div>
          </div>
        </motion.div>

        {/* --- BLOC DIRECTORY: CONTACTS DE L'AXE (Pickup & Dropoff) --- */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.2em] px-2 italic">Contacts de l'axe</p>
          
          {/* Expéditeur (Ajusté sur pickupContact) */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent dark:border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 font-bold text-xs">
                EX
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Expéditeur (Retrait)</p>
                <p className="text-sm font-black text-primary dark:text-white uppercase truncate italic">
                  {delivery.pickupContact?.name || "Non renseigné"}
                </p>
              </div>
            </div>
            {delivery.pickupContact?.phone && (
              <a 
                href={`tel:${delivery.pickupContact.phone}`}
                className="p-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-primary rounded-xl transition-all active:scale-90"
              >
                <Phone size={16} strokeWidth={3} fill="currentColor" />
              </a>
            )}
          </div>

          {/* Destinataire (Ajusté sur dropoffContact) */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent dark:border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                DE
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Destinataire (Dépôt)</p>
                <p className="text-sm font-black text-primary dark:text-white uppercase truncate italic">
                  {delivery.dropoffContact?.name || "À préciser"}
                </p>
              </div>
            </div>
            {delivery.dropoffContact?.phone && (
              <a 
                href={`tel:${delivery.dropoffContact.phone}`}
                className="p-3 bg-secondary/10 hover:bg-secondary text-secondary hover:text-primary rounded-xl transition-all active:scale-90"
              >
                <Phone size={16} strokeWidth={3} fill="currentColor" />
              </a>
            )}
          </div>
        </div>

        {/* --- BLOC ITINÉRAIRE INTERACTIF --- */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-8 shadow-sm relative">
          <div className="flex gap-5 relative">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-[6px] border-primary z-10 shadow-sm" />
              <div className="w-[2px] h-12 bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase text-slate-300 italic tracking-[0.2em] mb-1">Point de retrait ({delivery.pricingSnapshot?.from || "Départ"})</p>
              <p className="text-[13px] font-black text-primary dark:text-slate-200 uppercase leading-snug">{delivery.pickupLocation}</p>
            </div>
          </div>
          
          <div className="flex gap-5">
            <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-[6px] border-secondary z-10 shadow-sm" />
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase text-slate-300 italic tracking-[0.2em] mb-1">Destination finale ({delivery.pricingSnapshot?.to || "Arrivée"})</p>
              <p className="text-[13px] font-black text-primary dark:text-slate-200 uppercase leading-snug">{delivery.dropoffLocation}</p>
            </div>
          </div>

          <button className="w-full py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center gap-3 text-primary dark:text-white font-black text-[10px] uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-800 active:scale-[0.98] transition-all">
             <Navigation size={16} className="text-secondary" /> Lancer le GPS
          </button>
        </div>

        {/* --- INFOS CARACTÉRISTIQUES DU COLIS --- */}
        <div className="grid grid-cols-2 gap-4">
          {/* Type / Catégorie de colis traduit en français */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
             <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><Package size={14}/></div>
                <p className="text-[8px] font-black uppercase text-slate-400 italic">Type de colis</p>
             </div>
             <p className="text-xs font-black text-primary dark:text-slate-200 uppercase truncate italic leading-none">
               {CATEGORY_LABELS[delivery.packageDetails?.category] || "Standard"}
             </p>
          </div>

          {/* Mention Fragilité dynamique */}
          <div className={`p-5 rounded-[2rem] border shadow-sm flex flex-col justify-between transition-colors ${
            isFragile 
              ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30" 
              : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
          }`}>
             <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${isFragile ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                   <ShieldAlert size={14}/>
                </div>
                <p className="text-[8px] font-black uppercase text-slate-400 italic">Indication</p>
             </div>
             <p className={`text-xs font-black uppercase truncate italic leading-none ${isFragile ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
               {isFragile ? "⚠️ Colis Fragile" : "Non fragile"}
             </p>
          </div>
        </div>

        {/* --- MODULE DE VALIDATION SÉCURISÉ --- */}
        <AnimatePresence>
          {isInProgress && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border-4 border-secondary/20 relative"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-secondary/20">
                    <ShieldCheck size={32} className="text-secondary" strokeWidth={2.5} />
                </div>
                <h4 className="text-sm font-black text-primary dark:text-white uppercase italic tracking-widest">Validation Finale</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Saisissez le code fourni par le client</p>
              </div>

              <div className="relative mb-8">
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="------"
                  className="w-full bg-slate-50 dark:bg-[#0B1120] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl py-6 text-center text-4xl font-black tracking-[0.4em] text-primary dark:text-white focus:border-secondary focus:bg-white outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-800 shadow-inner"
                />
              </div>

              <button 
                disabled={code.length < 6 || isValidating}
                onClick={handleValidate}
                className="w-full bg-primary text-white py-6 rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-4"
              >
                {isValidating ? (
                  <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                ) : (
                  <Award size={20} strokeWidth={3} />
                )}
                {isValidating ? "Certification..." : "Confirmer la Livraison"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ÉCRAN DE RÉUSSITE --- */}
        {isCompleted && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-emerald-500/10 border-2 border-emerald-500/20 p-10 rounded-[3rem] text-center"
          >
             <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/40 rotate-12">
                <CheckCircle2 size={40} strokeWidth={3} />
             </div>
             <h3 className="text-2xl font-black text-emerald-600 uppercase italic tracking-tighter mb-2">Succès Total</h3>
             <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-[0.3em] leading-relaxed">
               La course a été archivée.<br/>Vos gains ont été mis à jour.
             </p>
          </motion.div>
        )}

        {/* BRANDING DISCRET */}
        <div className="pt-8 text-center opacity-10">
          <p className="text-[10px] font-black uppercase tracking-[1em] text-primary dark:text-white">EMENO SECURITY</p>
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => {
          setShowFeedback(false);
          navigate("/driver/deliveries");
        }}
        deliveryId={id}
        role="DRIVER"
      />
    </div>
  );
}