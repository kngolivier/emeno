import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X, Calendar, DollarSign, Tag, Users, Layers, CheckCircle,
  XCircle, Edit3, Trash2, Save, List, Smartphone, FileText, Plus
} from "lucide-react";

import { useTheme } from "../../context/Theme/ThemeContext";
import { getById, getWhatsappLink, remove, update } from "../../api/service.api";
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
  const [newBenefit, setNewBenefit] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchService(); }, [id]);

  const imageUrl = typeof service?.image === "string" ? service.image : service?.image?.url || fallbackImage;

  const handleUpdate = async () => {
    try {
      setActionLoading(true);
      const payload = { ...formData, pricingIncreaseAmount: Number(formData.pricingIncreaseAmount), displayOrder: Number(formData.displayOrder) };
      await update(id, payload);
      await fetchService();
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

  if (loading) return <div className="p-10 text-center text-gray-500">Chargement...</div>;
  if (!service) return <div className="p-10 text-center text-red-500">Service introuvable</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden w-full max-w-2xl mx-auto relative">
      <div className="relative h-44 bg-gradient-to-r from-primary via-slate-900 to-black p-6 flex items-end justify-between overflow-hidden">
        <button onClick={() => navigate(-1)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md">
          <X size={18} />
        </button>
        <img src={imageUrl} onClick={() => setZoomOpen(true)} className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-2xl cursor-zoom-in" alt={service.title} />
      </div>

      <div className="p-8 space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Titre" />
            <textarea className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} placeholder="Numéro WhatsApp" />
            <textarea className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" rows={2} value={formData.whatsappTemplate} onChange={e => setFormData({...formData, whatsappTemplate: e.target.value})} placeholder="Template WhatsApp" />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="number" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" value={formData.pricingIncreaseAmount} onChange={e => setFormData({...formData, pricingIncreaseAmount: e.target.value})} placeholder="Majoration" />
              <input type="number" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: e.target.value})} placeholder="Ordre" />
            </div>

            <div>
                <label className="text-[10px] font-black uppercase text-slate-400">Avantages</label>
                <div className="flex gap-2 mt-2">
                    <input className="flex-1 p-4 bg-slate-50 rounded-2xl" value={newBenefit} onChange={e => setNewBenefit(e.target.value)} />
                    <button type="button" onClick={() => { setFormData({...formData, benefits: [...formData.benefits, newBenefit]}); setNewBenefit("") }} className="p-4 bg-primary text-white rounded-2xl"><Plus/></button>
                </div>
            </div>

            <button onClick={handleUpdate} disabled={actionLoading} className="w-full p-4 bg-primary text-white rounded-2xl font-black uppercase">Enregistrer</button>
            <button onClick={() => setIsEditing(false)} className="w-full text-slate-400 font-bold uppercase text-xs">Annuler</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase px-3 py-1 rounded-full ${service.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                  {service.isActive ? <CheckCircle size={12}/> : <XCircle size={12}/>} {service.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
                <h2 className="text-3xl font-black text-primary dark:text-white uppercase italic mt-3">{service.title}</h2>
              </div>
              <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-primary"><Edit3 size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoCard icon={<DollarSign size={14} />} label="Tarification" value={service.pricingMode} />
              <InfoCard icon={<Tag size={14} />} label="Type" value={service.type} />
              <InfoCard icon={<Smartphone size={14} />} label="WhatsApp" value={service.whatsappNumber} />
              <InfoCard icon={<Layers size={14} />} label="Ordre" value={service.displayOrder} />
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2"><FileText size={12}/> Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
            </div>

            {service.benefits?.length > 0 && (
              <div className="p-5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 flex items-center gap-2"><List size={12} /> Avantages</h4>
                <div className="flex flex-wrap gap-2">
                  {service.benefits.map((b, i) => <span key={i} className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-[11px] font-bold shadow-sm">{b}</span>)}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setShowDeleteModal(true)} className="flex flex-col items-center p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black uppercase text-[9px]"><Trash2 size={16} /> Supprimer</button>
              <button onClick={() => update(id, { isActive: !service.isActive }).then(fetchService)} className="flex flex-col items-center p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl font-black uppercase text-[9px]"><CheckCircle size={16} /> Statut</button>
              <button onClick={() => getWhatsappLink(id).then(r => window.open(r.data.link, "_blank"))} className="flex flex-col items-center p-4 bg-green-500 text-white rounded-2xl font-black uppercase text-[9px]">WhatsApp</button>
            </div>
          </>
        )}
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
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
      <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase">{icon} {label}</div>
      <p className="text-xs font-black text-primary dark:text-white mt-2 truncate">{value}</p>
    </div>
  );
}