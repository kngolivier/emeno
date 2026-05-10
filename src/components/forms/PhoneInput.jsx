// src/components/forms/PhoneInput.jsx

import React from "react";

export default function PhoneInput({
  value = "",
  onChange,
  label = "Numéro de téléphone",
  error,
  placeholder = "6x -- -- --",
  disabled = false
}) {
  
  // Formatage visuel : XX -- -- --
  const formatDisplay = (val) => {
    const cleaned = val.replace("+241", "").replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/);
    if (!match) return cleaned;
    
    return [match[1], match[2], match[3], match[4]]
      .filter(group => !!group)
      .join(" ");
  };

  const handleChange = (e) => {
    // On ne garde que les 8 chiffres significatifs
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 8);
    const fullValue = cleaned ? `+241${cleaned}` : "";
    onChange?.(fullValue);
  };

  // Extraction des chiffres pour l'input
  const rawDigits = value.replace("+241", "");

  return (
    <div className="w-full group">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 block transition-colors group-focus-within:text-secondary">
          {label}
        </label>
      )}

      <div
        className={`flex items-center bg-slate-50 dark:bg-white/5 border-2 rounded-2xl overflow-hidden transition-all duration-300
          ${error 
            ? "border-red-400/50 ring-4 ring-red-500/10" 
            : "border-transparent focus-within:border-secondary/30 focus-within:ring-4 focus-within:ring-secondary/10"
          }`}
      >
        {/* Préfixe visuel Gabonais */}
        <div className="flex items-center gap-2 px-4 py-4 bg-slate-100/50 dark:bg-white/5 border-r border-slate-200 dark:border-white/10 select-none">
          {/* Drapeau du Gabon */}
          <div className="flex flex-col w-5 h-3.5 rounded-sm overflow-hidden shadow-sm shrink-0">
            <div className="h-1/3 bg-[#009E60]" />
            <div className="h-1/3 bg-[#FCD116]" />
            <div className="h-1/3 bg-[#3A75C4]" />
          </div>
          
          <span className="flex items-center text-sm font-black text-primary dark:text-primary italic tracking-tighter">
            +241
            <span className="text-secondary ml-0.5 opacity-60">(0)</span>
          </span>
        </div>

        {/* Input de saisie */}
        <input
          type="tel"
          value={formatDisplay(rawDigits)}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent px-4 py-4 text-base font-bold text-primary placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none italic tracking-widest"
        />
      </div>

      {/* Messages d'aide / Erreur */}
      {error ? (
        <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mt-2 ml-2">
          {error}
        </p>
      ) : (
        <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 mt-2 ml-2 uppercase tracking-tight">
          Format attendu : <span className="text-secondary/60 italic">1x, 6x ou 7x</span> suivi de 6 chiffres
        </p>
      )}
    </div>
  );
}