// FILE: src/pages/services/ServicesList.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Layers, Search } from "lucide-react";

import { getAll, remove, getStats } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import ServiceForm from "./ServiceForm";
import TotalCard from "../../components/dashboard/TotalCard";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

const MODE_LABELS = {
  BASE_PRICING: "Tarification standard",
  WHATSAPP_ONLY: "Commande WhatsApp uniquement"
};

export default function ServicesList() {
  // Utilisation du hook paginé qui gère déjà status et search via l'URL
  const { data: services, loading, refresh, status, setStatus, search, updateParams } = usePaginatedFetch(getAll);

  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les stats
  useEffect(() => {
    getStats().then(res => setStats(res?.data?.data || res?.data || res)).catch(() => {});
  }, [services]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await remove(deletingId);
      notifySuccess("Service supprimé");
      refresh();
      setShowDeleteModal(false);
    } catch {
      notifyError("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const openCreate = () => { setSelected(null); setShowForm(true); };
  const openEdit = (service) => { setSelected(service); setShowForm(true); };

  const statusFilters = [
    { label: "Tous", value: "ALL" },
    { label: "Actifs", value: "ACTIVE" },
    { label: "Inactifs", value: "INACTIVE" }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      
      {/* 1. STATS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TotalCard title="Total services" value={stats.total} subtitle="services enregistrés" />
        <TotalCard title="Services actifs" value={stats.active} subtitle="disponibles à la vente" />
        <TotalCard title="Services inactifs" value={stats.inactive} subtitle="en brouillon" />
      </div>

      {/* 2. HEADER AVEC FILTRES ET RECHERCHE */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-primary dark:text-white italic uppercase">Services</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Gestion des services EMENO</p>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold outline-none border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button onClick={openCreate} className="bg-primary text-white font-black text-xs uppercase px-6 py-4 rounded-2xl hover:bg-primary/90 transition-all">
              + Nouveau
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${status === f.value ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CONTENU */}
      {loading ? <PageLoader /> : (
        services.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] text-center p-16">
            <Layers className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />
            <p className="font-display italic font-black uppercase text-xl text-primary dark:text-white">Aucun service</p>
            <button onClick={openCreate} className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Créer un service</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
              {services.map((s) => (
                <div key={s._id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 hover:shadow-xl transition-all">
                  <span className="absolute top-4 right-4 text-[8px] font-black uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{s.type}</span>
                  <h3 className="font-black text-lg uppercase italic">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{s.description}</p>
                  <div className="grid grid-cols-3 gap-2 mt-6 pt-3 border-t">
                    <Link to={`/admin/services/${s._id}`} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-center"><Eye size={16} /></Link>
                    <button onClick={() => openEdit(s)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-center"><Edit size={16} /></button>
                    <button onClick={() => { setDeletingId(s._id); setShowDeleteModal(true); }} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl flex justify-center"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/20">
                  <tr>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Service</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Mode</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {services.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/30 transition-all">
                      <td className="p-5 font-black uppercase italic">{s.title}</td>
                      <td className="p-5 text-xs font-bold">{s.type}</td>
                      <td className="p-5 text-xs font-black uppercase">{MODE_LABELS[s.pricingMode] || s.pricingMode}</td>
                      <td className="p-5 flex justify-end gap-2">
                        <Link to={`/admin/services/${s._id}`} className="p-2.5 text-slate-400 hover:text-primary"><Eye size={18} /></Link>
                        <button onClick={() => openEdit(s)} className="p-2.5 text-slate-400 hover:text-primary"><Edit size={18} /></button>
                        <button onClick={() => { setDeletingId(s._id); setShowDeleteModal(true); }} className="p-2.5 text-slate-400 hover:text-rose-500"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-sm text-center">
            <h2 className="font-black text-2xl uppercase mb-4">Supprimer ?</h2>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={isDeleting} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black">{isDeleting ? "..." : "Confirmer"}</button>
              <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-100 rounded-2xl font-black">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <ServiceForm
          service={selected}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); refresh(); }}
        />
      )}
    </div>
  );
}