// FILE: src/pages/feedbacks/FeedbackManagement.jsx

import { Star, MessageSquare } from "lucide-react";
import { fetchAllFeedbacks, updateFeedbackStatus } from "../../api/feedback.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import { Pagination } from "../../components/Pagination";
import FeedbackTable from "../../components/feedback/FeedbackTable";
import FeedbackCard from "../../components/feedback/FeedbackCard";

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

      {/* Contenu */}
      <div className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] shadow-soft overflow-hidden">
        {feedbacks.length > 0 ? (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <FeedbackTable feedbacks={feedbacks} onStatusChange={handleStatusChange} />
            </div>
            <div className="lg:hidden p-4 space-y-4">
              {feedbacks.map((fb) => (
                <FeedbackCard key={fb._id} feedback={fb} onResolve={() => handleStatusChange(fb._id, 'RESOLVED')} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/[0.03] rounded-3xl flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700">
              <MessageSquare size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Aucun avis trouvé</h3>
            <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-[0.2em]">Il n'y a pas d'avis avec ce statut.</p>
          </div>
        )}
      </div>

      <Pagination meta={meta} setPage={setPage} />
    </div>
  );
}