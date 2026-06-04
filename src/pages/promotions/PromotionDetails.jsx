// FILE: src/pages/promotions/PromotionDetails.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Edit3, MessageCircle, Power, Trash2, TrendingUp, Users, MousePointerClick } from "lucide-react";
import { deletePromotion, fetchPromotionById, fetchPromotionStats, generateWhatsAppLink, togglePromotionStatus } from "../../api/promotions.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import PromotionForm from "./PromotionForm";
import { useAuth } from "../../context/AuthContext";

const unwrap = (response) => response?.data?.data || response?.data?.promotion || response?.data || response;

const formatDate = (value) => {
  if (!value) return "Non définie";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Non définie";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
};

export default function PromotionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();

  const loadData = async () => {
    setLoading(true);
    try {
      const [promoRes, statsRes] = await Promise.all([
        fetchPromotionById(id),
        fetchPromotionStats(id),
      ]);
      setPromo(unwrap(promoRes));
      setStats(unwrap(statsRes) || {});
    } catch (err) {
      notifyError("Impossible de charger la promotion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const statusLabel = useMemo(() => {
    if (!promo) return "";
    if (promo.endDate && new Date(promo.endDate) < new Date()) return "Expirée";
    return promo.isActive ? "Active" : "Inactive";
  }, [promo]);

  const statusClass = promo?.isActive
    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
    : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10";

  const handleToggleStatus = async () => {
    try {
      await togglePromotionStatus(promo._id, !promo.isActive);
      setPromo((prev) => ({ ...prev, isActive: !prev.isActive }));
      notifySuccess("Statut mis à jour");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur de statut");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Supprimer la promotion "${promo.title}" ?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deletePromotion(promo._id, true);
      notifySuccess("Promotion supprimée");
      navigate("/admin/promotions");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur de suppression");
    } finally {
      setDeleting(false);
    }
  };

  const handleWhatsAppPreview = async () => {
    try {
      const response = await generateWhatsAppLink({ promoId: promo._id, customerId: user._id, phone: user.telephone});
      const link = response?.data?.link || response?.data?.data?.link;
      if (link) window.open(link, "_blank", "noopener,noreferrer");
      else notifyError("Lien WhatsApp indisponible");
    } catch (err) {
      notifyError("Impossible de générer le lien WhatsApp");
    }
  };

  if (loading) return <PageLoader />;
  if (!promo) {
    return (
      <div className="p-20 text-center font-display italic text-slate-400 dark:text-white/20 uppercase font-black">
        Promotion introuvable
      </div>
    );
  }

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 font-sans max-w-7xl mx-auto animate-in fade-in duration-500 pb-20 transition-colors">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate(-1)} className="p-3 md:p-4 bg-white dark:bg-white/5 rounded-xl md:rounded-2xl border border-slate-100 dark:border-white/10 hover:shadow-lg transition-all text-slate-900 dark:text-white active:scale-90">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div className="min-w-0 py-1">
            <h1 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white font-display italic tracking-tighter leading-[1.1] pr-2 uppercase">
              {promo.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border shrink-0 ${statusClass}`}>
                {statusLabel}
              </span>
              <span className="font-mono text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest truncate">
                {promo.code}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
          <button onClick={handleToggleStatus} className="px-4 md:px-6 py-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-sm">
            <Power size={16} /> {promo.isActive ? "Désactiver" : "Activer"}
          </button>
          <button onClick={() => setShowForm(true)} className="px-4 md:px-6 py-4 bg-primary dark:bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl dark:shadow-none hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Edit3 size={16} /> Modifier
          </button>
          <button onClick={handleWhatsAppPreview} className="px-4 md:px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl dark:shadow-none hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
            <MessageCircle size={16} /> WhatsApp
          </button>
          <button onClick={handleDelete} disabled={deleting} className="px-4 md:px-6 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl dark:shadow-none hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            <Trash2 size={16} /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Total clics", val: stats.totalClicks || 0, icon: MousePointerClick, col: "bg-slate-900 dark:bg-white/10" },
          { label: "Conversions", val: stats.usedClicks || stats.conversions || 0, icon: Users, col: "bg-secondary" },
          { label: "Taux", val: stats.conversionRate || "0%", icon: TrendingUp, col: "bg-emerald-500" },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-white/[0.03] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-soft flex flex-row sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center gap-4">
            <div className={`w-12 h-12 md:w-16 md:h-16 ${item.col} rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="font-display font-black text-2xl md:text-4xl text-slate-900 dark:text-white italic leading-none">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-soft space-y-6">
          <h2 className="font-display font-black text-xl md:text-2xl italic text-slate-900 dark:text-white uppercase leading-none">Contenu de la promotion</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase mb-2 ml-1">Description</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-white/5 p-4 rounded-2xl">{promo.description}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase mb-2 ml-1">Template WhatsApp</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-white/5 p-4 rounded-2xl whitespace-pre-wrap">{promo.waTemplate}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-soft space-y-5">
          <h3 className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">Paramètres</h3>
          {[
            ["Badge", promo.badge || "Non renseigné"],
            ["Icône", promo.icon || "Gift"],
            ["Catégorie", promo.promoCategory || "PARTNER"],
            ["Type", promo.type || "DISCOUNT"],
            ["Début", formatDate(promo.startDate)],
            ["Fin", formatDate(promo.endDate)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
              <span className="text-xs font-black text-slate-800 dark:text-white text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 dark:bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="w-full transform animate-in slide-in-from-bottom-8 duration-500 my-8">
            <PromotionForm promotion={promo} onSave={() => { setShowForm(false); loadData(); }} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
