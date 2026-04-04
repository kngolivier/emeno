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
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
      {/* Titre avec le vert EMENC */}
      <h2 className="text-xl font-bold mb-6 text-[#002E1B]">
        {driver ? "Modifier le livreur" : "Nouveau livreur"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#002E1B]/70 mb-1 block">
            Nom complet
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#B08D3E]/20 focus:border-[#B08D3E] outline-none transition-all"
            placeholder="Ex: Jean Dupont"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#002E1B]/70 mb-1 block">
            Téléphone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#B08D3E]/20 focus:border-[#B08D3E] outline-none transition-all"
            placeholder="+241 ..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#002E1B]/70 mb-1 block">
              Véhicule
            </label>
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#B08D3E]/20 focus:border-[#B08D3E] outline-none transition-all"
              placeholder="Moto, Auto..."
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#002E1B]/70 mb-1 block">
              Statut
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#B08D3E]/20 focus:border-[#B08D3E] outline-none transition-all bg-white"
            >
              <option>Actif</option>
              <option>Inactif</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-slate-500 font-medium hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          
          {/* Bouton d'action principal en Vert EMENC */}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#002E1B] text-white font-semibold hover:bg-[#002E1B]/90 shadow-md shadow-[#002E1B]/10 transition-all active:scale-95"
          >
            {driver ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
