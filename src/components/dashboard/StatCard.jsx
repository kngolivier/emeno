// FILE: src/components/dashboard/StatCard.jsx

import { useNavigate } from "react-router-dom";

export default function StatCard({ title, value, icon: Icon, color, to }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => to && navigate(to)}
      className={`
        bg-white border-slate-100 shadow-sm
        dark:bg-slate-900 dark:border-white/5 
        /* Réduction drastique du padding et du radius */
        p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all cursor-pointer group 
        flex flex-row items-center gap-3
        ${to ? "hover:border-secondary/30 hover:shadow-md active:scale-95" : ""}
      `}
    >
      {/* Icon Container: Format plus compact et fixe */}
      <div className={`
        w-9 h-9 md:w-10 md:h-10 
        rounded-lg md:rounded-xl 
        flex items-center justify-center shrink-0
        transition-colors ${color}
      `}>
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>

      {/* Text Container: Alignement horizontal pour gagner de la place en hauteur */}
      <div className="min-w-0">
        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">
          {title}
        </p>
        <p className="text-base md:text-xl font-black text-primary dark:text-white italic tracking-tighter leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}