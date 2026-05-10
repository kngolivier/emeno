// FILE: src/pages/driver-portal/DriverDashboard.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, Clock, TrendingUp, Power, MapPin, 
  Package, Loader2, ChevronRight, X, Phone, ShieldCheck,
  Navigation
} from "lucide-react";
import { useDriver } from "../../hooks/useDriver";
import { useAuth } from "../../context/AuthContext";

// Import du composant global
import StatCard from "../../components/dashboard/StatCard";

export default function DriverDashboard() {
  const { user } = useAuth();
  const { 
    activeOrder, 
    loading, 
    isOnline, 
    toggleDuty, 
    advanceStatus,
    validateDelivery,
    stats = { dailyEarnings: 0, completedToday: 0 } 
  } = useDriver();

  const [showDetails, setShowDetails] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showDetails ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showDetails]);

  const handleVerify = async (e) => {
    if (e) e.stopPropagation();
    if (verificationCode.length !== 6) return;
    
    setIsValidating(true);
    try {
      await validateDelivery(activeOrder._id, verificationCode);
      setVerificationCode("");
      setShowDetails(false);
    } catch (error) {
      if (error.message?.includes('500') || error.message?.includes('autorisé')) {
        setShowDetails(false);
        setVerificationCode("");
      }
      console.error("Erreur post-validation:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const getActionButtonText = (status) => {
    switch (status) {
      case 'ASSIGNED': return "Récupérer le colis";
      case 'PICKED_UP': return "Démarrer la course";
      case 'IN_PROGRESS': return "Valider la livraison";
      default: return "Continuer la mission";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-xs font-black uppercase tracking-widest text-muted text-center">Chargement EMENO...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-primary-dark transition-colors duration-300">
      <div className="max-w-md mx-auto p-4 space-y-6 pb-32">
        
        {/* 1. Header */}
        <header className="flex justify-between items-center bg-white dark:bg-primary-light p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5">
          <div>
            <h1 className="text-xl font-black text-primary dark:text-white italic tracking-tighter">
              Salut, {user?.nom || 'Émilie'}
            </h1>
            <p className="text-[10px] text-muted font-black uppercase tracking-widest mt-1">
              {isOnline ? "• Service Actif" : "• Hors Service"}
            </p>
          </div>
          <button onClick={toggleDuty} className="relative active:scale-90 transition-transform">
             <div className={`p-3 rounded-2xl border-2 transition-all ${isOnline ? 'bg-success/10 border-success text-success shadow-lg shadow-success/20' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                <Power size={24} />
             </div>
          </button>
        </header>

        {/* 2. Statistiques (Utilisation du composant global) */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            title="Gains Jour" 
            value={`${stats.dailyEarnings?.toLocaleString('fr-FR') || "0"} F`} 
            icon={TrendingUp} 
            color="bg-secondary/10 text-secondary" 
          />
          <StatCard 
            title="Livraisons" 
            value={stats.completedToday?.toString().padStart(2, '0') || "00"} 
            icon={CheckCircle} 
            color="bg-primary/10 text-primary dark:text-white" 
          />
        </div>

        {/* 3. Section Mission */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mission Prioritaire</h3>
            {activeOrder && <span className="flex h-2 w-2 rounded-full bg-secondary animate-ping"/>}
          </div>
          
          {activeOrder ? (
            <div className="space-y-4">
              <motion.div 
                layoutId={activeOrder._id}
                onClick={() => setShowDetails(true)}
                className="bg-primary dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/10"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-black text-secondary-light uppercase tracking-tighter">#{activeOrder.orderNumber}</span>
                    </div>
                    <span className="bg-secondary text-white text-[9px] px-4 py-1.5 rounded-full font-black uppercase">
                      {activeOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-black text-white italic leading-none mb-1 truncate">{activeOrder.pickupLocation}</h4>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest flex items-center gap-2 mb-8">
                    <MapPin size={12} className="text-secondary" /> Vers {activeOrder.dropoffLocation}
                  </p>
                  
                  {activeOrder.status === 'IN_PROGRESS' ? (
                    <div className="bg-white/10 p-3 rounded-3xl backdrop-blur-md border border-white/10 space-y-3">
                      <p className="text-[9px] font-black text-center text-white/70 uppercase tracking-widest">Code client requis</p>
                      <div className="flex gap-2 w-full overflow-hidden">
                        <input 
                          type="text" inputMode="numeric" maxLength="6" placeholder="000000" 
                          value={verificationCode} 
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))} 
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 min-w-0 bg-white text-primary font-black text-center py-3 rounded-xl tracking-[0.4em] outline-none text-lg" 
                        />
                        <button 
                          onClick={handleVerify} 
                          disabled={verificationCode.length !== 6 || isValidating}
                          className="shrink-0 bg-secondary text-white px-5 rounded-xl active:scale-95 transition-transform flex items-center justify-center"
                        >
                          {isValidating ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20}/>}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); advanceStatus(); }}
                      className="w-full bg-white text-primary py-4 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
                    >
                      {getActionButtonText(activeOrder.status)}
                    </button>
                  )}
                </div>
                <Package size={150} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
              </motion.div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md p-4 flex items-end justify-center"
                    onClick={() => setShowDetails(false)}
                  >
                    <motion.div 
                      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white dark:bg-primary-dark w-full max-w-lg rounded-[3.5rem] shadow-2xl relative flex flex-col"
                      style={{ maxHeight: '92vh' }}
                    >
                      <div className="p-8 pb-4 flex justify-between items-center shrink-0">
                        <div>
                          <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Fiche de route</p>
                          <h2 className="text-2xl font-black text-primary dark:text-white italic tracking-tighter">#{activeOrder.orderNumber}</h2>
                        </div>
                        <button onClick={() => setShowDetails(false)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl"><X size={20}/></button>
                      </div>

                      <div className="px-8 pb-4 space-y-6 overflow-y-auto">
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-3xl flex gap-4 items-center">
                          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white"><Package size={20}/></div>
                          <p className="text-sm font-black text-primary dark:text-white italic">{activeOrder.packageDetails?.description}</p>
                        </div>

                        <div className="relative space-y-6 pl-4 border-l-2 border-dashed border-slate-200 ml-2">
                          <div>
                            <p className="text-[9px] font-black text-muted uppercase">Ramassage - {activeOrder.pickupCommune}</p>
                            <p className="text-sm font-black text-primary dark:text-white">{activeOrder.pickupLocation}</p>
                            <a href={`tel:${activeOrder.pickupContact?.phone}`} className="inline-flex items-center gap-2 text-[10px] font-black text-secondary mt-1"><Phone size={12}/> Appeler Expéditeur</a>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-muted uppercase">Livraison - {activeOrder.dropoffCommune}</p>
                            <p className="text-sm font-black text-primary dark:text-white">{activeOrder.dropoffLocation}</p>
                            <a href={`tel:${activeOrder.dropoffContact?.phone}`} className="inline-flex items-center gap-2 text-[10px] font-black text-primary dark:text-white mt-1"><Phone size={12}/> Appeler Destinataire</a>
                          </div>
                        </div>

                        <div className="p-5 rounded-[2rem] bg-secondary/10 border border-secondary/20 flex justify-between items-center">
                          <p className="text-xl font-black text-secondary italic">{activeOrder.totalAmount} FCFA</p>
                          <span className="text-[8px] font-black uppercase bg-primary text-white px-3 py-1 rounded-full">
                            {activeOrder.isPaid ? 'Payé' : 'À encaisser'} {activeOrder.payerType === "SENDER" ? " au ramassage" : " à la livraison"}
                          </span>
                        </div>
                        <div className="h-10 shrink-0" />
                      </div>

                      <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 shrink-0">
                        {activeOrder.status === 'IN_PROGRESS' ? (
                          <div className="flex gap-2 w-full">
                            <input 
                              type="text" inputMode="numeric" maxLength="6" placeholder="Code" 
                              value={verificationCode} 
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))} 
                              className="flex-1 min-w-0 bg-white text-primary font-black text-center py-4 rounded-2xl tracking-[0.4em] outline-none border-2 border-primary/10 text-lg" 
                            />
                            <button 
                              onClick={handleVerify} 
                              disabled={verificationCode.length !== 6 || isValidating}
                              className="shrink-0 bg-secondary text-white px-6 rounded-2xl flex items-center justify-center min-w-[70px]"
                            >
                              {isValidating ? <Loader2 className="animate-spin" size={24}/> : <ShieldCheck size={24}/>}
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <button 
                              onClick={() => { advanceStatus(); setShowDetails(false); }}
                              className="flex-1 bg-primary text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
                            >
                              {getActionButtonText(activeOrder.status)}
                            </button>
                            <button className="p-5 bg-white rounded-[2rem] text-primary shadow-sm active:scale-95 transition-transform">
                              <Navigation size={22} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white dark:bg-primary-light border-2 border-dashed border-slate-200 p-16 rounded-[3.5rem] text-center">
              <Clock className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">En attente de mission...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}