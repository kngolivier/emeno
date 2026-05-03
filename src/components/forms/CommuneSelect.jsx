// FILE: src/components/forms/CommuneSelect.jsx

import { formatCommune } from "../../utils/formatter";
import { COMMUNES } from "../../constants/communes";

export default function CommuneSelect({ value, onChange, label }) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-primary/70 mb-1 block">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none"
      >
        <option value="">Sélectionner une commune</option>

        {COMMUNES.map((commune) => (
          <option key={commune} value={commune}>
            {formatCommune(commune)}
          </option>
        ))}
      </select>
    </div>
  );
}