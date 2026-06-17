import { Eye, ShieldCheck, AlertTriangle } from "lucide-react";

export default function FeedbackTable({ feedbacks, onStatusChange }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-slate-50/50 dark:bg-slate-800/50">
        <tr>
          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Auteur</th>
          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Avis</th>
          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Note</th>
          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
        {feedbacks.map((fb) => (
          <tr key={fb._id} className="hover:bg-slate-50/30 transition-colors">
            <td className="p-6">
              <span className="text-xs font-bold text-primary dark:text-white uppercase">{fb.authorId.prenom} {fb.authorId.nom}</span>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{fb.authorRole}</span>
            </td>
            <td className="p-6 text-[12px] text-slate-500 max-w-xs truncate">{fb.comment}</td>
            <td className="p-6 text-center">
              <span className="text-lg font-black text-primary dark:text-white italic">{fb.rating}.0</span>
            </td>
            <td className="p-6 text-right">
              <button 
                onClick={() => onStatusChange(fb._id, 'RESOLVED')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all"
              >
                <ShieldCheck size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}