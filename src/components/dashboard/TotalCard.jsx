// FILE: src/components/dashboard/TotalCard.jsx

export default function TotalCard({ title = "Total", value = 0, subtitle }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 shadow-soft rounded-[1.5rem] px-6 py-5 flex items-center justify-between min-w-[180px] hover:shadow-md dark:hover:border-secondary/30 transition-all group">
      <div>
        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">
          {title}
        </p>

        <p className="text-xl font-black text-primary dark:text-white italic tracking-tighter group-hover:text-secondary transition-colors">
          {value}
        </p>

        {subtitle && (
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 lowercase italic">
            {subtitle}
          </p>
        )}
      </div>

      {/* Point dynamique EMENO - Lueur ajustée pour le dark mode */}
      <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(245,158,11,0.4)] dark:shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse" />
    </div>
  );
}