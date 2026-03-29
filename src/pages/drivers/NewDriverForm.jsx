// src/components/drivers/NewDriverForm.jsx
import { useState } from "react";

export default function NewDriverForm({ onSave, onCancel, driver }) {
  const [name, setName] = useState(driver?.name || "");
  const [phone, setPhone] = useState(driver?.phone || "");
  const [vehicle, setVehicle] = useState(driver?.vehicle || "");
  const [status, setStatus] = useState(driver?.status || "Actif");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !vehicle) return;
    onSave({
      id: driver?.id || Date.now(),
      name,
      phone,
      vehicle,
      status,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">{driver ? "Modifier le livreur" : "Nouveau livreur"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-blue-700 ">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl p-2 mt-1 text-sm bg-white  border border-slate-500"
            placeholder="Nom complet"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 ">Téléphone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-xl p-2 mt-1 text-sm bg-white  border border-slate-500"
            placeholder="Numéro"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Véhicule</label>
          <input
            type="text"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full border rounded-xl p-2 mt-1 text-sm bg-white  border border-slate-500"
            placeholder="Moto, Voiture..."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-xl p-2 mt-1 text-sm bg-white  border border-slate-500"
          >
            <option>Actif</option>
            <option>Inactif</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            {driver ? "Modifier" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}