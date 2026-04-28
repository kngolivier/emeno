// FILE: src/pages/clients/ClientsList.jsx

import { useState, useEffect } from "react";
import { Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// API
import {
  fetchClients,
  createClient,
  updateUserStatus
} from "../../api/users.api";

// Notifications
import { notifySuccess, notifyError } from "../../utils/notify";

// Form
import NewClientForm from "./NewClientForm";

export default function ClientsList() {

  // ======================
  // STATE
  // ======================
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ======================
  // LOAD CLIENTS
  // ======================
  const loadClients = async () => {
    try {
      setLoading(true);

      const res = await fetchClients();
      const data = res?.data?.data || res?.data || res;

      setClients(data);

    } catch (err) {
      notifyError("Erreur chargement clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // ======================
  // CREATE CLIENT
  // ======================
  const handleSave = async (client) => {
    try {
      await createClient(client);

      notifySuccess("Client créé avec succès");

      setShowForm(false);
      await loadClients();

    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  // ======================
  // TOGGLE STATUS
  // ======================
  const toggleClientStatus = async (client) => {
    try {
      if (client.status === "DELETED") return;

      let newStatus = client.status;

      if (client.status === "ACTIVE") newStatus = "INACTIVE";
      else if (client.status === "INACTIVE") newStatus = "ACTIVE";

      await updateUserStatus(client._id, newStatus);

      setClients((prev) =>
        prev.map((c) =>
          c._id === client._id
            ? { ...c, status: newStatus }
            : c
        )
      );

      notifySuccess("Statut mis à jour");

    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  // ======================
  // FILTERS
  // ======================
  const filteredClients = clients
    .filter((c) => {
      if (statusFilter === "ALL") return true;
      return c.status === statusFilter;
    })
    .filter((c) =>
      `${c.nom} ${c.prenom}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      c.telephone?.includes(search)
    );

  // ======================
  // STATUS STYLE
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
      default:
        return "bg-slate-400";
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50/50 min-h-screen">

      {/* HEADER */}
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
            Total : {clients.length}
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
        {["ALL", "ACTIVE", "INACTIVE", "BLOCKED", "DELETED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
              statusFilter === s
                ? "bg-[#002E1B] text-white border-[#002E1B]"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TABLE */}
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

                  {/* CLIENT */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">

                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm group-hover:scale-105 transition">
                        {c.nom?.charAt(0)}{c.prenom?.charAt(0)}
                      </div>

                      <span className={`font-bold text-slate-700 group-hover:text-[#002E1B] ${
                        isDeleted ? "line-through opacity-60" : ""
                      }`}>
                        {c.nom} {c.prenom}
                      </span>

                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {c.telephone}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase border ${getStatusStyle(c.status)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(c.status)}`}></span>
                      {c.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5 text-right flex justify-end gap-2">

                    {/* LINK (LIKE ORDERS) */}
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

      {/* EMPTY */}
      {filteredClients.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          Aucun client trouvé
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <NewClientForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

    </div>
  );
}