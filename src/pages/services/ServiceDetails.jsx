import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X, Calendar, DollarSign, Tag, Users, Layers, CheckCircle,
  XCircle, Edit3, Trash2, Save, List, Smartphone, FileText, Plus,
  MessageCircle
} from "lucide-react";

import { useTheme } from "../../context/Theme/ThemeContext";
import { getById, getWhatsappLink, remove, update } from "../../api/service.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import { MODE_LABELS } from "../../constants/constants";
import PageLoader from "../../components/ui/PageLoader";

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

  const validateForm = () => {
    if (!formData.title?.trim()) {
      notifyError("Le titre est obligatoire");
      return false;
    }
    if (!formData.whatsappNumber?.trim()) {
      notifyError("Le numéro WhatsApp est obligatoire");
      return false;
    }
    if (formData.pricingIncreaseAmount === "" || isNaN(Number(formData.pricingIncreaseAmount))) {
      notifyError("La majoration doit être un nombre valide");
      return false;
    }
    return true;
  };

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
    // 1. Validation avant tout
    if (!validateForm()) return;

    try {
      setActionLoading(true);
      const payload = { 
        ...formData, 
        pricingIncreaseAmount: Number(formData.pricingIncreaseAmount), 
        displayOrder: Number(formData.displayOrder) 
      };
      
      await update(id, payload);
      await fetchService();
      setIsEditing(false);
      notifySuccess("Service mis à jour avec succès");
    } catch (err) {
      notifyError("Erreur lors de la mise à jour");
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

  if (loading) return <PageLoader />;
  
  if (!service) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
        <XCircle size={40} className="text-rose-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic mb-2">Service introuvable</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-xs">
        Le service que vous essayez de consulter n'existe pas ou a été supprimé.
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="px-8 py-4 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all"
      >
        Retourner en arrière
      </button>
    </div>
  );

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

            <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Titre du service</label>
            <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Titre" />

            <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Description du service</label>
            <textarea className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

            <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Numéro Whatsapp</label>
            <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} placeholder="Numéro WhatsApp" />

            <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Message whatsapp</label>
            <textarea className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" rows={2} value={formData.whatsappTemplate} onChange={e => setFormData({...formData, whatsappTemplate: e.target.value})} placeholder="Template WhatsApp" />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="number" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" value={formData.pricingIncreaseAmount} onChange={e => setFormData({...formData, pricingIncreaseAmount: e.target.value})} placeholder="Majoration" />
              {/* <input type="number" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: e.target.value})} placeholder="Ordre" /> */}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">Avantages du service</label>
              
              {/* Liste des avantages existants */}
              <div className="space-y-2 mb-4">
                {formData.benefits?.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{benefit}</span>
                    <button 
                      type="button" 
                      onClick={() => setFormData({
                        ...formData, 
                        benefits: formData.benefits.filter((_, i) => i !== index)
                      })}
                      className="text-rose-400 hover:text-rose-600 p-1 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Champ pour ajouter un nouvel avantage */}
              <div className="flex gap-2">
                <input 
                  className="flex-1 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm" 
                  value={newBenefit} 
                  onChange={e => setNewBenefit(e.target.value)}
                  placeholder="Ajouter un nouvel avantage..."
                />
                <button 
                  type="button" 
                  onClick={() => {
                    if (!newBenefit.trim()) return;
                    setFormData({ ...formData, benefits: [...(formData.benefits || []), newBenefit] });
                    setNewBenefit("");
                  }} 
                  className="p-4 bg-primary text-white rounded-2xl hover:opacity-90 transition-opacity"
                >
                  <Plus size={20} />
                </button>
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
                  {service.isActive ? <CheckCircle size={12}/> : <XCircle size={12}/>} {service.isActive ? "ACTIF" : "INACTIF"}
                </span>
                <h2 className="text-3xl font-black text-primary dark:text-white uppercase italic mt-3">{service.title}</h2>
              </div>
              <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-secondary"><Edit3 size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoCard icon={<DollarSign size={14} />} label="Tarification" value={MODE_LABELS[service.pricingMode]} />
              <InfoCard icon={<Tag size={14} />} label="Type" value={service.type} />
              <InfoCard icon={<Smartphone size={14} />} label="WhatsApp" value={service.whatsappNumber} />
              <InfoCard icon={<Layers size={14} />} label="Majoration" value={`${service.pricingIncreaseAmount?.toLocaleString('fr-FR')} FCFA`} />
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2"><FileText size={12}/> Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
            </div>

            {service.benefits?.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                {/* Titre avec un petit soulignement subtil */}
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-5 flex items-center gap-2 tracking-widest">
                  <List size={12} /> Avantages inclus
                </h4>

                {/* Liste verticale stylisée */}
                <div className="space-y-3">
                  {service.benefits.map((b, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:border-primary/20 transition-all duration-300"
                    >
                      {/* Icône de validation */}
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle className="text-emerald-500" size={12} strokeWidth={3} />
                      </div>
                      
                      {/* Texte */}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setShowDeleteModal(true)} className="flex flex-col items-center p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black uppercase text-[9px]"><Trash2 size={16} /> Supprimer</button>
              <button 
                onClick={() => update(id, { isActive: !service.isActive }).then(fetchService)} 
                className={`flex flex-col items-center p-4 rounded-2xl font-black uppercase text-[9px] transition-colors ${
                  service.isActive 
                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                }`}
              >
                <CheckCircle size={16} /> 
                {service.isActive ? "Actif" : "Inactif"}
              </button>
              <button onClick={() => getWhatsappLink(id).then(r => window.open(r.data.link, "_blank"))} className="flex flex-col items-center p-4 bg-green-500 text-white rounded-2xl font-black uppercase text-[9px]"><MessageCircle size={16} /> WhatsApp</button>
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

      {zoomOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setZoomOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white"
            onClick={() => setZoomOpen(false)}
          >
            <X size={32} />
          </button>
          <img 
            src={imageUrl} 
            alt="Zoomed" 
            className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl object-contain"
          />
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