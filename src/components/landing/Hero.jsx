// src/components/landing/Hero.jsx

import { motion } from "framer-motion";
import PriceEstimator from "./PriceEstimator";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto pt-24 lg:pt-40 pb-20 px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
      {/* Éléments de décor */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full -z-10 animate-pulse" />
      
      <motion.div 
        className="flex-1 space-y-6 lg:space-y-8 z-10 w-full"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-[#0B1120] backdrop-blur-md shadow-sm border border-slate-100 dark:border-white/5 rounded-full">
          <Sparkles size={14} className="text-secondary animate-pulse" />
          <span className="text-primary dark:text-white text-[10px] font-black uppercase tracking-[0.3em]">
            Logistique 2.0 au Gabon
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[100px] font-black text-primary dark:text-white leading-[0.85] tracking-tighter uppercase">
          <span className="text-secondary-light italic">VITE.</span> <br />
          <span className="text-secondary italic">FIABLE.</span> <br />
          <span className="text-secondary-light italic">SANS EFFORT.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-md leading-relaxed border-l-4 border-secondary/20 pl-6">
          EMENO propulse vos échanges à Libreville avec une précision chirurgicale. 
          <span className="text-secondary-light font-bold block mt-2">Le futur est en route.</span>
        </p>

        {/* <div className="flex items-center gap-6 pt-4">
          <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-[#050810] bg-slate-200" />
             ))}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">
            Déjà +500 livraisons <br/> réussies ce mois
          </p>
        </div> */}
      </motion.div>

      <motion.div 
        className="flex-1 flex justify-center w-full relative lg:mt-0 mt-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <PriceEstimator />
      </motion.div>
    </section>
  );
}