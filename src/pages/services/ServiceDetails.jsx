// FILE: src/pages/services/ServiceDetails.jsx

import React, { useMemo, useState } from "react";
import {
  X,
  Calendar,
  DollarSign,
  Tag,
  Users,
  Layers,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  RefreshCw,
  MessageCircle
} from "lucide-react";

import { useTheme } from "../../context/Theme/ThemeContext";
import { getWhatsappLink, remove, update } from "../../api/service.api";

const DEFAULT_SERVICE_IMAGE_LIGHT =
  "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-light.png";
const DEFAULT_SERVICE_IMAGE_DARK =
  "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-dark.png";

const unwrap = (res) =>
  res?.data?.data || res?.data?.service || res?.data || res;

export default function ServiceDetails({ service, onClose, onEdit, onDelete, onRefresh }) {
  const { isDarkMode } = useTheme();

  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [whLoading, setWhLoading] = useState(false);

  if (!service) return null;

  const fallbackImage = isDarkMode
    ? DEFAULT_SERVICE_IMAGE_DARK
    : DEFAULT_SERVICE_IMAGE_LIGHT;

  const imageUrl = service.image?.url || fallbackImage;

  const isActive = service.isActive ?? true;

  const handleDelete = async () => {
    const confirmed = window.confirm("Supprimer ce service ?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await remove(service._id);
      onDelete?.(service._id);
      onClose?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setToggling(true);
    try {
      await update(service._id, {
        isActive: !isActive
      });

      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  const handleWhatsApp = async () => {
    setWhLoading(true);
    try {
      const res = await getWhatsappLink(service._id);
      const link = res?.data?.link || res?.data?.data?.link;

      if (link) window.open(link, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
    } finally {
      setWhLoading(false);
    }
  };

  const statusUI = useMemo(() => {
    return isActive
      ? {
          label: "ACTIVE",
          icon: <CheckCircle size={12} />,
          className:
            "bg-emerald-500/10 text-emerald-500"
        }
      : {
          label: "INACTIVE",
          icon: <XCircle size={12} />,
          className:
            "bg-rose-500/10 text-rose-500"
        };
  }, [isActive]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden w-full max-w-2xl mx-auto relative">

      {/* BACKDROP */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] flex items-center justify-center pointer-events-none">
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
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full"
          >
            <X size={18} />
          </button>

          <div className="flex items-end gap-4 translate-y-10">
            <img
              src={imageUrl}
              onError={(e) => (e.target.src = fallbackImage)}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
              alt={service.title}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8 pt-14 space-y-6">

          {/* TITLE */}
          <div>
            <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1 rounded-full ${statusUI.className}`}>
              {statusUI.icon}
              {statusUI.label}
            </span>

            <h2 className="text-2xl font-black text-primary dark:text-white uppercase italic mt-2">
              {service.title}
            </h2>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Service EMENO
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <DollarSign size={14} /> Mode pricing
              </div>
              <p className="text-sm font-black mt-2 text-primary dark:text-white">
                {service.pricingMode || "WHATSAPP_ONLY"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <Tag size={14} /> Type
              </div>
              <p className="text-sm font-black mt-2 text-primary dark:text-white">
                {service.type || "N/A"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <Users size={14} /> WhatsApp
              </div>
              <p className="text-sm font-black mt-2 text-primary dark:text-white">
                {service.whatsappNumber || "N/A"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <Layers size={14} /> Ordre
              </div>
              <p className="text-sm font-black mt-2 text-primary dark:text-white">
                {service.displayOrder ?? 0}
              </p>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="border-t pt-5 border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">
              Description
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {service.description}
            </p>
          </div>

          {/* META */}
          <div className="flex justify-between items-center bg-slate-50/40 dark:bg-white/[0.02] p-4 rounded-2xl text-[10px] font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              Créé le
            </div>
            <span className="text-primary dark:text-white">
              {service.createdAt
                ? new Date(service.createdAt).toLocaleDateString("fr-FR")
                : "N/A"}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-3 gap-2 pt-2">

            <button
              onClick={() => onEdit?.(service)}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase"
            >
              <Edit3 size={14} /> Modifier
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-3 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
              Supprimer
            </button>

            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className="p-3 rounded-xl text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500"
            >
              {toggling ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
              Statut
            </button>

          </div>

          {/* WHATSAPP */}
          <button
            onClick={handleWhatsApp}
            disabled={whLoading}
            className="w-full p-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase"
          >
            {whLoading ? "Génération..." : "Ouvrir WhatsApp"}
          </button>

        </div>
      </div>
    </div>
  );
}