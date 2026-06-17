import { useState, useEffect } from "react";
import { Filter, Star, ShieldCheck, Search } from "lucide-react";
import { fetchAllFeedbacks } from "../../api/feedback.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import FeedbackTable from "../../components/feedback/FeedbackTable";

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "ALL", minRating: 0 });

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetchAllFeedbacks();
      setFeedbacks(res.data || []);
    } catch (err) {
      notifyError("Erreur lors du chargement des avis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Logique de filtrage local pour l'interface
  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesRating = filter.minRating === 0 || fb.rating >= filter.minRating;
    const matchesStatus = filter.status === "ALL" || fb.status === filter.status;
    return matchesRating && matchesStatus;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary dark:text-white italic tracking-tighter uppercase">
            Gestion des avis
          </h1>
          <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
            Modération et suivi de la qualité de service
          </p>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-50 dark:border-slate-800 shadow-soft">
        <Filter className="text-slate-400 ml-2" size={16} />
        
        <select 
          onChange={(e) => setFilter({...filter, status: e.target.value})}
          className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none text-slate-600 dark:text-slate-300 px-4 py-2"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="RESOLVED">Résolus</option>
        </select>

        <div className="h-6 w-[1px] bg-slate-100 dark:bg-slate-800" />

        <button 
          onClick={() => setFilter({...filter, minRating: filter.minRating === 3 ? 0 : 3})}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter.minRating === 3 ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Star size={14} /> Avis &gt; 3
        </button>
      </div>

      {/* Tableau des avis */}
      <div className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] shadow-soft overflow-hidden">
        {filteredFeedbacks.length > 0 ? (
          <FeedbackTable 
            feedbacks={filteredFeedbacks} 
            onStatusChange={(id, status) => {
              // Ici, appel à votre API de mise à jour de statut (PATCH)
              notifySuccess("Statut mis à jour");
              loadFeedbacks();
            }} 
          />
        ) : (
          <div className="p-20 text-center text-slate-400 text-xs font-black uppercase tracking-widest">
            Aucun avis trouvé avec ces filtres
          </div>
        )}
      </div>
    </div>
  );
}