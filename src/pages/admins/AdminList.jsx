// FILE: src/pages/admins/AdminList.jsx

import { useState } from "react";
import { Plus, Eye, ShieldCheck, UserX, Mail, Phone, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Pagination } from "../../components/Pagination";
import { fetchAdmins, updateUserStatus } from "../../api/users.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import NewAdminForm from "./NewAdminForm";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashbord/TotalCard";

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

  if (loading) return <PageLoader />;

  const filteredAdmins = admins.filter((a) => statusFilter === "ALL" || a.status === statusFilter);

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-100",
      INACTIVE: "bg-slate-100 text-slate-400 border-slate-200",
      BLOCKED: "bg-rose-50 text-rose-500 border-rose-100",
      DELETED: "bg-black text-white border-black"
    };
    return styles[status] || styles.INACTIVE;
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary font-display italic tracking-tighter">
            Staff Admin
          </h1>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">
            Contrôle des accès plateforme
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
             <TotalCard title="Membres" value={meta?.total || 0} subtitle="Équipe" />
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest"
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
              ${statusFilter === s ? "bg-primary text-white border-primary shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`}
          >
            {s === "ALL" ? "Tout le Staff" : s}
          </button>
        ))}
      </div>

      {/* --- VUE MOBILE : CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredAdmins.map((a) => (
          <div key={a._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-display font-black italic border-4 border-slate-50 shadow-lg uppercase relative">
                {a.nom?.charAt(0)}{a.prenom?.charAt(0)}
                <div className="absolute -top-2 -right-2 p-1.5 bg-white rounded-lg shadow-sm border border-slate-50 text-primary">
                   <Lock size={10} strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-black text-primary italic text-lg tracking-tight truncate uppercase leading-none">
                  {a.nom} {a.prenom}
                </h3>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border ${getStatusBadge(a.status)}`}>
                  {a.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 text-slate-500">
                <Phone size={14} className="text-slate-300" />
                <span className="text-xs font-bold">{a.telephone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Mail size={14} className="text-slate-300" />
                <span className="text-xs font-medium truncate">{a.email || "—"}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link 
                to={`/admin/admins/${a._id}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-primary text-[9px] font-black uppercase tracking-widest border border-slate-100"
              >
                <Eye size={14} /> Gérer
              </Link>
              <button 
                onClick={() => handleStatusChange(a._id, a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                className={`px-4 py-3 rounded-xl border transition-colors ${a.status === "ACTIVE" ? "border-rose-100 text-rose-500" : "border-emerald-100 text-emerald-500"}`}
              >
                {a.status === "ACTIVE" ? <UserX size={16} /> : <ShieldCheck size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- VUE DESKTOP : TABLEAU --- */}
      <div className="hidden lg:block bg-white border border-slate-50 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrateur</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredAdmins.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-display font-black italic shadow-md uppercase text-sm border-2 border-white">
                      {a.nom?.charAt(0)}{a.prenom?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-black text-primary italic text-lg tracking-tighter leading-none uppercase">
                        {a.nom} {a.prenom}
                      </p>
                      <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest italic">Accès Privilégié</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 italic">{a.telephone}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{a.email || "—"}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link 
                      to={`/admin/admins/${a._id}`} 
                      className="p-2.5 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      <Eye size={20} />
                    </Link>
                    <button 
                      onClick={() => handleStatusChange(a._id, a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                      className={`p-2.5 rounded-xl transition-all ${a.status === "ACTIVE" ? "text-rose-400 hover:bg-rose-50" : "text-emerald-500 hover:bg-emerald-50"}`}
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

      <Pagination meta={meta} setPage={setPage} />

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl transform animate-in slide-in-from-bottom-8 duration-500">
            <NewAdminForm onClose={() => setShowForm(false)} onCreated={refresh} />
          </div>
        </div>
      )}
    </div>
  );
}