// src/components/forms/PhoneInput.jsx
import React from "react";
import { motion } from "framer-motion";
import { Phone, AlertCircle } from "lucide-react";

export default function PhoneInput({
  value = "",
  onChange,
  label = "Numéro de téléphone",
  error,
  placeholder = "6x -- -- --",
  disabled = false
}) {
  
  // Formatage visuel pour le Gabon : XX XX XX XX
  const formatDisplay = (val) => {
    const cleaned = val.replace("+241", "").replace(/\D/g, "");
    // On regroupe par paires de chiffres pour la lisibilité
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/);
    if (!match) return cleaned;
    
    return [match[1], match[2], match[3], match[4]]
      .filter(group => !!group)
      .join(" ");
  };

  const handleChange = (e) => {
    // On extrait uniquement les chiffres, max 8 (format gabonais standard sans le préfixe)
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 8);
    // Stockage en format international standard pour la DB
    const fullValue = cleaned ? `+241${cleaned}` : "";
    onChange?.(fullValue);
  };

  // On extrait les chiffres pour l'affichage interne
  const rawDigits = value.replace("+241", "");

  return (
    <div className="w-full group">
      {label && (
        <div className="flex justify-between items-center mb-3 px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-secondary italic">
            {label}
          </label>
          {error && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
        </div>
      )}

      <div
        className={`flex items-center bg-white dark:bg-[#0B1120] border-2 rounded-[1.5rem] overflow-hidden transition-all duration-500 shadow-sm
          ${error 
            ? "border-red-500/20 ring-4 ring-red-500/5" 
            : "border-slate-100 dark:border-white/5 focus-within:border-secondary/30 focus-within:ring-4 focus-within:ring-secondary/10 focus-within:shadow-xl focus-within:shadow-secondary/5"
          } ${disabled ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
      >
        {/* INDICATEUR PAYS (GABON) */}
        <div className="flex items-center gap-3 px-5 py-5 bg-slate-50 dark:bg-white/5 border-r border-slate-100 dark:border-white/5 select-none shrink-0">
          {/* Drapeau du Gabon stylisé */}
          <div className="flex flex-col w-6 h-4 rounded-[2px] overflow-hidden shadow-sm">
            <div className="h-1/3 bg-[#009E60]" />
            <div className="h-1/3 bg-[#FCD116]" />
            <div className="h-1/3 bg-[#3A75C4]" />
          </div>
          
          <span className="flex items-center text-sm font-black text-primary dark:text-white italic tracking-tighter">
            +241
            <span className="text-secondary ml-1 opacity-40 font-bold not-italic text-[10px]">(0)</span>
          </span>
        </div>

        {/* INPUT DE SAISIE */}
        <input
          type="tel"
          value={formatDisplay(rawDigits)}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="tel-national"
          className="w-full bg-transparent px-5 py-5 text-base font-black text-primary dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700 outline-none italic tracking-[0.1em]"
        />
        
        <div className="pr-5 text-slate-200 dark:text-slate-800">
            <Phone size={18} strokeWidth={2.5} />
        </div>
      </div>

      {/* MESSAGES DE VALIDATION / FEEDBACK */}
      <div className="min-h-[24px]"> 
        {error ? (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[9px] font-black uppercase tracking-widest text-red-500 mt-3 ml-2 flex items-center gap-1"
          >
            <span className="w-1 h-1 bg-red-500 rounded-full inline-block" /> {error}
          </motion.p>
        ) : (
          <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 mt-3 ml-2 uppercase tracking-[0.05em] flex items-center gap-2">
            <span className="w-1 h-1 bg-secondary/40 rounded-full inline-block" />
            Opérateurs : <span className="text-secondary/80 font-black italic">Airtel (7x, 1x) ou Moov (6x)</span>
          </p>
        )}
      </div>
    </div>
  );
}