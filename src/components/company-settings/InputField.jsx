// src/components/company-settings/InputField.jsx

import React from "react";

export default function InputField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="w-full">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-14 bg-slate-50 dark:bg-[#0B1120] border-2 border-slate-100 dark:border-white/5 rounded-[1.5rem] px-5 text-sm font-black text-primary dark:text-white placeholder:text-slate-300 outline-none focus:border-secondary/40 transition-all"
      />
    </div>
  );
}