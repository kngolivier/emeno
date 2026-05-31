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
  const formatDisplay = (val) => {
    const cleaned = val.replace("+241", "").replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  };

  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 8);
    onChange?.(cleaned ? `+241${cleaned}` : "");
  };

  const rawDigits = value.replace("+241", "");

  return (
    <div className="w-full group">
      {label && (
        <div className="flex justify-between items-center mb-2 px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label} <span className="text-rose-500 font-black">*</span> </label>
          {error && <AlertCircle size={14} className="text-red-500" />}
        </div>
      )}

      <div className={`flex items-center bg-white dark:bg-[#0B1120] border-2 rounded-[1.5rem] overflow-hidden transition-all shadow-sm h-16 ${
        error ? "border-red-500/20 ring-4 ring-red-500/5" : "border-slate-100 dark:border-white/5 focus-within:border-secondary/40"
      }`}>
        
        {/* Flag Section - Reduced width on small screens via flex shrink */}
        <div className="flex items-center gap-2 px-4 py-4 bg-slate-50 dark:bg-white/5 border-r border-slate-100 dark:border-white/5 shrink-0">
          <div className="flex flex-col w-5 h-3 rounded-[1px] overflow-hidden">
            <div className="h-1/3 bg-[#009E60]" /> <div className="h-1/3 bg-[#FCD116]" /> <div className="h-1/3 bg-[#3A75C4]" />
          </div>
          <span className="text-xs font-black text-primary dark:text-white italic tracking-tighter hidden sm:block">+241</span>
        </div>

        {/* Input */}
        <input
          type="tel"
          inputMode="numeric"
          value={formatDisplay(rawDigits)}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-full bg-transparent px-4 text-base font-black text-primary dark:text-white placeholder:text-slate-300 outline-none italic tracking-[0.1em]"
        />
        
        <div className="pr-4 text-slate-300 hidden sm:block">
            <Phone size={18} />
        </div>
      </div>

      <div className="min-h-[20px] mt-2 ml-1">
        {error ? (
          <p className="text-[9px] font-black text-red-500 uppercase">{error}</p>
        ) : (
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
            Format : 06x xx xx xx
          </p>
        )}
      </div>
    </div>
  );
}