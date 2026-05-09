// FILE: src/pages/communes/CommuneList.jsx

import { useState, useEffect } from "react";
import { Plus, Edit, MapPin, Trash2, Hash, Filter } from "lucide-react";
import { fetchCommunes, createCommune, updateCommune, deleteCommune } from "../../api/commune.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashbord/TotalCard";
import CommuneForm from "./CommuneForm";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function CommuneList() {
  const [allCommunes, setAllCommunes] = useState([]); // Source de vérité
  const [filteredCommunes, setFilteredCommunes] = useState([]); // Affichage
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCommune, setEditingCommune] = useState(null);
  
  // États pour la suppression
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Chargement initial des données
   */
  const loadCommunes = async () => {
    try {
      setLoading(true);
      const res = await fetchCommunes();
      const data = res?.data || res;
      const sorted = [...data].sort((a, b) => a.displayOrder - b.displayOrder);
      setAllCommunes(sorted);
      applyFilter(sorted, statusFilter);
    } catch (err) {
      notifyError("Erreur lors du chargement des zones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrage local
   */
  const applyFilter = (data, filter) => {
    if (filter === "ALL") {
      setFilteredCommunes(data);
    } else {
      const activeTarget = filter === "ACTIVE";
      setFilteredCommunes(data.filter(c => c.isActive === activeTarget));
    }
  };

  useEffect(() => {
    loadCommunes();
  }, []);

  useEffect(() => {
    applyFilter(allCommunes, statusFilter);
  }, [statusFilter, allCommunes]);

  /**
   * Enregistrement (Création ou Modification)
   */
  const handleSave = async (data) => {
    try {
      if (editingCommune) {
        await updateCommune(editingCommune._id, data);
        notifySuccess("Zone mise à jour avec succès");
      } else {
        await createCommune(data);
        notifySuccess("Nouvelle zone ajoutée");
      }
      setShowForm(false);
      setEditingCommune(null);
      loadCommunes();
    } catch (err) {
      notifyError(err.message || "Erreur lors de l'enregistrement");
    }
  };

  /**
   * Suppression confirmée via Modal
   */
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCommune(deleteId);
      notifySuccess("Zone supprimée définitivement");
      setDeleteId(null);
      loadCommunes();
    } catch (err) {
      notifyError(err.message || "Erreur de suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 font-sans pb-10 transition-colors duration-300">
      
      {/* --- SECTION HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary dark:text-white font-display italic tracking-tighter uppercase leading-none">
            Zones & Communes
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
            Gestion géographique des périmètres de livraison
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <TotalCard 
              title="Zones" 
              value={allCommunes.length} 
              subtitle={statusFilter === "ALL" ? "Total" : `Filtre: ${statusFilter}`} 
            />
          </div>
          <button
            onClick={() => { setEditingCommune(null); setShowForm(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Ajouter une commune
          </button>
        </div>
      </div>

      {/* --- SECTION FILTRES --- */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-50 dark:border-slate-800 shadow-sm inline-flex gap-1 overflow-x-auto max-w-full scrollbar-hide">
        {[
          { label: "Toutes les zones", value: "ALL" },
          { label: "Actives", value: "ACTIVE" },
          { label: "Inactives", value: "INACTIVE" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
              ${statusFilter === f.value 
                ? "bg-primary text-white shadow-lg" 
                : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* --- VUE MOBILE : GRID DE CARTES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredCommunes.map((c) => (
          <div 
            key={c._id} 
            className={`bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm transition-all ${!c.isActive ? "opacity-70 bg-slate-50/50 dark:bg-slate-800/50" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-secondary border border-slate-100 dark:border-slate-700">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-primary dark:text-white uppercase tracking-tight leading-none">{c.name}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border 
                    ${c.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700"}`}>
                    {c.isActive ? "Opérationnelle" : "Désactivée"}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => { setEditingCommune(c); setShowForm(true); }} 
                  className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-secondary"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => setDeleteId(c._id)} 
                  className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-white dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-400">
                <Hash size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">Priorité affichage</span>
              </div>
              <p className="text-[10px] font-bold text-primary dark:text-secondary italic">Rang #{c.displayOrder}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- VUE DESKTOP : TABLEAU --- */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest w-24 text-center">Ordre</th>
              <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Désignation Commune</th>
              <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Statut Desserte</th>
              <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredCommunes.map((c) => (
              <tr key={c._id} className={`hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group ${!c.isActive ? "opacity-60 grayscale-[0.5]" : ""}`}>
                <td className="p-6 text-center font-display font-black text-slate-300 dark:text-slate-700 italic group-hover:text-primary dark:group-hover:text-secondary transition-colors text-xl">
                  #{c.displayOrder}
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-secondary border border-slate-100 dark:border-slate-700 shadow-inner group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      <MapPin size={18} />
                    </div>
                    <span className="font-display font-black text-primary dark:text-white italic text-lg tracking-tighter uppercase">
                      {c.name}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border 
                    ${c.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700"}`}>
                    {c.isActive ? "Zone desservie" : "Desserte suspendue"}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => { setEditingCommune(c); setShowForm(true); }} 
                      className="p-2.5 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => setDeleteId(c._id)} 
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCommunes.length === 0 && (
          <div className="p-20 text-center bg-slate-50/20 dark:bg-slate-800/20">
             <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="text-slate-200 dark:text-slate-700" size={24} />
             </div>
             <p className="text-slate-400 dark:text-slate-500 font-display italic text-lg tracking-tight">
               Aucun résultat pour "{statusFilter}"
             </p>
          </div>
        )}
      </div>

      {/* --- FORM MODAL --- */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-primary/40 dark:bg-black/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md transform animate-in slide-in-from-bottom-8 duration-500">
            <CommuneForm 
              commune={editingCommune} 
              onSave={handleSave} 
              onCancel={() => { setShowForm(false); setEditingCommune(null); }} 
            />
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Supprimer la zone ?"
        message="Cette action est irréversible et supprimera également tous les tarifs de livraison associés à cette commune."
      />
    </div>
  );
}