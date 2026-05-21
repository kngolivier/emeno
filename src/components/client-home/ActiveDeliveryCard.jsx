import { Truck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { STATUS_LABELS } from "../../constants/constants";

const orderSteps = ["ASSIGNED", "PICKED_UP", "IN_PROGRESS", "DELIVERED"];

export default function ActiveDeliveryCard({ delivery }) {
  const navigate = useNavigate();

  if (!delivery) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10 p-10 text-center bg-white dark:bg-[#071120]">
        <Truck size={32} className="mx-auto text-slate-300 dark:text-white/20" />
        <p className="mt-4 font-bold text-slate-500 dark:text-white/40">Aucune livraison active</p>
      </div>
    );
  }

  const activeIdx = orderSteps.indexOf(delivery.status);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#061120] mt-5 shadow-lg"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.05),transparent_40%)]" />
      
      <div className="relative z-10 flex flex-col md:flex-row">
        {/* Image / Icone Section (Compacte sur mobile) */}
        <div className="relative min-h-[140px] md:min-h-[auto] md:w-[220px] overflow-hidden flex items-center justify-center bg-primary">
           <img 
             src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600" 
             className="absolute inset-0 w-full h-full object-cover opacity-20" 
             alt="delivery"
           />
           <div className="relative w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Truck size={28} className="text-white" />
           </div>
        </div>

        {/* Contenu */}
        <div className="p-6 md:p-8 flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-black italic uppercase text-primary dark:text-white">#{delivery.orderNumber}</h2>
              <p className="mt-2 text-xs uppercase font-bold text-slate-400">Destination</p>
              <h3 className="font-bold text-base mt-0.5 dark:text-white truncate max-w-[200px]">
                {delivery.dropoffLocation || "Non spécifiée"}
                {delivery.pricingSnapshot?.to ? `, ${delivery.pricingSnapshot.to}` : ""}
              </h3>
            </div>
            <button 
              onClick={() => navigate(`/client/orders/${delivery._id}`)} 
              className="h-10 px-4 rounded-xl bg-secondary text-white font-black text-sm flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
            >
              Suivre <ArrowRight size={14} />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4 inline-flex px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary font-black text-[10px] uppercase tracking-wider">
            {STATUS_LABELS[delivery.status] || "En cours"}
          </div>

          {/* Timeline */}
          <div className="flex justify-between mt-8 relative">
             {/* Ligne de fond */}
             <div className="absolute top-5 left-0 right-0 h-[2px] bg-slate-200 dark:bg-white/10 mx-6" />
             
             {orderSteps.map((step, idx) => {
               const isDone = idx <= activeIdx;
               return (
                 <div key={step} className="relative z-10 flex flex-col items-center">
                   <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${isDone ? "border-secondary bg-white dark:bg-[#061120]" : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#061120]"}`}>
                     <div className={`w-3 h-3 rounded-full ${isDone ? "bg-secondary" : "bg-slate-300 dark:bg-white/10"}`} />
                   </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}