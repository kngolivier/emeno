// src/components/forms/CompactPhoneInput.jsx

import React from "react";

export default function CompactPhoneInput({ value, onChange, placeholder = "+241 6x -- -- --" }) {
  const formatDisplay = (val) => {
    const cleaned = val.replace("+241", "").replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  };

  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 8);
    onChange(cleaned ? `+241${cleaned}` : "");
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-3.5 text-[10px] font-black text-slate-400 pointer-events-none italic">
        +241
      </div>
      <input
        type="tel"
        inputMode="numeric"
        required
        placeholder={placeholder}
        value={formatDisplay(value)}
        onChange={handleChange}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl pl-11 pr-3 py-3 text-xs font-black text-primary dark:text-white font-mono focus:outline-none focus:border-secondary transition-colors"
      />
    </div>
  );
}