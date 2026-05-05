// src/components/ui/Loader.jsx
import { motion } from "framer-motion";

export default function Loader({ size = 40, text = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Anneau extérieur pulsé */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-secondary/20"
        />
        
        {/* Spinner principal */}
        <div 
          className="w-full h-full border-[3px] border-slate-100 border-t-secondary rounded-full animate-spin"
        />
      </div>

      {text && (
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
          {text}
        </p>
      )}
    </div>
  );
}