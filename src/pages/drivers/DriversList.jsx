// FILE: src/pages/drivers/DriversList.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Ban,
  Search,
  X,
  Trash
} from "lucide-react";

import NewDriverForm from "./NewDriverForm";

// API
import {
  fetchDrivers,
  updateUserStatus,
  createDriver
} from "../../api/users.api";

import { notifySuccess, notifyError } from "../../utils/notify";

export default function DriversList() {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [loading, setLoading] = useState(true);


  // ======================
  // LOAD DRIVERS
  // ======================
  const loadDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetchDrivers();

      const data = res?.data?.data || res?.data || res;
      setDrivers(data);

    } catch (err) {
      console.error("Drivers load error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  // ======================
  // TOGGLE STATUS
  // ======================
  const toggleDriverStatus = async (driver) => {
    try {
      if (driver.status === "DELETED") return;

      let newStatus = driver.status;

      if (driver.status === "ACTIVE") newStatus = "INACTIVE";
      else if (driver.status === "INACTIVE") newStatus = "ACTIVE";

      await updateUserStatus(driver._id, newStatus);

      setDrivers((prev) =>
        prev.map((d) =>
          d._id === driver._id
            ? { ...d, status: newStatus }
            : d
        )
      );

    } catch (err) {
      alert(err.message);
    }
  };

  // ======================
  // FILTER
  // ======================
  const filteredDrivers = drivers.filter((d) =>
    `${d.nom} ${d.prenom}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    d.telephone?.includes(searchTerm)
  );

  // ======================
  // SAVE DRIVER
  // ======================
  const handleSave = async (driver) => {
    try {
      let savedDriver;

      // CREATE
      if (!driver._id) {
        const res = await createDriver(driver);

        // FIX API SHAPE
        savedDriver = res?.data?.data?.user 
                 || res?.data?.user 
                 || res?.data;

        notifySuccess("Livreur créé avec succès ");
      }

      // UPDATE (plus tard)
      else {
        savedDriver = driver;
      }

      setShowForm(false);
      setEditingDriver(null);

      // IMPORTANT : reload complet (source de vérité)
      await loadDrivers();

    } catch (err) {
      console.error("CREATE DRIVER ERROR:", err.message);
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <h1 className="text-2xl font-bold text-[#002E1B]">
          Livreurs
        </h1>

        <div className="flex gap-3 flex-1 sm:flex-auto">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full border rounded-xl p-2 pl-10 text-sm"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingDriver(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#002E1B] text-white rounded-xl"
          >
            <Plus size={16} /> Nouveau
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">

        <table className="w-full min-w-[600px]">

          <thead>
            <tr className="bg-slate-50 text-left text-slate-500 text-xs">
              <th className="p-4">Nom</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredDrivers.map((d) => {
              const isDeleted = d.status === "DELETED";

              return (
                <tr
                  key={d._id}
                  className={`border-t hover:bg-slate-50 ${isDeleted ? "opacity-40" : ""}`}
                >

                  <td className={`p-4 font-semibold text-[#002E1B] ${isDeleted ? "line-through" : ""}`}>

                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm group-hover:scale-105 transition">
                        {d.nom?.charAt(0)}{d.prenom?.charAt(0)}
                      </div>

                      <span className={`font-bold text-slate-700 group-hover:text-[#002E1B] ${
                        isDeleted ? "line-through opacity-60" : ""
                      }`}>
                        <Link to={`/drivers/${d._id}`} className="hover:underline text-[#002E1B]">
                          {d.nom} {d.prenom}
                        </Link>
                      </span>
                    </div>
                    
                  </td>

                  <td>{d.telephone}</td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      d.status === "ACTIVE"
                        ? "bg-green-50 text-green-600"
                        : d.status === "INACTIVE"
                        ? "bg-slate-100 text-slate-500"
                        : d.status === "BLOCKED"
                        ? "bg-red-50 text-red-500"
                        : "bg-black text-white"
                    }`}>
                      {d.status}
                    </span>
                  </td>

                  <td className="p-4 text-right flex justify-end gap-2">

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
                      className="text-red-500 disabled:opacity-30"
                    >
                      <Ban size={16} />
                    </button>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

        {filteredDrivers.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            Aucun livreur trouvé
          </div>
        )}

      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <NewDriverForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            driver={editingDriver}
          />
        </div>
      )}

    </div>
  );
}