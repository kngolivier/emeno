// FILE: src/pages/services/ServicesList.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Layers } from "lucide-react";

import { getAll, remove } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import ServiceForm from "./ServiceForm";
import { useCrudList } from "../../hooks/useCrudList";

const normalize = (res) => res?.data?.data || res?.data || [];

// 🔥 traduction propre du mode
const MODE_LABELS = {
  BASE_PRICING: "Tarification standard",
  WHATSAPP_ONLY: "Commande WhatsApp uniquement"
};

export default function ServicesList() {
  const { data: services, loading, refresh } = useCrudList(getAll, { normalize });

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce service ?")) return;

    setDeletingId(id);
    try {
      await remove(id);
      notifySuccess("Service supprimé");
      refresh();
    } catch {
      notifyError("Erreur suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const openEdit = (service) => {
    setSelected(service);
    setShowForm(true);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm">

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary dark:text-white italic uppercase">
            Services
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Gestion des services EMENO
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-primary dark:bg-secondary text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          Nouveau service
        </button>
      </div>

      {/* EMPTY STATE */}
      {services.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] text-center p-16">
          <Layers className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />

          <p className="font-display italic font-black uppercase text-xl text-primary dark:text-white">
            Aucun service
          </p>

          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
            Créez votre premier service pour commencer
          </p>

          <button
            onClick={openCreate}
            className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
          >
            Créer un service
          </button>
        </div>
      ) : (
        <>
          {/* ================= MOBILE CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">

            {services.map((s) => (
              <div
                key={s._id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-xl transition-all group relative overflow-hidden"
              >

                {/* BADGES */}
                <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {s.type}
                </span>

                <div>
                  {/* TITLE */}
                  <h3 className="font-display font-black text-lg text-primary dark:text-white uppercase italic group-hover:text-secondary transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {s.description}
                  </p>

                  {/* MODE */}
                  <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Mode :{" "}
                    <span className="text-primary dark:text-white">
                      {MODE_LABELS[s.pricingMode] || s.pricingMode}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-3 border-t border-slate-50 dark:border-slate-800/40">

                  <Link
                    to={`/admin/services/${s._id}`}
                    className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <Eye size={16} />
                  </Link>

                  <button
                    onClick={() => openEdit(s)}
                    className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
                    disabled={deletingId === s._id}
                    className="flex items-center justify-center p-3 rounded-xl bg-rose-500/10 text-rose-500"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* ================= TABLE DESKTOP ================= */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden">

            <table className="w-full text-left">

              <thead className="bg-slate-50 dark:bg-slate-800/20">
                <tr>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Service
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Type
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Mode
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">

                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.01] transition-all group">

                    <td className="p-5">
                      <p className="font-display font-black text-base text-primary dark:text-white uppercase italic group-hover:text-secondary">
                        {s.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {s.description}
                      </p>
                    </td>

                    <td className="p-5 text-xs font-bold text-slate-500">
                      {s.type}
                    </td>

                    <td className="p-5 text-xs font-black uppercase text-primary dark:text-white">
                      {MODE_LABELS[s.pricingMode] || s.pricingMode}
                    </td>

                    <td className="p-5">
                      <div className="flex items-center justify-end gap-2">

                        {/* VIEW */}
                        <Link
                          to={`/admin/services/${s._id}`}
                          className="p-2.5 text-slate-400 hover:text-primary dark:hover:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/5 rounded-xl transition-all"
                          title="Voir les détails"
                        >
                          <Eye size={18} />
                        </Link>

                        {/* EDIT */}
                        <button
                          onClick={() => openEdit(s)}
                          className="p-2.5 text-slate-400 hover:text-primary dark:hover:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/5 rounded-xl transition-all"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(s._id)}
                          disabled={deletingId === s._id}
                          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all disabled:opacity-40"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL */}
      {showForm && (
        <ServiceForm
          service={selected}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}