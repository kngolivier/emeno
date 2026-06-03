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
        <div className="h-36 bg-gradient-to-r from-primary to-slate-900 p-6 flex items-end justify-between relative">

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full"
          >
            <X size={18} />
          </button>

          <img
            src={imageUrl}
            onError={(e) => (e.target.src = fallbackImage)}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
            alt={service.title}
          />
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
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <DollarSign size={14} />
              <p className="text-sm font-black mt-2">
                {service.pricingMode || "WHATSAPP_ONLY"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <Tag size={14} />
              <p className="text-sm font-black mt-2">
                {service.type || "N/A"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <Users size={14} />
              <p className="text-sm font-black mt-2">
                {service.whatsappNumber || "N/A"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <Layers size={14} />
              <p className="text-sm font-black mt-2">
                {service.displayOrder ?? 0}
              </p>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {service.description}
            </p>
          </div>

          {/* DATE */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              Créé le
            </div>

            <span className="text-white">
              {service.createdAt
                ? new Date(service.createdAt).toLocaleDateString("fr-FR")
                : "N/A"}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-3 gap-2">

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="p-3 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase"
            >
              {actionLoading ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
              Supprimer
            </button>

            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase"
            >
              {toggling ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
              Statut
            </button>

            <button
              onClick={handleWhatsApp}
              disabled={whLoading}
              className="p-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase"
            >
              WhatsApp
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}