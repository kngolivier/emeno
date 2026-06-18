// FILE: src/pages/promotions/PromotionsList.jsx

import { useMemo, useState } from "react";
import { Edit3, Eye, Plus, Power, Trash2, TicketPercent } from "lucide-react";
import { Link } from "react-router-dom";
import { Pagination } from "../../components/Pagination";
import { deletePromotion, fetchPromotions, togglePromotionStatus } from "../../api/promotions.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import PromotionForm from "./PromotionForm";

const normalizePromotions = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.promotions)) return response.promotions;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.promotions)) return response.data.promotions;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
};

const formatDate = (value) => {
  if (!value) return "Non définie";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Non définie";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

export default function PromotionsList() {
  const { data: response = {}, meta, loading, setPage, refresh } = usePaginatedFetch(fetchPromotions, 10);
  const [showForm, setShowForm] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // <--- Ajoutez cette ligne


  const promotions = useMemo(() => normalizePromotions(response), [response]);

  const openCreateForm = () => {
    setSelectedPromotion(null);
    setShowForm(true);
  };

  const openEditForm = (promotion) => {
    setSelectedPromotion(promotion);
    setShowForm(true);
  };

  const handleFormSaved = () => {
    setShowForm(false);
    setSelectedPromotion(null);
    refresh();
  };

  const toggleStatus = async (promo) => {
    try {
      await togglePromotionStatus(promo._id, !promo.isActive);
      notifySuccess("Statut mis à jour");
      refresh();
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true); // Activez le chargement
    try {
      await deletePromotion(deletingId, true);
      notifySuccess("Promotion supprimée");
      refresh();
      setShowDeleteModal(false);
    } catch (err) {
      notifyError("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false); // Désactivez le chargement
      setDeletingId(null);
    }
  };

  const getStatusStyle = (promotion) => {
    const now = new Date();
    const expired = promotion.endDate && new Date(promotion.endDate) < now;
    if (expired) return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    if (promotion.isActive) return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    return "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400";
  };

  const getStatusLabel = (promotion) => {
    if (promotion.endDate && new Date(promotion.endDate) < new Date()) return "Expirée";
    return promotion.isActive ? "Active" : "Inactive";
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 font-sans pb-10 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-display italic tracking-tighter">Promotions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">Gestion des campagnes marketing</p>
        </div>
        <button onClick={openCreateForm} className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary dark:bg-secondary text-white hover:opacity-90 transition-all shadow-xl dark:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest">
          <Plus size={16} strokeWidth={3} /> Créer une promo
        </button>
      </div>

      {promotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700">
            <TicketPercent size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display font-black text-xl italic text-slate-900 dark:text-white uppercase tracking-tight">Aucune promotion</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-[250px] mx-auto mt-2">Commencez par créer votre première campagne promotionnelle.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {promotions.map((p) => (
              <div key={p._id} className="bg-white dark:bg-white/[0.03] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display font-black text-slate-900 dark:text-white italic text-xl tracking-tight uppercase truncate">{p.title}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1 tracking-widest">{p.promoCategory || "PARTNER"} · {p.type || "DISCOUNT"}</p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-[8px] font-black uppercase ${getStatusStyle(p)}`}>{getStatusLabel(p)}</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-4 line-clamp-2">{p.description}</p>

                <div className="flex items-center justify-between mt-5 p-4 rounded-2xl bg-slate-50/60 dark:bg-white/5">
                  <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-200">{p.code}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fin {formatDate(p.endDate)}</span>
                </div>

                <div className="flex gap-2 mt-5">
                  <Link to={`/admin/promotions/${p._id}`} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 dark:bg-white/5 text-primary dark:text-secondary text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/10">
                    <Eye size={14} /> Voir
                  </Link>
                  <button onClick={() => openEditForm(p)} className="px-4 py-3 rounded-xl border border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-300">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => toggleStatus(p)} className="px-4 py-3 rounded-xl border border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-300">
                    <Power size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Promotion</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Code</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Fin</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Statut</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {promotions.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <p className="font-display font-black text-slate-900 dark:text-white italic text-lg tracking-tighter leading-none uppercase">{p.title}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1 tracking-widest">{p.badge || "Sans badge"} · {p.promoCategory || "PARTNER"}</p>
                    </td>
                    <td className="p-6">
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300">{p.code}</span>
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-600 dark:text-slate-300">{formatDate(p.endDate)}</td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${getStatusStyle(p)}`}>{getStatusLabel(p)}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleStatus(p)} className="p-2.5 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all" title="Changer le statut">
                          <Power size={18} />
                        </button>
                        <button onClick={() => openEditForm(p)} className="p-2.5 text-slate-400 hover:text-primary dark:hover:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/5 rounded-xl transition-all" title="Modifier">
                          <Edit3 size={18} />
                        </button>
                        <Link to={`/admin/promotions/${p._id}`} className="p-2.5 text-slate-400 hover:text-primary dark:hover:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/5 rounded-xl transition-all" title="Voir les détails">
                          <Eye size={18} />
                        </Link>
                        <button onClick={() => { setDeletingId(p._id); setShowDeleteModal(true); }} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all disabled:opacity-40" title="Supprimer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination meta={meta} setPage={setPage} />
          {showDeleteModal && (
            <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md p-0 md:p-4">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-sm text-center space-y-6 shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95">
                <div className="w-20 h-20 bg-red-50 dark:bg-rose-500/10 text-red-500 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto rotate-3">
                  <Trash2 size={32} />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl italic text-slate-900 dark:text-white uppercase">Supprimer ?</h2>
                  <p className="text-slate-500 text-xs mt-2 italic">Action irréversible.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <button 
                    onClick={handleDelete} 
                    disabled={isDeleting} // Utilise l'état de chargement
                    className="w-full py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                  >
                    {isDeleting ? "Suppression..." : "Confirmer"}
                  </button>
                  <button 
                    onClick={() => { setShowDeleteModal(false); setDeletingId(null); }} 
                    className="w-full py-4 text-[10px] font-black uppercase text-slate-400"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 dark:bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="w-full transform animate-in slide-in-from-bottom-8 duration-500 my-8">
            <PromotionForm promotion={selectedPromotion} onSave={handleFormSaved} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
