// FILE: src/components/dashboard/ProgressRow.jsx

  export default function ProgressRow ({ label, value, total, colorClass }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600">{label}</span>
                <span className="text-slate-800">{value}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                className={`h-full rounded-full ${colorClass} transition-all duration-1000`} 
                style={{ width: `${(value / total) * 100}%` }}
                />
            </div>
        </div>
    )
  }