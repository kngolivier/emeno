// FILE: src/pages/admins/AdminList.jsx

import { useState } from "react";
import { Plus, Eye, ShieldCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { Pagination } from "../../components/Pagination";
import { fetchAdmins, updateUserStatus } from "../../api/users.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import NewAdminForm from "./NewAdminForm";
import PageLoader from "../../components/ui/PageLoader";
import Button from "../../components/ui/Button";
import TotalCard from "../../components/dashbord/TotalCard";

export default function AdminList() {
  const { data: admins = [], meta, loading, setPage, refresh } = usePaginatedFetch(fetchAdmins, 10);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleStatusChange = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      refresh();
      notifySuccess("Statut mis à jour");
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
      DELETED: "bg-black text-white"
    };
    return styles[status] || styles.INACTIVE;
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary font-display italic tracking-tighter">
            Staff Admin
          </h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">
            Contrôle des accès plateforme
          </p>
        </div>

        <div className="flex items-center gap-4">
          <TotalCard title="Administrateurs" value={meta?.total || 0} subtitle="Accès actifs" />
          <Button onClick={() => setShowForm(true)} className="rounded-[1.5rem] px-8 py-6 shadow-xl shadow-primary/20">
            <Plus size={20} strokeWidth={3} />
            <span className="font-black uppercase tracking-widest text-[11px]">Ajouter</span>
          </Button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2">
        {["ALL", "ACTIVE", "INACTIVE", "BLOCKED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border
              ${statusFilter === s ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-slate-400 border-slate-100"}`}
          >
            {s === "ALL" ? "Tous" : s}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-50 rounded-[2.5rem] shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Membre</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredAdmins.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/10 tracking-tighter">
                      {a.nom?.charAt(0)}{a.prenom?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-black text-slate-800 italic uppercase leading-none">{a.nom} {a.prenom}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">ID: {a._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-sm font-bold text-slate-600">{a.telephone}</p>
                  <p className="text-xs text-slate-400">{a.email || "Pas d'email"}</p>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${getStatusBadge(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-6 text-right space-x-2">
                  <Link to={`/admin/admins/${a._id}`} className="inline-flex p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all">
                    <Eye size={18} />
                  </Link>
                  <button
                    onClick={() => handleStatusChange(a._id, a.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                    className={`p-2.5 rounded-xl transition-all ${a.status === "ACTIVE" ? "bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white" : "bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white"}`}
                  >
                    {a.status === "ACTIVE" ? <UserX size={18} /> : <ShieldCheck size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md p-4">
          <NewAdminForm onClose={() => setShowForm(false)} onCreated={refresh} />
        </div>
      )}
      <Pagination meta={meta} setPage={setPage} />
    </div>
  );
}