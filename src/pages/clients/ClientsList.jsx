// FILE: src/pages/clients/ClientsList.jsx

import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { Pagination } from "../../components/Pagination";

import {
  createClient,
  updateUserStatus,
  fetchClients
} from "../../api/users.api";

import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";

import { notifySuccess, notifyError } from "../../utils/notify";
import NewClientForm from "./NewClientForm";

export default function ClientsList() {

  // ======================
  // HOOK
  // ======================
  const {
    data: clients = [],
    meta,
    loading,
    setPage,
    refresh,
    status,
    setStatus
  } = usePaginatedFetch(fetchClients, 10);

  // ======================
  // STATE
  // ======================
  const [showForm, setShowForm] = useState(false);
  // const [search, setSearch] = useState("");
  // const [statusFilter, setStatusFilter] = useState("ALL");

  // ======================
  // CREATE
  // ======================
  const handleSave = async (client) => {
    try {
      await createClient(client);
      notifySuccess("Client créé avec succès");
      setShowForm(false);
      refresh();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  // ======================
  // STATUS
  // ======================
  const toggleClientStatus = async (client) => {
    try {
      if (client.status === "DELETED") return;

      let newStatus = client.status;

      if (newStatus === "ACTIVE") newStatus = "INACTIVE";
      else if (newStatus === "INACTIVE") newStatus = "ACTIVE";

      await updateUserStatus(client._id, newStatus);

      refresh();
      notifySuccess("Statut mis à jour");

    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  // ======================
  // FILTERS
  // ======================
  const filteredClients = clients;

  // ======================
  // STATUS STYLE (FULL UI RESTORED)
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
    return <div className="p-6 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50/50 min-h-screen">

      {/* HEADER (RESTORED STYLE) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Annuaire Clients
          </h1>
          <p className="mt-1 text-slate-500 font-medium">
            Gestion des comptes clients
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
            Nouveau client
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

      {/* TABLE (FULL DESIGN RESTORED) */}
      <div className="bg-white rounded-3xl border shadow-xl overflow-hidden">

        <table className="w-full text-left border-separate border-spacing-0">

          <thead>
            <tr className="bg-slate-50/80">
              <th className="px-6 py-5 text-xs font-bold text-slate-400">Client</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400">Contact</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 text-center">Statut</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((c) => {
              const isDeleted = c.status === "DELETED";

              return (
                <tr
                  key={c._id}
                  className={`group border-t hover:bg-emerald-50/30 transition ${
                    isDeleted ? "opacity-40" : ""
                  }`}
                >

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">

                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm group-hover:scale-105 transition">
                        {c.nom?.charAt(0)}{c.prenom?.charAt(0)}
                      </div>

                      <span className="font-bold text-slate-700 group-hover:text-[#002E1B]">
                        {c.nom} {c.prenom}
                      </span>

                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
                    {c.telephone}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase border ${getStatusStyle(c.status)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(c.status)}`}></span>
                      {c.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right flex justify-end gap-2">

                    <Link
                      to={`client-details/${c._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs font-medium"
                    >
                      <Eye size={14} />
                      Voir
                    </Link>

                    <button
                      onClick={() => toggleClientStatus(c)}
                      disabled={isDeleted}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                        isDeleted
                          ? "opacity-30 cursor-not-allowed"
                          : "text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white"
                      }`}
                    >
                      Suspendre
                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

      {/* EMPTY STATE RESTORED */}
      {filteredClients.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          Aucun client trouvé
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <NewClientForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <Pagination meta={meta} setPage={setPage} />

    </div>
  );
}