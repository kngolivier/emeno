// FILE: src/components/feedback/FeedbackTable.jsx

import { ShieldCheck, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import { FEEDBACK_STATUS_LABELS } from "../../constants/constants";
import { Link } from "react-router-dom";

export default function FeedbackTable({ feedbacks, onStatusChange }) {
  return (
    <table className="w-full text-left border-separate border-spacing-0">
      <thead className="bg-slate-50/50 dark:bg-slate-800/30">
        <tr>
          {['Auteur', 'Commande', 'Avis', 'Note', 'Status', 'Action'].map((h) => (
            <th key={h} className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {feedbacks.map((fb) => (
          <tr key={fb._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
            <td className="p-6">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase">{fb.authorId?.prenom} {fb.authorId?.nom}</div>
              <div className="text-[9px] font-black text-secondary uppercase italic">{fb.authorRole}</div>
            </td>
            <td className="p-6">
                {fb.deliveryId ? (
                    <Link 
                    to={`/admin/deliveries/${fb.deliveryId._id}`} 
                    className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
                    >
                    #{fb.deliveryId.orderNumber || fb.deliveryId._id.slice(-6)}
                    </Link>
                ) : (
                    <span className="text-[10px] text-slate-300 italic">N/A</span>
                )}
            </td>
            <td className="p-6 text-xs text-slate-500 max-w-[200px] italic leading-relaxed">
              {fb.comment && fb.comment.trim() !== "" ? (
                `"${fb.comment}"`
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest italic">
                  <MessageSquare size={10} className="opacity-50" /> Aucun commentaire
                </span>
              )}
            </td>
            <td className="p-6 text-center">
              <span className="inline-flex items-center gap-1 font-black text-amber-500">{fb.rating}.0</span>
            </td>
            <td className="p-6">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-max ${
                fb.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
              }`}>
                {fb.status === 'RESOLVED' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                {FEEDBACK_STATUS_LABELS[fb.status] || fb.status}
              </span>
            </td>
            <td className="p-6 text-right">
              {fb.status !== 'RESOLVED' && (
                <button 
                  onClick={() => onStatusChange(fb._id, 'RESOLVED')}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                >
                  <ShieldCheck size={16} />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}