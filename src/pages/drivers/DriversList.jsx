import { useState } from "react";
import { drivers as mockDrivers } from "../../data/mockDrivers";
import { Plus, Edit, Trash, Ban, Search, X } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Header & Recherche */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Titre avec le vert profond du logo */}
        <h1 className="text-2xl font-bold text-[#002E1B]">Livreurs</h1>
        
        <div className="flex gap-3 flex-1 sm:flex-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#B08D3E]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full border rounded-xl p-2 pl-10 text-sm bg-white border-slate-200 focus:ring-2 focus:ring-[#B08D3E]/20 focus:border-[#B08D3E] outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#002E1B]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Bouton Nouveau : Vert logo avec effet hover doré */}
          <button
            onClick={() => { setShowForm(true); setEditingDriver(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#002E1B] text-white rounded-xl hover:bg-[#002E1B]/90 transition-colors shadow-sm"
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
              <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-[#002E1B]">{d.name}</td>
                <td className="px-6 py-4 text-slate-600">{d.phone}</td>
                <td className="px-6 py-4 text-slate-600">{d.vehicle}</td>
                <td className="px-6 py-4">
                  {/* Badge de statut utilisant le doré pour le style actif */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    d.status === "actif" 
                      ? "bg-[#B08D3E]/10 text-[#B08D3E]" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="p-2 text-[#B08D3E] hover:bg-[#B08D3E]/10 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => toggleDriverStatus(d.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Bloquer"
                  >
                    <Ban size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDrivers.length === 0 && (
          <div className="py-10 text-center text-slate-500 italic">Aucun livreur trouvé</div>
        )}
      </div>

      {/* Formulaire en modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[#002E1B]/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
