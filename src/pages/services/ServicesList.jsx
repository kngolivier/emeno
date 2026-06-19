// FILE: src/pages/services/ServicesList.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Layers, ShieldAlert, ShieldCheck } from "lucide-react";

import { getAll, remove, getStats } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import ServiceForm from "./ServiceForm";
import TotalCard from "../../components/dashboard/TotalCard";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

const MODE_LABELS = {
  BASE_PRICING: "Standard",
  WHATSAPP_ONLY: "WhatsApp"
};

export default function ServicesList() {
  const { data: services, loading, refresh, status, setStatus } = usePaginatedFetch(getAll);

  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getStats();
        setStats(res?.data?.data || res?.data || res);
      } catch (err) {
        console.error("Erreur chargement stats:", err);
      }
    };
    loadStats();
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

  const statusFilters = [
    { label: "Tous", value: "ALL" },
    { label: "Actifs", value: "ACTIVE" },
    { label: "Inactifs", value: "INACTIVE" }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TotalCard title="Total services" value={stats.total} subtitle="services enregistrés" />
        <TotalCard title="Services actifs" value={stats.active} subtitle="disponibles à la vente" />
        <TotalCard title="Services inactifs" value={stats.inactive} subtitle="en brouillon" />
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-primary dark:text-white italic uppercase">Services</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Gestion des services EMENO</p>
          </div>
          <button onClick={() => { setSelected(null); setShowForm(true); }} className="bg-primary text-white font-black text-xs uppercase px-6 py-4 rounded-2xl hover:bg-primary/90 transition-all">
            + Nouveau service
          </button>
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

      {loading ? <PageLoader /> : services.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] text-center p-16">
          <Layers className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />
          <p className="font-display italic font-black uppercase text-xl text-primary dark:text-white">Aucun service</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/70 rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Service</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Mode</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {services.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.01] transition-all group">
                  <td className="p-5 font-black uppercase italic text-primary dark:text-white">{s.title}</td>
                  <td className="p-5 text-xs font-bold text-slate-600 dark:text-slate-400">{s.type}</td>
                  <td className="p-5 text-xs font-black uppercase text-slate-500">{MODE_LABELS[s.pricingMode] || s.pricingMode}</td>
                  <td className="p-5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link to={`/admin/services/${s._id}`} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary dark:hover:text-white rounded-xl transition-all">
                        <Eye size={15} />
                      </Link>
                      <button onClick={() => { setSelected(s); setShowForm(true); }} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-secondary rounded-xl transition-all">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => { setDeletingId(s._id); setShowDeleteModal(true); }} className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-sm text-center">
            <h2 className="font-black text-2xl uppercase mb-4">Confirmer suppression ?</h2>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black">Confirmer</button>
              <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <ServiceForm service={selected} onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); refresh(); }} />
      )}
    </div>
  );
}