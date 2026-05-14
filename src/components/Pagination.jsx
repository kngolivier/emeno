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
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift("...");
    if (current + delta < total - 1) range.push("...");
    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
  };

  const pages = getPages();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 bg-white dark:bg-[#0B1120] p-4 lg:p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] transition-colors duration-500"
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

        <div className="flex items-center gap-1.5 mx-2">
          {pages.map((p, idx) => (
            p === "..." ? (
              <div key={idx} className="px-2 text-slate-300 dark:text-slate-700">
                <MoreHorizontal size={16} />
              </div>
            ) : (
              <button
                key={idx}
                onClick={() => setPage(p)}
                className={`min-w-[40px] h-10 px-3 rounded-xl text-[10px] font-black transition-all duration-300 uppercase italic ${
                  p === current 
                    ? "bg-primary dark:bg-secondary text-white dark:text-primary-dark shadow-lg shadow-primary/20 dark:shadow-secondary/20 scale-110 z-10" 
                    : "bg-transparent text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5"
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