import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X, Calendar, DollarSign, Tag, Users, Layers, CheckCircle,
  XCircle, Edit3, Trash2, Save, RefreshCw
} from "lucide-react";

import { useTheme } from "../../context/Theme/ThemeContext";
import { getById, getWhatsappLink, remove, update } from "../../api/service.api";
import { MODE_LABELS } from "../../constants/constants";
import { notifySuccess, notifyError } from "../../utils/notify";

const DEFAULT_SERVICE_IMAGE_LIGHT = "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-light.png";
const DEFAULT_SERVICE_IMAGE_DARK = "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-dark.png";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const [actionLoading, setActionLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [whLoading, setWhLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const fallbackImage = isDarkMode ? DEFAULT_SERVICE_IMAGE_DARK : DEFAULT_SERVICE_IMAGE_LIGHT;

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await getById(id);
      const data = res?.data?.data || res?.data;
      setService(data);
      setFormData(data);
    } catch (err) {
      console.error("Erreur fetch service:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchService(); }, [id]);

  const imageUrl = typeof service?.image === "string" ? service.image : service?.image?.url || fallbackImage;
  const isActive = service?.isActive ?? true;

  const statusUI = useMemo(() => ({
    label: isActive ? "ACTIVE" : "INACTIVE",
    icon: isActive ? <CheckCircle size={12} /> : <XCircle size={12} />,
    className: isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
  }), [isActive]);

  const handleUpdate = async () => {
    try {
      setActionLoading(true);
      await update(id, formData);
      setService(formData);
      setIsEditing(false);
      notifySuccess("Service mis à jour");
    } catch (err) {
      notifyError("Erreur de mise à jour");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await remove(id);
      notifySuccess("Service supprimé");
      navigate("/admin/services");
    } catch (err) {
      notifyError("Erreur de suppression");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Chargement du service...</div>;
  if (!service) return <div className="p-10 text-center text-red-500">Service introuvable</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden w-full max-w-2xl mx-auto relative">
      <div className="relative inset-0 opacity-[0.04] dark:opacity-[0.03] flex items-center justify-center pointer-events-none absolute">
        <img src={imageUrl} className="w-[600px] h-[600px] object-cover blur-[2px] rounded-full" alt="" />
      </div>

      <div className="relative z-10 max-h-[85vh] overflow-y-auto">
        <div className="relative h-44 bg-gradient-to-r from-primary via-slate-900 to-black p-6 flex items-end justify-between overflow-hidden">
          <button onClick={() => navigate(-1)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md">
            <X size={18} />
          </button>
          <img src={imageUrl} onClick={() => setZoomOpen(true)} className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-2xl cursor-zoom-in" alt={service.title} />
        </div>

        <div className="p-6 md:p-8 pt-14 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <input className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Titre" />
              <textarea className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description" />
              <button onClick={handleUpdate} disabled={actionLoading} className="w-full p-4 bg-primary text-white rounded-2xl font-black uppercase flex justify-center gap-2">
                <Save size={16} /> Enregistrer
              </button>
              <button onClick={() => setIsEditing(false)} className="w-full text-slate-400 font-bold uppercase text-xs">Annuler</button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1 rounded-full ${statusUI.className}`}>
                    {statusUI.icon} {statusUI.label}
                  </span>
                  <h2 className="text-3xl font-black text-primary dark:text-white uppercase italic mt-3">{service.title}</h2>
                </div>
                <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-primary"><Edit3 size={20} /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard icon={<DollarSign size={14} />} label="Prix" value={service.pricingMode} />
                <InfoCard icon={<Users size={14} />} label="WhatsApp" value={service.whatsappNumber} />
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setShowDeleteModal(true)} className="flex flex-col items-center p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black uppercase text-[9px]"><Trash2 size={16} /> Supprimer</button>
                <button onClick={() => update(id, { isActive: !isActive }).then(fetchService)} className="flex flex-col items-center p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl font-black uppercase text-[9px]"><CheckCircle size={16} /> Statut</button>
                <button onClick={() => getWhatsappLink(id).then(r => window.open(r.data.link, "_blank"))} className="flex flex-col items-center p-4 bg-green-500 text-white rounded-2xl font-black uppercase text-[9px]">WhatsApp</button>
              </div>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] w-full max-w-sm text-center">
            <h2 className="text-2xl font-black mb-6">Confirmer la suppression ?</h2>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 p-4 bg-red-500 text-white rounded-2xl font-black">Oui</button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black">Non</button>
            </div>
          </div>
        </div>
      )}
      <ImageModal open={zoomOpen} src={imageUrl} onClose={() => setZoomOpen(false)} />
    </div>
  );
}

function ImageModal({ open, src, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <img src={src} className="max-w-full max-h-full rounded-2xl shadow-2xl" alt="preview" />
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="p-5 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">{icon} {label}</div>
      <p className="text-sm font-black text-primary dark:text-white mt-3">{value}</p>
    </div>
  );
}