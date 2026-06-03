// FILE: src/pages/services/ServiceDetails.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  RefreshCw
} from "lucide-react";

import { useTheme } from "../../context/Theme/ThemeContext";
import {
  getById,
  getWhatsappLink,
  remove,
  update
} from "../../api/service.api";
import { MODE_LABELS } from "../../constants/constants";

const DEFAULT_SERVICE_IMAGE_LIGHT =
  "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-light.png";

const DEFAULT_SERVICE_IMAGE_DARK =
  "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-dark.png";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [whLoading, setWhLoading] = useState(false);

  const [zoomOpen, setZoomOpen] = useState(false);

  const fallbackImage = isDarkMode
    ? DEFAULT_SERVICE_IMAGE_DARK
    : DEFAULT_SERVICE_IMAGE_LIGHT;

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await getById(id);
      const data = res?.data?.data || res?.data;
      setService(data);
    } catch (err) {
      console.error("Erreur fetch service:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const imageUrl =
    typeof service?.image === "string"
      ? service.image
      : service?.image?.url || fallbackImage;

  const isActive = service?.isActive ?? true;

  const statusUI = useMemo(() => {
    return isActive
      ? {
          label: "ACTIVE",
          icon: <CheckCircle size={12} />,
          className: "bg-emerald-500/10 text-emerald-500"
        }
      : {
          label: "INACTIVE",
          icon: <XCircle size={12} />,
          className: "bg-rose-500/10 text-rose-500"
        };
  }, [isActive]);

  // ========================
  // ACTIONS
  // ========================

  const handleDelete = async () => {
    if (!window.confirm("Supprimer ce service ?")) return;

    try {
      setActionLoading(true);
      await remove(id);
      navigate("/admin/services");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setToggling(true);

      await update(id, {
        isActive: !isActive
      });

      await fetchService();
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  const handleWhatsApp = async () => {
    try {
      setWhLoading(true);

      const res = await getWhatsappLink(id);
      const link = res?.data?.link || res?.data?.data?.link;

      if (link) window.open(link, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error(err);
    } finally {
      setWhLoading(false);
    }
  };

  // ========================
  // STATES
  // ========================

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Chargement du service...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-10 text-center text-red-500">
        Service introuvable
      </div>
    );
  }

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
        <div className="relative h-44 bg-gradient-to-r from-primary via-slate-900 to-black p-6 flex items-end justify-between overflow-hidden">

          {/* décor */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/20 blur-[80px] rounded-full" />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md"
          >
            <X size={18} />
          </button>

          {/* IMAGE CLICKABLE */}
          <img
            src={imageUrl}
            onError={(e) => (e.target.src = fallbackImage)}
            onClick={() => setZoomOpen(true)}
            className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-2xl cursor-zoom-in hover:scale-[1.03] transition"
            alt={service.title}
          />
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8 pt-14 space-y-6">

          {/* TITLE */}
          <div className="mt-6">

            <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1 rounded-full ${statusUI.className}`}>
              {statusUI.icon}
              {statusUI.label}
            </span>

            <h2 className="text-3xl font-black text-primary dark:text-white uppercase italic mt-3">
              {service.title}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              {service.type} • {MODE_LABELS?.[service.pricingMode] || service.pricingMode}
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

            <InfoCard icon={<DollarSign size={14} />} label="Mode de tarification" value={service.pricingMode} />
            <InfoCard icon={<Tag size={14} />} label="Type" value={service.type} />
            <InfoCard icon={<Users size={14} />} label="WhatsApp" value={service.whatsappNumber || "N/A"} />
            <InfoCard icon={<Layers size={14} />} label="Ordre d'affichage" value={service.displayOrder ?? 0} />

          </div>

          {/* DESCRIPTION */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {service.description || "Aucune description"}
            </p>
          </div>

          {/* DATE */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              Créé le
            </span>

            <span className="font-black text-primary dark:text-white">
              {service.createdAt
                ? new Date(service.createdAt).toLocaleDateString("fr-FR")
                : "N/A"}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-3 gap-3 mt-6">

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="flex flex-col items-center justify-center gap-1 p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black uppercase text-[9px]"
            >
              <Trash2 size={16} />
              Supprimer
            </button>

            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className="flex flex-col items-center justify-center gap-1 p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl font-black uppercase text-[9px]"
            >
              <CheckCircle size={16} />
              Statut
            </button>

            <button
              onClick={handleWhatsApp}
              disabled={whLoading}
              className="flex flex-col items-center justify-center gap-1 p-4 bg-green-500 text-white rounded-2xl font-black uppercase text-[9px]"
            >
              WhatsApp
            </button>

          </div>

        </div>
      </div>
      <ImageModal
        open={zoomOpen}
        src={imageUrl}
        onClose={() => setZoomOpen(false)}
      />
    </div>
  );
}

function ImageModal({ open, src, onClose }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6"
    >
      <img
        src={src}
        className="max-w-full max-h-full rounded-2xl shadow-2xl"
        alt="preview"
      />
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="p-5 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg transition-all">

      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
        {icon}
        {label}
      </div>

      <p className="text-sm font-black text-primary dark:text-white mt-3">
        {value}
      </p>
    </div>
  );
}