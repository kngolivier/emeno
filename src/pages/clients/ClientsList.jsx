// FILE: src/pages/clients/ClientsList.jsx

import { useState } from "react";
import { Plus, Eye, Phone, Mail, UserCheck, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Pagination } from "../../components/Pagination";
import { createClient, updateUserStatus, fetchClients } from "../../api/users.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import NewClientForm from "./NewClientForm";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashbord/TotalCard";

export default function ClientsList() {
  const { data: clients = [], meta, loading, setPage, refresh, status, setStatus } = usePaginatedFetch(fetchClients, 10);
  const [showForm, setShowForm] = useState(false);

  const getStatusStyle = (s) => {
    switch (s) {
      case "ACTIVE": return "bg-emerald-500/10 text-emerald-600 border-emerald-100";
      case "BLOCKED": return "bg-primary/10 text-primary border-primary/10";
      case "DELETED": return "bg-black text-white border-black";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const handleSave = async (clientData) => {
    try {
      await createClient(clientData);
      notifySuccess("Client créé avec succès");
      setShowForm(false);
      refresh();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const toggleClientStatus = async (client) => {
    if (client.status === "DELETED") return;
    try {
      const newStatus = client.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateUserStatus(client._id, newStatus);
      refresh();
      notifySuccess("Statut mis à jour");
    } catch (err) {
      notifyError(err.message);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary font-display italic tracking-tighter">
            Clients
          </h1>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">
            Base de données utilisateurs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <TotalCard title="Total" value={meta?.total || 0} subtitle="Inscrits" />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Nouveau Client
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
              ${status === s ? "bg-primary text-white border-primary shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`}
          >
            {s === "ALL" ? "Tous les comptes" : s}
          </button>
        ))}
      </div>

      {/* --- VUE MOBILE : CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {clients.map((c) => (
          <div key={c._id} className={`bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm transition-all ${c.status === "DELETED" ? "opacity-40" : ""}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center font-display font-black italic border-4 border-slate-50 shadow-lg uppercase">
                {c.nom?.charAt(0)}{c.prenom?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-black text-primary italic text-lg tracking-tight truncate uppercase">
                  {c.nom} {c.prenom}
                </h3>
                <span className={`inline-block px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border ${getStatusStyle(c.status)}`}>
                  Compte {c.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 text-slate-500">
                <Phone size={14} className="text-slate-300" />
                <span className="text-xs font-bold">{c.telephone || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Mail size={14} className="text-slate-300" />
                <span className="text-xs font-medium truncate">{c.email || "Pas d'email"}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link 
                to={`/admin/clients/client-details/${c._id}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-primary text-[9px] font-black uppercase tracking-widest border border-slate-100 active:bg-slate-100 transition-colors"
              >
                <Eye size={14} /> Profil
              </Link>
              <button 
                onClick={() => toggleClientStatus(c)}
                className="px-4 py-3 rounded-xl border border-rose-100 text-rose-500 active:bg-rose-50 transition-colors"
              >
                <UserCheck size={16} />
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
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.map((c) => (
              <tr key={c._id} className={`hover:bg-slate-50/30 transition-colors group ${c.status === "DELETED" ? "opacity-30" : ""}`}>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-display font-black italic shadow-md uppercase text-sm">
                      {c.nom?.charAt(0)}{c.prenom?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-black text-primary italic text-lg tracking-tighter leading-none uppercase">
                        {c.nom} {c.prenom}
                      </p>
                      <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">ID: {c._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-700 italic">{c.telephone}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{c.email || "—"}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link 
                      to={`/admin/clients/client-details/${c._id}`} 
                      className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                      title="Voir le profil"
                    >
                      <Eye size={20} />
                    </Link>
                    <button 
                      onClick={() => toggleClientStatus(c)} 
                      disabled={c.status === "DELETED"}
                      className="px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                    >
                      {c.status === "ACTIVE" ? "Suspendre" : "Réactiver"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination meta={meta} setPage={setPage} />

      {/* MODAL FORMULAIRE */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl transform animate-in slide-in-from-bottom-8 duration-500">
            <NewClientForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}