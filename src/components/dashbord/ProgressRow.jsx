// FILE: src/components/dashboard/ProgressRow.jsx

export default function ProgressRow({
  label,
  value = 0,
  total = 0,
  colorClass = "bg-emerald-500",
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-2">

      {/* HEADER */}
      <div className="flex items-center justify-between text-sm">

        <div className="flex items-center gap-2">
          <span className="text-slate-700 font-medium">{label}</span>

          {/* petit badge % */}
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            {percent}%
          </span>
        </div>

        <span className="text-slate-900 font-semibold">
          {value}
        </span>

      </div>

      {/* BAR BACKGROUND */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">

        {/* BAR FILL */}
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />

        {/* LIGHT GLOW EFFECT */}
        <div
          className="absolute top-0 left-0 h-full w-full opacity-0 hover:opacity-100 transition"
        />

      </div>

    </div>
  );
}