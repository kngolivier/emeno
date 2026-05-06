// FILE: src/pages/driver-portal/DriverMap.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Navigation, Phone, MessageSquare, 
  ChevronUp, Map as MapIcon, Info, CheckCircle 
} from "lucide-react";
import { useDriver } from "../../hooks/useDriver";

export default function DriverMap() {
  const { activeOrder } = useDriver();
  const [isExpanded, setIsExpanded] = useState(false);

  // Vue si aucune mission n'est en cours
  if (!activeOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-6">
          <MapIcon size={32} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-black text-primary dark:text-white italic tracking-tighter">Aucun trajet actif</h2>
        <p className="text-xs font-bold text-muted mt-2 uppercase tracking-widest">Activez votre service pour recevoir une mission</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-180px)] w-full overflow-hidden rounded-[3rem] shadow-2xl border border-white/10">
      
      {/* 1. FAUSSE CARTE (À remplacer par Google Maps / Leaflet) */}
      <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-center opacity-30">
          <Navigation size={48} className="mx-auto mb-4 animate-bounce text-primary dark:text-white" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Moteur de navigation actif</p>
        </div>
        {/* Placeholder pour le point de destination */}
        <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-secondary rounded-full shadow-[0_0_20px_rgba(255,107,0,0.6)] animate-pulse" />
      </div>

      {/* 2. OVERLAY : INSTRUCTIONS DE NAVIGATION */}
      <div className="absolute top-6 left-6 right-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-primary/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/20">
            <Navigation size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Prochaine étape</p>
            <p className="text-sm font-black text-white italic">{activeOrder.status === 'PICKED_UP' ? 'Vers la destination' : 'Vers le point de ramassage'}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-lg font-black text-secondary italic leading-none">12</p>
            <p className="text-[8px] font-black text-white/30 uppercase">min</p>
          </div>
        </motion.div>
      </div>

      {/* 3. ACTIONS FLOTTANTES (Contact Support/Client) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <button className="p-4 bg-white dark:bg-primary-light rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 text-primary dark:text-white active:scale-90">
          <Phone size={20} />
        </button>
        <button className="p-4 bg-white dark:bg-primary-light rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 text-primary dark:text-white active:scale-90">
          <MessageSquare size={20} />
        </button>
      </div>

      {/* 4. DRAWER D'INFORMATION DE MISSION */}
      <motion.div 
        animate={{ height: isExpanded ? 'auto' : '100px' }}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-primary-light rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] px-8 pb-8"
      >
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-center py-4"
        >
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full" />
        </button>

        <div className="flex justify-between items-start mb-6">
          <div className="max-w-[70%]">
            <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Destination actuelle</p>
            <h3 className="text-lg font-black text-primary dark:text-white italic tracking-tighter leading-tight">
              {activeOrder.status === 'PICKED_UP' ? activeOrder.dropoffLocation : activeOrder.pickupLocation}
            </h3>
          </div>
          <div className="bg-success/10 px-3 py-1.5 rounded-xl border border-success/20">
             <p className="text-[10px] font-black text-success italic">{activeOrder.totalAmount} F</p>
          </div>
        </div>

        {isExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mb-8 pt-4 border-t border-slate-50 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-muted"><Info size={18}/></div>
              <div>
                <p className="text-[9px] font-black text-muted uppercase">Client</p>
                <p className="text-xs font-black text-primary dark:text-white italic">{activeOrder.dropoffContact?.name || "Client EMENO"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-muted"><MapIcon size={18}/></div>
              <div>
                <p className="text-[9px] font-black text-muted uppercase">Détails colis</p>
                <p className="text-xs font-black text-primary dark:text-white italic">{activeOrder.packageDetails?.description || "Colis standard"}</p>
              </div>
            </div>
          </motion.div>
        )}

        <button className="w-full bg-primary dark:bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-[0.98] transition-transform">
          <CheckCircle size={18} className="text-secondary" />
          Arrivé sur place
        </button>
      </motion.div>
    </div>
  );
}