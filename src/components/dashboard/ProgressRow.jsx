// FILE: src/components/dashboard/ProgressRow.jsx

export default function ProgressRow({
  label,
  value = 0,
  total = 0,
  colorClass = "bg-secondary",
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-primary dark:text-white uppercase tracking-widest italic">
            {label}
          </span>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
            {percent}%
          </span>
        </div>
        <span className="text-xs font-black text-primary dark:text-secondary italic">
          {value.toLocaleString()}
        </span>
      </div>

      {/* Rail de la barre - Ajusté pour le dark mode */}
      <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100/50 dark:border-white/5">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(0,0,0,0.05)] dark:shadow-[0_0_12px_rgba(0,0,0,0.2)]`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}