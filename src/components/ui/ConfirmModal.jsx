// src/components/ui/ConfirmModal.jsx
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmation", 
  message = "Êtes-vous sûr de vouloir effectuer cette action ?", 
  loading = false,
  variant = "danger" // 'danger' ou 'warning'
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop avec flou prononcé */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/60 dark:bg-black/80 backdrop-blur-xl" 
            onClick={!loading ? onClose : null} 
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-[#0B1120] w-full max-w-sm rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] p-8 lg:p-10 overflow-hidden border border-white/10"
          >
            {/* Décoration subtile en arrière-plan */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 opacity-20 ${
                variant === "danger" ? "bg-rose-500" : "bg-amber-500"
            }`} />

            {!loading && (
                <button 
                onClick={onClose} 
                className="absolute top-6 right-6 text-slate-300 dark:text-slate-600 hover:text-primary dark:hover:text-white transition-colors"
                >
                <X size={20} strokeWidth={3} />
                </button>
            )}

            <div className="flex flex-col items-center text-center relative z-10">
              {/* Icon Container */}
              <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center mb-8 border transition-colors ${
                variant === "danger" 
                ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-100 dark:border-rose-500/20" 
                : "bg-amber-50 dark:bg-amber-500/10 text-amber-500 border-amber-100 dark:border-amber-500/20"
              }`}>
                <AlertTriangle size={36} strokeWidth={2.5} className="animate-pulse" />
              </div>

              <h3 className="text-2xl font-black text-primary dark:text-white uppercase tracking-tighter italic mb-3">
                {title}
              </h3>
              
              <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold leading-relaxed mb-10 uppercase tracking-[0.15em] px-2">
                {message}
              </p>

              <div className="flex flex-col w-full gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 ${
                    variant === "danger"
                    ? "bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600"
                    : "bg-primary dark:bg-secondary text-white dark:text-primary-dark shadow-primary/20 hover:opacity-90"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    "Confirmer l'action"
                  )}
                </motion.button>

                {!loading && (
                    <button
                    onClick={onClose}
                    className="w-full py-5 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-100 dark:hover:bg-white/10 transition-all italic"
                    >
                    Annuler
                    </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}