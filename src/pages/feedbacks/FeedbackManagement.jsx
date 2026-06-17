// FILE: src/pages/feedbacks/FeedbackManagement.jsx

import { Star, MessageSquare } from "lucide-react";
import { fetchAllFeedbacks, updateFeedbackStatus } from "../../api/feedback.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import { Pagination } from "../../components/Pagination";
import FeedbackTable from "../../components/feedback/FeedbackTable";
import FeedbackCard from "../../components/feedback/FeedbackCard";
import { useState } from "react";

const FilterButton = ({ active, onClick, children }) => (
<button
    onClick={onClick}
    className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
    active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
        : "bg-white dark:bg-transparent text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300"
    }`}
>
    {children}
</button>
);
export default function FeedbackManagement() {
  const [filters, setFilters] = useState({ status: 'ALL', authorRole: '', minRating: 0 });
  const { data: feedbacks = [], meta, loading, setPage, refresh } = 
    usePaginatedFetch(fetchAllFeedbacks, 10, filters);

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
      {/* Barre de Filtres Améliorée */}
      <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-soft">
        
        {/* Ligne 1 : Statuts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mr-2">Statut</span>
          {["ALL", "PENDING", "RESOLVED"].map((s) => (
            <FilterButton key={s} active={filters.status === s} onClick={() => setFilters({...filters, status: s})}>
              {s === "ALL" ? "Tous" : s === "PENDING" ? "En attente" : "Résolu"}
            </FilterButton>
          ))}
        </div>

        {/* Ligne 2 : Rôle & Note */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mr-2">Rôle</span>
            <FilterButton active={filters.authorRole === ""} onClick={() => setFilters({...filters, authorRole: ""})}>Tous</FilterButton>
            <FilterButton active={filters.authorRole === "CLIENT"} onClick={() => setFilters({...filters, authorRole: "CLIENT"})}>Client</FilterButton>
            <FilterButton active={filters.authorRole === "DRIVER"} onClick={() => setFilters({...filters, authorRole: "DRIVER"})}>Livreur</FilterButton>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mr-2">Note</span>
            {[0, 3, 4].map((n) => (
              <FilterButton key={n} active={Number(filters.minRating) === n} onClick={() => setFilters({...filters, minRating: n})}>
                {n === 0 ? "Toutes" : n + "+"}
              </FilterButton>
            ))}
          </div>

          <button 
            onClick={() => setFilters({ status: 'ALL', authorRole: '', minRating: 0 })}
            className="ml-auto text-[9px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest underline transition-all"
          >
            Réinitialiser
          </button>
        </div>
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