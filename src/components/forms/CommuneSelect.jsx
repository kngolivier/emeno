// FILE: src/components/forms/CommuneSelect.jsx
import { useState, useEffect } from "react";
import { fetchCommunes } from "../../api/commune.api";

export default function CommuneSelect({ value, onChange, label, error }) {
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunes = async () => {
      try {
        const res = await fetchCommunes();
        // On ne garde que les communes actives pour la sélection client/admin
        const data = res?.data || res;
        setCommunes(data.filter(c => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder));
      } catch (err) {
        console.error("Erreur chargement communes:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCommunes();
  }, []);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    // On trouve l'objet commune correspondant à l'ID sélectionné
    const selectedCommune = communes.find(c => c._id === selectedId);
    
    // On renvoie l'ID et le nom (ou null si vide)
    onChange(selectedId, selectedCommune ? selectedCommune.name : "");
  };

  return (
    <div className="w-full group">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block transition-colors group-focus-within:text-secondary">
          {label}
        </label>
      )}

      <div className={`relative flex items-center bg-slate-50 border-2 rounded-2xl transition-all duration-300 ${
        error ? "border-red-400 ring-4 ring-red-500/10" : "border-transparent focus-within:border-secondary/30 focus-within:ring-4 focus-within:ring-secondary/10"
      }`}>
        <select
          value={value}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-transparent px-4 py-4 text-sm font-bold text-primary outline-none italic appearance-none"
        >
          <option value="">{loading ? "Chargement..." : "Sélectionner une zone"}</option>
          {communes.map((commune) => (
            <option key={commune._id} value={commune._id}>
              {commune.name.toUpperCase()}
            </option>
          ))}
        </select>
        
        {/* Indicateur visuel pour le select custom */}
        <div className="absolute right-4 pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
      
      {error && <p className="text-[9px] font-black uppercase text-red-500 mt-2 ml-2">{error}</p>}
    </div>
  );
}