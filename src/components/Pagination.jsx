// src/components/Pagination.jsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const Pagination = ({ meta, setPage }) => {
  // Sécurité si les meta ne sont pas encore chargés ou s'il n'y a qu'une page
  if (!meta || meta.pages <= 1) return null;

  const current = meta.page;
  const total = meta.pages;

  // Logique intelligente pour afficher les numéros de page (1 ... 4 5 6 ... 20)
  const getPages = () => {
    // Sur mobile, on affiche moins de pages pour éviter le débordement
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const delta = isMobile ? 0 : 1; 

    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    
    if (current - delta > 2) range.unshift("...");
    if (current + delta < total - 1) range.push("...");
    
    range.unshift(1);
    if (total > 1) range.push(total);
    
    // Supprimer les doublons éventuels si delta est petit
    return [...new Set(range)];
  };

  const pages = getPages();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mt-8 bg-white dark:bg-[#0B1120] p-4 lg:p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] transition-colors duration-500"
    >
      {/* Infos de progression */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary dark:text-secondary">
            <span className="text-[10px] font-black italic">{current}</span>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Page <span className="text-primary dark:text-white">{current}</span> sur <span className="text-primary dark:text-white">{total}</span>
        </p>
      </div>

      {/* Contrôles de navigation */}
      <div className="flex items-center gap-2">
        <button
          disabled={current === 1}
          onClick={() => setPage(current - 1)}
          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-primary dark:text-white hover:bg-secondary dark:hover:bg-secondary hover:text-white dark:hover:text-primary-dark disabled:opacity-20 transition-all active:scale-90 border border-transparent dark:border-white/5"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>

        {/* Dans votre JSX, remplacez la div des boutons par ceci */}
        <div className="flex items-center gap-1 mx-0 sm:mx-2">
          {pages.map((p, idx) => (
            p === "..." ? (
              <div key={idx} className="px-1 text-slate-300 dark:text-slate-700">
                <MoreHorizontal size={14} />
              </div>
            ) : (
              <button
                key={idx}
                onClick={() => setPage(p)}
                // 💡 Astuce : On réduit le min-w sur mobile et on cache certains éléments
                className={`h-9 w-9 sm:min-w-[40px] sm:h-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
                  p === current 
                    ? "bg-primary text-white scale-105" 
                    : "text-slate-400 hover:bg-slate-100 hidden sm:flex" // 👈 'hidden sm:flex' masque les pages numérotées sur mobile
                }`}
              >
                {p}
              </button>
            )
          ))}
        </div>

        <button
          disabled={current === total}
          onClick={() => setPage(current + 1)}
          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-primary dark:text-white hover:bg-secondary dark:hover:bg-secondary hover:text-white dark:hover:text-primary-dark disabled:opacity-20 transition-all active:scale-90 border border-transparent dark:border-white/5"
        >
          <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
};