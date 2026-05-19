// FILE: src/pages/admins/AdminList.jsx

import { useState } from "react";
import { Plus, Eye, ShieldCheck, UserX, Mail, Phone, Lock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Pagination } from "../../components/Pagination";
import { fetchAdmins, updateUserStatus } from "../../api/users.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import NewAdminForm from "./NewAdminForm";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashboard/TotalCard";

const STATUS_LABELS = {
  ALL: "Tous les comptes",
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  BLOCKED: "Bloqué",
  DELETED: "Supprimé"
};

export default function AdminList() {
  const { data: admins = [], meta, loading, setPage, refresh } = usePaginatedFetch(fetchAdmins, 10);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleStatusChange = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      refresh();
      notifySuccess("Statut de l'accès mis à jour");
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
      INACTIVE: "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10",
      BLOCKED: "bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-100 dark:border-rose-500/20",
      DELETED: "bg-black text-white border-black"
    };
    return styles[status] || styles.INACTIVE;
  };

  if (loading) return <PageLoader />;

  const filteredAdmins = admins.filter((a) => statusFilter === "ALL" || a.status === statusFilter);

  return (
    <div className="space-y-8 font-sans pb-10 transition-colors duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-display italic tracking-tighter">
            Staff Admin
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
            Contrôle des accès plateforme
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
             <TotalCard title="Membres" value={meta?.total || 0} subtitle="Équipe" />
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary dark:bg-secondary text-white hover:opacity-90 transition-all shadow-xl dark:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Ajouter un Admin
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {["ALL", "ACTIVE", "INACTIVE", "BLOCKED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${statusFilter === s 
                ? "bg-primary dark:bg-secondary text-white border-primary dark:border-secondary shadow-md" 
                : "bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"}`}
          >
            {s === "ALL" ? "Tout le Staff" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filteredAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.5rem] text-center px-4">
          <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
            <Users className="text-slate-300 dark:text-slate-600" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Aucun administrateur</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-2 max-w-xs">
            {statusFilter === "ALL" 
              ? "Il n'y a pas encore d'administrateurs enregistrés sur la plateforme." 
              : `Aucun administrateur trouvé avec le statut : ${STATUS_LABELS[statusFilter].toLowerCase()}.`}
          </p>
        </div>
      ) : (
          <>
              {/* --- VUE MOBILE : CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredAdmins.map((a) => (
              <div key={a._id} className="bg-white dark:bg-white/[0.03] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-display font-black italic border-4 border-slate-100 dark:border-white/10 shadow-lg uppercase relative">
                    {a.nom?.charAt(0)}{a.prenom?.charAt(0)}
                    <div className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-50 dark:border-white/10 text-primary dark:text-secondary">
                      <Lock size={10} strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-black text-slate-900 dark:text-white italic text-lg tracking-tight truncate uppercase leading-none">
                      {a.nom} {a.prenom}
                    </h3>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border ${getStatusBadge(a.status)}`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Phone size={14} className="text-slate-400 dark:text-slate-600" />
                    <span className="text-xs font-bold">{a.telephone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <Mail size={14} className="text-slate-400 dark:text-slate-600" />
                    <span className="text-xs font-medium truncate">{a.email || "—"}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    to={`/admin/admins/${a._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/10"
                  >
                    <Eye size={14} /> Gérer
                  </Link>
                  <button 
                    onClick={() => handleStatusChange(a._id, a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                    className={`px-4 py-3 rounded-xl border transition-colors ${a.status === "ACTIVE" ? "border-rose-100 dark:border-rose-500/30 text-rose-500" : "border-emerald-100 dark:border-emerald-500/30 text-emerald-500"}`}
                  >
                    {a.status === "ACTIVE" ? <UserX size={16} /> : <ShieldCheck size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- VUE DESKTOP : TABLEAU --- */}
          <div className="hidden lg:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Administrateur</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Contact</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Statut</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredAdmins.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 text-white flex items-center justify-center font-display font-black italic shadow-md uppercase text-sm border-2 border-white dark:border-white/10">
                          {a.nom?.charAt(0)}{a.prenom?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-display font-black text-slate-900 dark:text-white italic text-lg tracking-tighter leading-none uppercase">
                            {a.nom} {a.prenom}
                          </p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1 tracking-widest italic">Accès Privilégié</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">{a.telephone}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{a.email || "—"}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(a.status)}`}>
                        {STATUS_LABELS[a.status]}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <Link 
                          to={`/admin/admins/${a._id}`} 
                          className="p-2.5 text-slate-400 hover:text-primary dark:hover:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/5 rounded-xl transition-all"
                        >
                          <Eye size={20} />
                        </Link>
                        <button 
                          onClick={() => handleStatusChange(a._id, a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                          className={`p-2.5 rounded-xl transition-all ${a.status === "ACTIVE" ? "text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10" : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"}`}
                        >
                          {a.status === "ACTIVE" ? <UserX size={18} /> : <ShieldCheck size={18} />}
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

      <Pagination meta={meta} setPage={setPage} />

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 dark:bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl transform animate-in slide-in-from-bottom-8 duration-500">
            <NewAdminForm onClose={() => setShowForm(false)} onCreated={refresh} />
          </div>
        </div>
      )}
    </div>
  );
}