// FILE: src/pages/services/ServiceDetails.jsx

import React, { useState } from "react";
import {
  X,
  Calendar,
  DollarSign,
  Tag,
  User,
  Layers,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  RefreshCw,
  Users
} from "lucide-react";

import { useTheme } from "../../context/Theme/ThemeContext";

const DEFAULT_SERVICE_IMAGE_LIGHT =
  "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-light.png";
const DEFAULT_SERVICE_IMAGE_DARK =
  "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-dark.png";

export default function ServiceDetails({ service, onClose, onEdit, onDelete }) {
  const { isDarkMode } = useTheme();

  const [loading, setLoading] = useState(false);

  if (!service) return null;

  const fallbackImage = isDarkMode
    ? DEFAULT_SERVICE_IMAGE_DARK
    : DEFAULT_SERVICE_IMAGE_LIGHT;

  const imageUrl = service.image?.url || fallbackImage;

  const handleDelete = async () => {
    if (!window.confirm("Supprimer ce service ?")) return;
    setLoading(true);
    try {
      await onDelete?.(service._id);
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden w-full max-w-2xl mx-auto animate-in fade-in duration-300 relative">

      {/* BACKDROP IMAGE */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] pointer-events-none flex items-center justify-center">
        <img
          src={imageUrl}
          onError={(e) => (e.target.src = fallbackImage)}
          className="w-[600px] h-[600px] object-cover blur-[2px] rounded-full"
          alt=""
        />
      </div>

      <div className="relative z-10 max-h-[85vh] overflow-y-auto">

        {/* HEADER */}
        <div className="h-36 bg-gradient-to-r from-primary to-slate-900 p-6 flex items-end justify-between relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition"
          >
            <X size={18} />
          </button>

          <div className="flex items-end gap-4 translate-y-10">
            <img
              src={imageUrl}
              onError={(e) => (e.target.src = fallbackImage)}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
              alt={service.name}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8 pt-14 space-y-6">

          {/* TITLE */}
          <div>
            <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              service.status === "ACTIVE"
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-rose-500"
            }`}>
              {service.status === "ACTIVE" ? <CheckCircle size={12} /> : <XCircle size={12} />}
              {service.status}
            </span>

            <h2 className="text-2xl font-black text-primary dark:text-white uppercase italic mt-2">
              {service.name}
            </h2>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Service EMENO Premium
            </p>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <DollarSign size={14} /> Prix
              </div>
              <p className="text-xl font-black text-primary dark:text-white mt-2">
                {service.price ? `${service.price} FCFA` : "Gratuit"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <Tag size={14} /> Catégorie
              </div>
              <p className="text-sm font-black text-primary dark:text-white mt-2">
                {service.category || "Non définie"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <Users size={14} /> Clients
              </div>
              <p className="text-xl font-black text-primary dark:text-white mt-2">
                {service.clientsCount || 0}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <Layers size={14} /> Plans
              </div>
              <p className="text-xl font-black text-primary dark:text-white mt-2">
                {service.plansCount || 0}
              </p>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Description
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {service.description || "Aucune description disponible pour ce service."}
            </p>
          </div>

          {/* META */}
          <div className="flex justify-between items-center bg-slate-50/40 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              Créé le
            </div>
            <span className="text-primary dark:text-white font-black">
              {service.createdAt
                ? new Date(service.createdAt).toLocaleDateString("fr-FR")
                : "N/A"}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-3 gap-2 pt-2">

            <button
              onClick={() => onEdit?.(service)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-secondary rounded-xl font-black text-[10px] uppercase"
            >
              <Edit3 size={14} /> Modifier
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center justify-center gap-2 p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl font-black text-[10px] uppercase transition"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Supprimer
            </button>

            <button
              className={`flex items-center justify-center gap-2 p-3 rounded-xl font-black text-[10px] uppercase ${
                service.status === "ACTIVE"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-400"
              }`}
            >
              <CheckCircle size={14} /> Statut
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}