
// FILE: src/components/ui/PageLoader.jsx
import { motion } from "framer-motion";
import Loader from "./Loader";

export default function PageLoader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-white dark:bg-[#0B1120] transition-colors duration-500"
    >
      <div className="relative flex flex-col items-center">
        {/* Filigrane EMENO en arrière-plan du loader */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            <span className="text-8xl font-black text-slate-50 dark:text-white/[0.02] select-none tracking-tighter italic">
                EMENO
            </span>
        </div>
        
        <Loader size={60} text="Initialisation" />
        
        {/* Indicateur de progression discret en bas */}
        <div className="absolute bottom-12 w-32 h-[2px] bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-secondary to-transparent"
            />
        </div>
      </div>
    </motion.div>
  );
}