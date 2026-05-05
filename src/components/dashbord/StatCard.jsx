// FILE: src/components/dashboard/StatCard.jsx

import { useNavigate } from "react-router-dom";

export default function StatCard({ title, value, icon: Icon, color, to }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => to && navigate(to)}
      className={`bg-white p-6 rounded-[2rem] border border-slate-50 shadow-soft transition-all cursor-pointer group 
      ${to ? "hover:scale-[1.02] hover:shadow-xl" : "hover:shadow-md"}`}
    >
      <div className="flex justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${color}`}>
          <Icon size={22} />
        </div>
      </div>

      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
          {title}
        </p>
        <p className="font-display text-2xl font-black text-primary italic tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}