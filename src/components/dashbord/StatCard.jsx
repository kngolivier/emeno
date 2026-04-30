// FILE: src/components/dashboard/StatCard.jsx

import { useNavigate } from "react-router-dom";

export default function StatCard({ title, value, icon: Icon, color, to }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => to && navigate(to)}
      className={`bg-white p-6 rounded-3xl border shadow-sm transition cursor-pointer hover:shadow-md ${to ? "hover:scale-[1.02]" : ""}`}
    >
      <div className="flex justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}