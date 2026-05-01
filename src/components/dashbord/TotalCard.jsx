// FILE: src/components/dashboard/TotalCard.jsx

export default function TotalCard({ title = "Total", value = 0, subtitle }) {
  return (
    <div className="bg-white border shadow-sm rounded-2xl px-5 py-4 flex items-center justify-between min-w-[160px] hover:shadow-md transition">

      {/* TEXT */}
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          {title}
        </p>

        <p className="text-xl font-bold text-slate-900">
          {value}
        </p>

        {subtitle && (
          <p className="text-[11px] text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* BADGE DOT (UI CLEAN) */}
      <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
    </div>
  );
}