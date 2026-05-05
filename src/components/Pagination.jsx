// FILE: src/components/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ meta, setPage }) => {
  if (!meta || meta.pages <= 1) return null;

  const current = meta.page;
  const total = meta.pages;

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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 bg-white p-4 rounded-[2rem] border border-slate-50 shadow-soft">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Page <span className="text-primary">{current}</span> sur <span className="text-primary">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={current === 1}
          onClick={() => setPage(current - 1)}
          className="p-3 rounded-xl bg-slate-50 text-primary hover:bg-secondary hover:text-white disabled:opacity-20 transition-all shadow-sm"
        >
          <ChevronLeft size={18} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {pages.map((p, idx) => (
            p === "..." ? (
              <span key={idx} className="px-2 text-slate-300 font-black">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                  p === current 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" 
                    : "bg-transparent text-slate-400 hover:bg-slate-100"
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
          className="p-3 rounded-xl bg-slate-50 text-primary hover:bg-secondary hover:text-white disabled:opacity-20 transition-all shadow-sm"
        >
          <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};