// src/components/forms/CommuneSelect.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ChevronDown, Loader2 } from "lucide-react";
import { fetchCommunes } from "../../api/commune.api";

export default function CommuneSelect({ value, onChange, label, error, placeholder = "Sélectionner une zone" }) {
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunes = async () => {
      try {
        const res = await fetchCommunes();
        const rawData = res?.data?.data || res?.data || res;
        
        if (Array.isArray(rawData)) {
            const activeCommunes = rawData
                .filter(c => c.isActive)
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            setCommunes(activeCommunes);
        }
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
    const selectedCommune = communes.find(c => c._id === selectedId);
    onChange(selectedId, selectedCommune ? selectedCommune.name : "");
  };

  return (
    <div className="w-full group">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 block ml-1 transition-colors group-focus-within:text-secondary italic">
          {label}
        </label>
      )}

      <div className={`relative flex items-center bg-white dark:bg-primary-light border-2 rounded-2xl transition-all duration-300 shadow-sm overflow-hidden
        ${error 
          ? "border-red-500/50 ring-4 ring-red-500/5" 
          : "border-slate-200 dark:border-white/5 focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/10"
        }`}>
        
        <div className="pl-4 text-slate-400 dark:text-slate-500 group-focus-within:text-secondary transition-colors">
            <Map size={18} strokeWidth={2.5} />
        </div>

        <select
          value={value}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-transparent px-4 py-4 text-[13px] font-bold text-primary dark:text-white outline-none italic appearance-none cursor-pointer disabled:cursor-wait"
        >
          <option value="" className="bg-white dark:bg-primary-light">{loading ? "Synchronisation..." : placeholder}</option>
          {communes.map((commune) => (
            <option key={commune._id} value={commune._id} className="bg-white dark:bg-primary-light">
              {commune.name.toUpperCase()}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-secondary transition-transform group-focus-within:rotate-180 duration-300">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-secondary" />
          ) : (
            <ChevronDown size={18} strokeWidth={3} />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-black uppercase tracking-widest text-red-500 mt-2 ml-1 flex items-center gap-1"
          >
            <span className="w-1 h-1 bg-red-500 rounded-full" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}