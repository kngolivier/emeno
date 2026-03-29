import { useState } from "react";
import { drivers as mockDrivers } from "../../data/mockDrivers";
import { Plus, Edit, Trash, Search, X } from "lucide-react";
import NewDriverForm from "./NewDriverForm";

export default function DriversList() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm)
  );

  const [driversList, setDriversList] = useState(drivers);

function toggleDriverStatus(id) {
  setDriversList(prev =>
    prev.map(d => 
      d.id === id 
        ? { ...d, status: d.status === "actif" ? "inactif" : "actif" } 
        : d
    )
  );
}

  const handleSave = (driver) => {
    setDrivers((prev) => {
      const exists = prev.find((d) => d.id === driver.id);
      if (exists) {
        return prev.map((d) => (d.id === driver.id ? driver : d));
      }
      return [...prev, driver];
    });
    setShowForm(false);
    setEditingDriver(null);
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Bloquer ce livreur ?")) {
      setDrivers(drivers.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Recherche */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Livreurs</h1>
        <div className="flex gap-3 flex-1 sm:flex-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full border rounded-xl p-2 pl-10 text-sm bg-white  border border-slate"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => { setShowForm(true); setEditingDriver(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            <Plus size={16} /> Nouveau
          </button>
        </div>
      </div>

      {/* Tableau des livreurs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500">Nom</th>
              <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500">Téléphone</th>
              <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500">Véhicule</th>
              <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500">Statut</th>
              <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredDrivers.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium">{d.name}</td>
                <td className="px-6 py-4">{d.phone}</td>
                <td className="px-6 py-4">{d.vehicle}</td>
                <td className="px-6 py-4">{d.status}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => toggleDriverStatus(d.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDrivers.length === 0 && (
          <div className="py-10 text-center text-slate-500">Aucun livreur trouvé</div>
        )}
      </div>

      {/* Formulaire en modal / drawer */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
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