// FILE: src/pages/drivers/DriversList.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Phone, ShieldCheck, ExternalLink, UserX } from "lucide-react";
import NewDriverForm from "./NewDriverForm";
import { Pagination } from "../../components/Pagination";
import { fetchDrivers, updateUserStatus, createDriver, updateUser } from "../../api/users.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashboard/TotalCard";

const STATUS_LABELS = {
  ALL: "Tous les livreurs",
  ACTIVE: "Actifs",
  INACTIVE: "Inactifs",
  BLOCKED: "Bloqués",
  DELETED: "Supprimés"
};

export default function DriversList() {
  const { data: drivers = [], meta, loading, setPage, setStatus, status, refresh } = usePaginatedFetch(fetchDrivers, 10);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const getStatusStyle = (s) => {
    switch (s) {
      case "ACTIVE": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
      case "INACTIVE": return "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10";
      case "BLOCKED": return "bg-primary/10 dark:bg-rose-500/10 text-primary dark:text-rose-400 border-primary/10 dark:border-rose-500/20";
      case "DELETED": return "bg-black text-white border-black";
      default: return "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/5";
    }
  };

  const handleSave = async (driver) => {
    try {
      if (!driver._id) {
        await createDriver(driver);
        notifySuccess("Livreur enregistré");
      } else {
        await updateUser(driver._id, driver);
        notifySuccess("Informations du livreur mises à jour");
      }
      setShowForm(false);
      setEditingDriver(null);
      refresh();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const toggleDriverStatus = async (driver) => {
    if (driver.status === "DELETED") return;
    try {
      const newStatus = driver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateUserStatus(driver._id, newStatus);
      refresh();
      notifySuccess("Statut mis à jour");
    } catch (err) {
      notifyError(err.message);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 font-sans pb-10 transition-colors duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-display italic tracking-tighter">
            Livreurs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
            Gestion de la flotte logistique
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <TotalCard title="Actifs" value={meta?.total || 0} subtitle="Livreurs" />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary dark:bg-secondary text-white hover:opacity-90 transition-all shadow-xl dark:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Ajouter un livreur
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {["ALL", "ACTIVE", "INACTIVE", "BLOCKED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${status === s 
                ? "bg-primary dark:bg-secondary text-white border-primary dark:border-secondary shadow-md" 
                : "bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"}`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {drivers.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700">
             <UserX size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display font-black text-xl italic text-slate-900 dark:text-white uppercase tracking-tight">Aucun livreur trouvé</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-[250px] mx-auto mt-2">
              Il n'y a actuellement aucun livreur correspondant à la catégorie <span className="text-secondary font-bold italic">"{STATUS_LABELS[status]}"</span>.
            </p>
          </div>
          {status !== "ALL" && (
            <button 
              onClick={() => setStatus("ALL")}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary underline underline-offset-4"
            >
              Voir tous les livreurs
            </button>
          )}
        </div>
      ) : (
        <>
          {/* --- VUE MOBILE : CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {drivers.map((d) => (
              <div key={d._id} className={`bg-white dark:bg-white/[0.03] p-5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm transition-all ${d.status === "DELETED" ? "opacity-40 grayscale" : ""}`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center font-display font-black text-primary dark:text-secondary italic border border-slate-200 dark:border-white/10 shadow-inner">
                      {d.nom?.charAt(0)}{d.prenom?.charAt(0)}
                    </div>
                    <div>
                      <Link to={`/admin/drivers/${d._id}`} className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-1 hover:text-secondary">
                        {d.nom} {d.prenom}
                        <ExternalLink size={10} />
                      </Link>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(d.status)}`}>
                        {STATUS_LABELS[d.status] || d.status}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => { setEditingDriver(d); setShowForm(true); }} className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-secondary transition-colors">
                    <Edit size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  <div className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                        <Phone size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Contact</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-900 dark:text-slate-200 italic">{d.telephone}</p>
                  </div>
                  <div className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                        <ShieldCheck size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">ID Verifié</span>
                      </div>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 italic uppercase">Oui</p>
                  </div>
                </div>

                <button 
                  onClick={() => toggleDriverStatus(d)}
                  className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border
                    ${d.status === "ACTIVE" 
                      ? "bg-white dark:bg-transparent border-rose-100 dark:border-rose-500/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10" 
                      : "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none"}`}
                >
                  {d.status === "ACTIVE" ? "Suspendre l'accès" : "Réactiver le compte"}
                </button>
              </div>
            ))}
          </div>

          {/* --- VUE DESKTOP : TABLEAU --- */}
          <div className="hidden lg:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Identité</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Contact</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Statut</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {drivers.map((d) => (
                  <tr key={d._id} className={`hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group ${d.status === "DELETED" ? "opacity-30" : ""}`}>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center font-display font-black text-primary dark:text-secondary italic border border-slate-200 dark:border-white/10 shadow-inner group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                          {d.nom?.charAt(0)}{d.prenom?.charAt(0)}
                        </div>
                        <div>
                          <Link to={`/admin/drivers/${d._id}`} className="font-display font-black text-slate-900 dark:text-white italic text-lg tracking-tighter hover:text-secondary transition-colors leading-none uppercase">
                            {d.nom} {d.prenom}
                          </Link>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1 tracking-tighter">Membre depuis {new Date(d.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-white/10">
                        {d.telephone}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(d.status)}`}>
                        {STATUS_LABELS[d.status] || d.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => { setEditingDriver(d); setShowForm(true); }} 
                          className="p-2.5 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => toggleDriverStatus(d)} 
                          className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all 
                            ${d.status === "ACTIVE" 
                              ? "border-rose-100 dark:border-rose-500/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10" 
                              : "border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"}`}
                        >
                          {d.status === "ACTIVE" ? "Suspendre" : "Activer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination meta={meta} setPage={setPage} />
        </>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 dark:bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl transform animate-in slide-in-from-bottom-8 duration-500">
            <NewDriverForm 
              driver={editingDriver} 
              onSave={handleSave} 
              onCancel={() => { setShowForm(false); setEditingDriver(null); }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}