// src/components/ui/Loader.jsx
import { motion } from "framer-motion";

export default function Loader({ size = 40, text = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Effet d'aura pulsée (chic & moderne) */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1], 
            opacity: [0.5, 0, 0.5] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          }}
          className="absolute inset-0 rounded-full bg-secondary/30 blur-xl"
        />
        
        {/* Anneau de fond (piste) */}
        <div className="absolute inset-0 border-[3px] border-slate-100 dark:border-white/5 rounded-full" />

        {/* Spinner principal animé avec Framer Motion pour plus de fluidité */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
          className="absolute inset-0 border-[3px] border-transparent border-t-secondary rounded-full"
        />

        {/* Point central fixe ou pulsé */}
        <div className="absolute inset-[35%] bg-primary dark:bg-secondary rounded-full opacity-20 animate-pulse" />
      </div>

      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 italic"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}