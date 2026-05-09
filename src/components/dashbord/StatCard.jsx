// FILE: src/components/dashboard/StatCard.jsx

import { useNavigate } from "react-router-dom";

export default function StatCard({ title, value, icon: Icon, color, to }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => to && navigate(to)}
      className={`
        /* Base & Light Mode */
        bg-white border-slate-50 shadow-soft 
        /* Dark Mode */
        dark:bg-slate-900 dark:border-white/5 dark:shadow-none
        /* Layout Mobile: plus compact, flex-row */
        p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all cursor-pointer group 
        flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0
        ${to ? "hover:scale-[1.02] hover:shadow-xl active:scale-95" : "hover:shadow-md"}
      `}
    >
      {/* Icon Container: Plus petit sur mobile */}
      <div className={`
        w-10 h-10 md:w-12 md:h-12 
        rounded-xl md:rounded-2xl 
        flex items-center justify-center shadow-sm 
        transition-transform group-hover:scale-110 shrink-0
        md:mb-4 ${color}
      `}>
        <Icon className="w-5 h-5 md:w-[22px] md:h-[22px]" />
      </div>

      {/* Text Container */}
      <div className="flex-1">
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-0.5 md:mb-1">
          {title}
        </p>
        <p className="font-display text-lg md:text-2xl font-black text-primary dark:text-white italic tracking-tighter leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}