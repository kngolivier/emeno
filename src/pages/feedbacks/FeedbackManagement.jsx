// FILE: src/pages/feedbacks/FeedbackManagement.jsx

import { Filter, Star, ShieldCheck, MessageSquare, AlertTriangle } from "lucide-react";
import { fetchAllFeedbacks } from "../../api/feedback.api";
import { updateFeedbackStatus } from "../../api/feedback.api"; // Assurez-vous d'avoir cette fonction
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import { Pagination } from "../../components/Pagination";

export default function FeedbackManagement() {
  const { data: feedbacks = [], meta, loading, setPage, refresh, status, setStatus } = usePaginatedFetch(fetchAllFeedbacks, 10);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateFeedbackStatus(id, { status: newStatus });
      notifySuccess("Statut mis à jour");
      refresh();
    } catch (err) {
      notifyError("Échec de la mise à jour");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Gestion des avis</h1>
        <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">Modération et suivi de la qualité</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-4">
        {["ALL", "PENDING", "RESOLVED", "HIDDEN"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
              status === s 
                ? "bg-primary dark:bg-secondary text-white border-primary" 
                : "bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/5"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tableau (Desktop) */}
      <div className="hidden lg:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-white/5">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Auteur</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Commentaire</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Note</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {feedbacks.map((fb) => (
              <tr key={fb._id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-sm">{fb.authorId?.prenom} {fb.authorId?.nom}</p>
                  <span className="text-[9px] font-black text-slate-400 uppercase">{fb.authorRole}</span>
                </td>
                <td className="p-6 text-xs text-slate-600 dark:text-slate-400 italic max-w-sm truncate">{fb.comment}</td>
                <td className="p-6 text-center font-black">{fb.rating}.0</td>
                <td className="p-6 text-right">
                  {fb.status === 'PENDING' && (
                    <button onClick={() => handleStatusChange(fb._id, 'RESOLVED')} className="p-2 hover:text-emerald-500 transition-colors">
                      <ShieldCheck size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination meta={meta} setPage={setPage} />
    </div>
  );
}