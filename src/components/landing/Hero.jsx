// src/components/landing/Hero.jsx
import { motion } from "framer-motion";
import PriceEstimator from "./PriceEstimator";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto pt-32 lg:pt-48 pb-20 px-8 flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
      {/* Éléments de décor flottants */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full -z-10 animate-pulse" />
      
      <motion.div 
        className="flex-1 space-y-8 z-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-md shadow-sm border border-slate-100 rounded-full">
          <Sparkles size={14} className="text-secondary animate-pulse" />
          <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            Logistique 2.0 au Gabon
          </span>
        </div>
        
        <h1 className="text-6xl lg:text-[100px] font-black text-primary leading-[0.8] tracking-tighter uppercase">
          <span className="text-secondary-light italic">VITE.</span>. <br />
          <span className="text-secondary italic">FIABLE.</span> <br />
          <span className="text-secondary-light italic">SANS EFFORT.</span>
        </h1>
        
        <p className="text-xl text-slate-400 font-medium max-w-md leading-relaxed border-l-4 border-secondary/20 pl-6">
          EMENO propulse vos échanges à Libreville avec une précision chirurgicale. 
          <span className="text-secondary-light font-bold"> Le futur est en route.</span>
        </p>

        <div className="flex items-center gap-6 pt-4">
          <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-4 border-[#F8FAFC] bg-slate-200" />
             ))}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
            Déjà +500 livraisons <br/> réussies ce mois
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="flex-1 flex justify-center w-full relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Badge flottant "Premium" */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-6 -right-6 bg-primary text-white px-6 py-4 rounded-[2rem] shadow-2xl z-20 hidden lg:flex items-center gap-3 border border-white/10"
        >
          <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Service <br/> Garanti</span>
        </motion.div>
        
        <PriceEstimator />
      </motion.div>
    </section>
  );
}