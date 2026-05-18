// FILE: src/pages/driver-portal/DriverDashboard.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, Clock, TrendingUp, Power, MapPin, 
  Package, Loader2, X, Phone, ShieldCheck, Navigation,
  ChevronRight, Info, AlertCircle, Coffee, Play, Award,
  Coins, Wallet, User
} from "lucide-react";
import { useDriver } from "../../hooks/useDriver";
import { useAuth } from "../../context/AuthContext";
import { CATEGORY_LABELS } from "../../constants/constants";
import FeedbackModal from "../../components/feedback/FeedbackModal";

export default function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    activeOrders, 
    maxCapacity,
    loading, 
    isOnline, 
    toggleDuty, 
    advanceStatus,
    validateDelivery,
    togglePause,
    isPaused,
    updatingState,
    stats = { completed: 0, total: 0, distance: 0 }
  } = useDriver();

  // Évaluation dynamique de l'état effectif pour forcer l'état BUSY à saturation
  const isDriverOnline = user?.driverState && user?.driverState !== "OFFLINE";
  const effectiveDriverState = (isDriverOnline && activeOrders.length >= maxCapacity) 
    ? "BUSY" 
    : user?.driverState;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const scrollRef = useRef(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState("");

  useEffect(() => {
    document.body.style.overflow = selectedOrder ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedOrder]);

  useEffect(() => {
    if (isInputFocused && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 300);
    }
  }, [isInputFocused]);

  const handleVerify = async (e) => {
    if (e) e.stopPropagation();
    if (verificationCode.length !== 6 || !selectedOrder) return;
    
    setIsValidating(true);
    const orderId = selectedOrder._id;
    try {
      await validateDelivery(orderId, verificationCode);
      setCompletedOrderId(orderId);
      setVerificationCode("");
      setSelectedOrder(null);
      setShowFeedbackModal(true);
    } catch (error) {
      console.error("Erreur de validation de la course :", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedbackModal(false);
    setCompletedOrderId("");
    navigate(`/driver/deliveries`);
  };

  const getActionButtonText = (status) => {
    switch (status) {
      case 'ASSIGNED': return "Récupérer le colis";
      case 'PICKED_UP': return "Démarrer la course";
      case 'IN_PROGRESS': return "Terminer la livraison";
      default: return "Continuer";
    }
  };

  const getPayerLabel = (type) => {
    switch (type) {
      case 'SENDER': return "Expéditeur";
      case 'RECEIVER': return "Destinataire";
      default: return "Non spécifié";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-10 text-center">
        <div className="relative">
            <Loader2 className="animate-spin text-secondary" size={48} strokeWidth={3} />
            <div className="absolute inset-0 blur-xl bg-secondary/20 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Synchronisation EMENO en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-300 overflow-x-hidden">
      <div className="max-w-md mx-auto p-5 space-y-6 pb-32">
        
        {/* --- 1. HEADER OPÉRATIONNEL --- */}
        <header className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Espace Coursier</span>
              <h1 className="text-xl font-black text-primary dark:text-white italic tracking-tighter truncate uppercase leading-none">
                Salut, {user?.prenom || 'Livreur'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <span className={`w-2 h-2 rounded-full ${
                effectiveDriverState === 'BUSY' ? 'bg-amber-500 animate-pulse' :
                effectiveDriverState === 'IDLE' ? 'bg-emerald-500 animate-pulse' :
                effectiveDriverState === 'PAUSE' ? 'bg-blue-500' : 'bg-slate-300'
              }`} />
              <p className="text-[9px] text-slate-500 dark:text-slate-300 font-black uppercase tracking-widest">
                {effectiveDriverState === 'BUSY' ? "En Course" :
                 effectiveDriverState === 'IDLE' ? "Disponible" :
                 effectiveDriverState === 'PAUSE' ? "En Pause" : "Hors Ligne"}
              </p>
            </div>
          </div>

          <div className="w-full">
            {updatingState ? (
              <button disabled className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 py-4 rounded-2xl flex items-center justify-center gap-2 border border-slate-200/50 dark:border-slate-700">
                <Loader2 className="animate-spin text-slate-400" size={18} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Mise à jour...</span>
              </button>
            ) : effectiveDriverState === "BUSY" ? (
              <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 py-4 px-5 rounded-2xl flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <Package size={18} strokeWidth={2.5} className="animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Livraison en cours</span>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 bg-amber-500 text-white rounded-lg italic shadow-sm">
                  {activeOrders.length}/{maxCapacity}
                </span>
              </div>
            ) : !isOnline ? (
              <button 
                onClick={toggleDuty}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
              >
                <Power size={16} strokeWidth={3} />
                Prendre mon service
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={togglePause}
                  className={`flex-1 py-4 px-4 rounded-2xl border-2 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    isPaused 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {isPaused ? (
                    <>
                      <Play size={14} strokeWidth={3} fill="currentColor" />
                      Reprendre
                    </>
                  ) : (
                    <>
                      <Coffee size={14} strokeWidth={3} />
                      Prendre une Pause
                    </>
                  )}
                </button>

                <button 
                  onClick={toggleDuty}
                  className="bg-slate-50 border border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 p-4 rounded-2xl active:scale-[0.95] transition-all"
                  title="Terminer le service"
                >
                  <Power size={18} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* --- 2. STATS RAPIDES --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl"><CheckCircle size={16}/></div>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Réussies</span>
            </div>
            <p className="text-2xl font-black text-primary dark:text-white italic leading-none">
              {stats.completed?.toString().padStart(2, '0')}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-secondary/10 text-secondary rounded-xl"><TrendingUp size={16}/></div>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Aujourd'hui</span>
            </div>
            <p className="text-2xl font-black text-primary dark:text-white italic leading-none">
              {stats.total?.toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* --- 3. MISSIONS EN COURS --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Missions Prioritaires</h3>
            {activeOrders.length > 0 && <span className="w-5 h-[1px] bg-slate-200 dark:bg-slate-800 flex-1 ml-4" />}
          </div>
          
          <AnimatePresence mode="popLayout">
            {activeOrders.length > 0 ? (
              <div className="space-y-4">
                {[...activeOrders].reverse().map((order) => (
                  <motion.div 
                    key={order._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedOrder(order)}
                    className="bg-primary dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden border border-white/5 cursor-pointer group active:scale-[0.98] transition-transform"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-6">
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl">
                          <span className="text-[9px] font-black text-secondary uppercase tracking-widest">#{order.orderNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[8px] font-black text-white/70 uppercase italic tracking-tighter">
                                {order.status?.replace('_', ' ')}
                            </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mb-6">
                          <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Destination</p>
                          <h4 className="text-xl font-black text-white italic truncate pr-4 leading-tight">{order.dropoffLocation}</h4>
                      </div>
                      
                      <div className="flex gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); advanceStatus(order); }}
                            className="flex-1 bg-white text-primary py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary transition-colors"
                          >
                            {getActionButtonText(order.status)}
                          </button>
                          <div className="bg-white/10 p-4 rounded-2xl text-white flex items-center justify-center">
                              <ChevronRight size={18} strokeWidth={3} />
                          </div>
                      </div>
                    </div>
                    <Package size={120} className="absolute -right-6 -bottom-6 text-white/5 -rotate-12 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900/50 border-2 border-dashed border-slate-100 dark:border-slate-800 p-12 rounded-[3.5rem] text-center"
              >
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-slate-200 dark:text-slate-700" size={32} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Prêt pour une nouvelle mission ?</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- 4. MODALE DE MISSION --- */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/60 dark:bg-black/90 backdrop-blur-md p-4 flex items-end sm:items-center justify-center"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] shadow-2xl relative flex flex-col max-h-[90vh] border-t-4 border-secondary overflow-hidden"
            >
              <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                <div>
                  <span className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] block mb-1 italic">Feuille de route</span>
                  <h2 className="text-3xl font-black text-primary dark:text-white italic tracking-tighter uppercase leading-none">#{selectedOrder.orderNumber}</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 active:rotate-90 transition-all"><X size={24}/></button>
              </div>

              <div ref={scrollRef} className="px-8 pb-10 space-y-7 overflow-y-auto custom-scrollbar">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-primary/5 dark:bg-primary/20 text-secondary rounded-xl">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Montant</span>
                      <p className="text-sm font-black text-primary dark:text-white italic">
                        {selectedOrder.price ? `${selectedOrder.price} XAF` : "0 XAF"}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    selectedOrder.isPaid 
                      ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-amber-500/5 border-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    <div className="p-2 bg-current/10 rounded-xl">
                      <Coins size={18} />
                    </div>
                    <div>
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Qui Paie ?</span>
                      <p className="text-[10px] font-black uppercase tracking-wide truncate">
                        {selectedOrder.isPaid ? "Déjà Payé" : getPayerLabel(selectedOrder.payerType)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex gap-4 items-center border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-secondary"><Package size={22}/></div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Catégorie</p>
                    <p className="text-sm font-black text-primary dark:text-white italic">
                      {CATEGORY_LABELS[selectedOrder.packageDetails?.category] || "Standard"}
                    </p>
                  </div>
                </div>

                <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-[6px] border-emerald-500 z-10" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Point de retrait</p>
                    <div className="flex items-center gap-1.5 mb-1 text-primary dark:text-slate-300">
                      <User size={12} className="text-slate-400" />
                      <span className="text-xs font-bold italic">{selectedOrder.pickupContact?.name || "Expéditeur inconnu"}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 leading-snug">{selectedOrder.pickupLocation}</p>
                    {selectedOrder.pickupContact?.phone && (
                      <a href={`tel:${selectedOrder.pickupContact.phone}`} className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-black text-[9px] uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 active:scale-95 transition-all">
                          <Phone size={12} strokeWidth={3} /> Appeler l'expéditeur
                      </a>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-[6px] border-secondary z-10" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Destination finale</p>
                    <div className="flex items-center gap-1.5 mb-1 text-primary dark:text-slate-300">
                      <User size={12} className="text-slate-400" />
                      <span className="text-xs font-bold italic">{selectedOrder.dropoffContact?.name || "Destinataire inconnu"}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 leading-snug">{selectedOrder.dropoffLocation}</p>
                    {selectedOrder.dropoffContact?.phone && (
                      <a href={`tel:${selectedOrder.dropoffContact.phone}`} className="inline-flex items-center gap-2 px-3 py-2 bg-primary/5 dark:bg-secondary/10 text-primary dark:text-secondary rounded-xl font-black text-[9px] uppercase tracking-widest border border-primary/5 dark:border-secondary/20 active:scale-95 transition-all">
                          <Phone size={12} strokeWidth={3} /> Appeler le destinataire
                      </a>
                    )}
                  </div>
                </div>

                {selectedOrder.notes && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-500/5 rounded-2xl flex gap-3 border border-rose-100 dark:border-rose-500/10">
                        <AlertCircle size={16} className="text-rose-500 shrink-0" />
                        <p className="text-[11px] font-bold text-rose-600/80 italic leading-relaxed">{selectedOrder.notes}</p>
                    </div>
                )}

                {selectedOrder.status === 'IN_PROGRESS' ? (
                  <div className="pt-1 space-y-5">
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-[2.2rem] border-2 border-secondary/20">
                        <div className="text-center mb-4">
                            <p className="text-[10px] font-black text-primary dark:text-white uppercase tracking-[0.3em] italic">Code de Validation</p>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text" inputMode="numeric" maxLength="6" placeholder="000000" 
                                value={verificationCode} 
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))} 
                                className="w-full bg-white dark:bg-slate-900 text-primary dark:text-white font-black text-center py-4 rounded-[1.2rem] tracking-[0.4em] text-lg outline-none border-2 border-slate-100 dark:border-slate-700 focus:border-secondary transition-all shadow-inner" 
                            />
                            <button 
                                onClick={handleVerify} 
                                disabled={verificationCode.length !== 6 || isValidating}
                                className="bg-secondary text-primary px-5 rounded-[1.2rem] shadow-xl shadow-secondary/20 disabled:opacity-50 active:scale-90 transition-all flex items-center justify-center"
                            >
                                {isValidating ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={24} strokeWidth={3}/>}
                            </button>
                        </div>
                    </div>
                    {isInputFocused && <div className="h-40" />}
                  </div>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => advanceStatus(selectedOrder)}
                      className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-[0.95] transition-all"
                    >
                      {getActionButtonText(selectedOrder.status)}
                    </button>
                    <button className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-primary dark:text-white active:scale-90 transition-all border border-slate-200 dark:border-slate-700">
                      <Navigation size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedback}
        deliveryId={completedOrderId}
        role="DRIVER"
      />
    </div>
  );
}