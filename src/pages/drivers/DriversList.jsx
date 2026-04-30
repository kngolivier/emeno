import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Search, X } from "lucide-react";

import NewDriverForm from "./NewDriverForm";
import { Pagination } from "../../components/Pagination";

import {
  fetchDrivers,
  updateUserStatus,
  createDriver
} from "../../api/users.api";

import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";

export default function DriversList() {

  // ======================
  // HOOK (SOURCE UNIQUE)
  // ======================
  const {
    data: drivers = [],
    meta,
    loading,
    setPage,
    setStatus,
    status,
    refresh
  } = usePaginatedFetch(fetchDrivers, 10);

  // ======================
  // STATE UI
  // ======================
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  // ======================
  // CREATE / UPDATE
  // ======================
  const handleSave = async (driver) => {
    try {
      if (!driver._id) {
        await createDriver(driver);
        notifySuccess("Livreur créé avec succès");
      }

      setShowForm(false);
      setEditingDriver(null);

      refresh();

    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  // ======================
  // STATUS UPDATE
  // ======================
  const toggleDriverStatus = async (driver) => {
    try {
      if (driver.status === "DELETED") return;

      let newStatus = driver.status;

      if (newStatus === "ACTIVE") newStatus = "INACTIVE";
      else if (newStatus === "INACTIVE") newStatus = "ACTIVE";

      await updateUserStatus(driver._id, newStatus);

      refresh();
      notifySuccess("Statut mis à jour");

    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  // ======================
  // FILTERS
  // ======================
  const filteredDrivers = drivers;

  // ======================
  // STATUS UI
  // ======================
  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-600 border-green-100/50";
      case "INACTIVE":
        return "bg-slate-100 text-slate-500 border-slate-200";
      case "BLOCKED":
        return "bg-red-50 text-red-500 border-red-100/50";
      case "DELETED":
        return "bg-black text-white border-black";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500";
      case "INACTIVE":
        return "bg-slate-400";
      case "BLOCKED":
        return "bg-red-500";
      case "DELETED":
        return "bg-black";
      case "PENDING":
        return "bg-amber-500";
      default:
        return "bg-slate-400";
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50/50 min-h-screen">

      {/* HEADER (STYLE RESTAURÉ) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Annuaire Livreurs
          </h1>
          <p className="mt-1 text-slate-500 font-medium">
            Gestion des comptes livreurs
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span className="px-4 py-2 bg-white border rounded-xl text-sm font-semibold text-slate-700 shadow-sm">
            Total : {meta?.total || 0}
          </span>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#002E1B] text-white rounded-xl"
          >
            <Plus size={16} />
            Nouveau livreur
          </button>

        </div>

      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2">
      {["ALL", "ACTIVE", "INACTIVE", "BLOCKED"].map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
            status === s
              ? "bg-[#002E1B] text-white border-[#002E1B]"
              : "bg-white text-slate-600 border-slate-200"
          }`}
        >
          {s}
        </button>
      ))}
    </div>

      {/* TABLE (UI RESTORED CLIENT-LIKE STYLE) */}
      <div className="bg-white rounded-3xl border shadow-xl overflow-hidden">

        <table className="w-full text-left border-separate border-spacing-0">

          <thead>
            <tr className="bg-slate-50/80">
              <th className="px-6 py-5 text-xs font-bold text-slate-400">Livreur</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400">Contact</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 text-center">Statut</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDrivers.map((d) => {
              const isDeleted = d.status === "DELETED";

              return (
                <tr
                  key={d._id}
                  className={`group border-t hover:bg-emerald-50/30 transition ${
                    isDeleted ? "opacity-40" : ""
                  }`}
                >

                  {/* DRIVER */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">

                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm group-hover:scale-105 transition">
                        {d.nom?.charAt(0)}{d.prenom?.charAt(0)}
                      </div>

                      <span className="font-bold text-slate-700 group-hover:text-[#002E1B]">
                        <Link to={`/drivers/${d._id}`}>
                          {d.nom} {d.prenom}
                        </Link>
                      </span>

                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {d.telephone}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase border ${getStatusStyle(d.status)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(d.status)}`} />
                      {d.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5 text-right flex justify-end gap-2">

                    <button
                      onClick={() => handleEdit(d)}
                      disabled={isDeleted}
                      className="text-[#B08D3E] disabled:opacity-30"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => toggleDriverStatus(d)}
                      disabled={isDeleted}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                        isDeleted
                          ? "opacity-30 cursor-not-allowed"
                          : "text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white"
                      }`}
                    >
                      {d.status === "INACTIVE" ? "Activer" : "Suspendre"}
                    </button>

                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

      {/* EMPTY */}
      {filteredDrivers.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          Aucun livreur trouvé
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <NewDriverForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingDriver(null);
            }}
            driver={editingDriver}
          />
        </div>
      )}

      <Pagination meta={meta} setPage={setPage} />

    </div>
  );
}