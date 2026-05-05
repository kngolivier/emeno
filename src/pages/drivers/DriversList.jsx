import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, UserX } from "lucide-react";
import NewDriverForm from "./NewDriverForm";
import { Pagination } from "../../components/Pagination";
import { fetchDrivers, updateUserStatus, createDriver } from "../../api/users.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashbord/TotalCard";

export default function DriversList() {
  const { data: drivers = [], meta, loading, setPage, setStatus, status, refresh } = usePaginatedFetch(fetchDrivers, 10);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const getStatusStyle = (s) => {
    switch (s) {
      case "ACTIVE": return "bg-emerald-500/10 text-emerald-600 border-emerald-100";
      case "INACTIVE": return "bg-slate-100 text-slate-500 border-slate-200";
      case "BLOCKED": return "bg-primary/10 text-primary border-primary/10";
      case "DELETED": return "bg-black text-white border-black";
      default: return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  const handleSave = async (driver) => {
    try {
      if (!driver._id) await createDriver(driver);
      notifySuccess("Livreur enregistré");
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
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary font-display italic tracking-tighter">
            Livreurs
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-[0.1em]">
            Gestion de la flotte logistique
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <TotalCard title="Actifs" value={meta?.total || 0} subtitle="Livreurs" />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-[1.5rem] bg-primary text-white hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 text-xs font-black uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={3} />
            Ajouter
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["ALL", "ACTIVE", "INACTIVE", "BLOCKED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap
              ${status === s ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-slate-400 border-slate-100"}`}
          >
            {s === "ALL" ? "Tous" : s}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-50 rounded-[2rem] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identité</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {drivers.map((d) => (
                <tr key={d._id} className={`hover:bg-slate-50/50 transition-colors group ${d.status === "DELETED" ? "opacity-30" : ""}`}>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-display font-black text-primary italic shadow-inner">
                        {d.nom?.charAt(0)}{d.prenom?.charAt(0)}
                      </div>
                      <Link to={`/admin/drivers/${d._id}`} className="font-display font-black text-primary italic text-lg tracking-tight hover:text-secondary transition-colors">
                        {d.nom} {d.prenom}
                      </Link>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-bold text-slate-600 font-sans">{d.telephone}</td>
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${getStatusStyle(d.status)}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-2">
                    <button onClick={() => { setEditingDriver(d); setShowForm(true); }} className="p-2 text-slate-400 hover:text-secondary transition-colors">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => toggleDriverStatus(d)} 
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${d.status === "ACTIVE" ? "border-primary/20 text-primary hover:bg-primary hover:text-white" : "border-emerald-200 text-emerald-600 hover:bg-emerald-500 hover:text-white"}`}
                    >
                      {d.status === "ACTIVE" ? "Suspendre" : "Activer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination meta={meta} setPage={setPage} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md p-4">
          <NewDriverForm 
            driver={editingDriver} 
            onSave={handleSave} 
            onCancel={() => { setShowForm(false); setEditingDriver(null); }} 
          />
        </div>
      )}
    </div>
  );
}