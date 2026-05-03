// FILE: src/components/forms/PhoneInput.jsx

import React from "react";

export default function PhoneInput({
  value = "",
  onChange,
  label = "Téléphone",
  error,
  placeholder = "XXXXXXXX",
  disabled = false
}) {
  // Always enforce +241 prefix
  const normalizeValue = (val) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 8);
    return "+241" + cleaned;
  };

  const displayValue = (val) => {
    if (!val) return "";
    return val.replace("+241", "");
  };

  const handleChange = (e) => {
    const full = normalizeValue(e.target.value);
    onChange?.(full);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-primary/70 mb-1 block">
          {label}
        </label>
      )}

      <div
        className={`flex border rounded-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-secondary/20
          ${error ? "border-red-400 focus-within:ring-red-200" : "border-slate-200"}`}
      >
        <span className="bg-slate-100 px-3 flex items-center text-sm text-slate-600">
          +241
        </span>

        <input
          value={displayValue(value)}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-3 text-sm outline-none"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
