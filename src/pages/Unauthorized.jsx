// FILE: src/pages/Unauthorized.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#F1F5F9] dark:bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] bg-white dark:bg-slate-900 p-10 lg:p-16 rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 text-center relative z-10"
      >
        {/* --- ICON --- */}
        <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto relative z-10 border border-rose-100 dark:border-rose-500/20">
                <ShieldAlert size={48} strokeWidth={1.5} />
            </div>
            <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="absolute inset-0 bg-rose-500 blur-3xl rounded-full -z-0"
            />
        </div>

        {/* --- TEXTS --- */}
        <div className="space-y-4 mb-12">
            <h1 className="text-3xl font-black text-primary dark:text-white uppercase italic tracking-tighter leading-none">
                Accès <span className="text-rose-500">Refusé.</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-slate-100 dark:bg-slate-800" />
                <Lock size={12} className="text-slate-300" />
                <div className="h-px w-8 bg-slate-100 dark:bg-slate-800" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-[240px] mx-auto">
                Votre profil actuel ne dispose pas des <br/> autorisations pour cette zone.
            </p>
        </div>

        {/* --- ACTIONS --- */}
        <div className="space-y-4">
            <button
                onClick={() => navigate(-1)}
                className="w-full py-5 bg-primary dark:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all active:scale-95"
            >
                <ArrowLeft size={16} strokeWidth={3} /> Retour en arrière
            </button>
            
            <button
                onClick={() => navigate("/")}
                className="w-full py-5 bg-transparent text-slate-400 hover:text-secondary font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all"
            >
                <Home size={16} /> Revenir à l'accueil
            </button>
        </div>

        {/* --- SECURITY FOOTER --- */}
        <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800">
            <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                ID Session : {Math.random().toString(36).substring(7).toUpperCase()} • EMENO Security Ops
            </p>
        </div>
      </motion.div>
    </div>
  );
}