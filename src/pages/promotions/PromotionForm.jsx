// FILE: src/pages/promotions/PromotionForm.jsx

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Gift,
  MessageCircle,
  Settings2,
  X,
} from "lucide-react";
import { createPromotion, updatePromotion } from "../../api/promotions.api";
import { fetchPartners } from "../../api/partners.api";
import { notifyError, notifySuccess } from "../../utils/notify";

const DEFAULT_PROMOTION = {
  title: "",
  description: "",
  code: "",
  badge: "",
  icon: "Gift",
  gradient: "from-emerald-500 to-green-600",
  partnerId: "",
  promoCategory: "PARTNER",
  type: "DISCOUNT",
  waTemplate: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

const STEPS = [
  { id: 1, label: "Contenu", icon: Gift },
  { id: 2, label: "Paramètres", icon: Settings2 },
];

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const unwrapPartners = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.partners)) return response.data.partners;
  if (Array.isArray(response?.data?.data?.partners)) return response.data.data.partners;
  return [];
};

export default function PromotionForm({ promotion, onSave, onCancel }) {
  const initialData = useMemo(
    () => ({
      ...DEFAULT_PROMOTION,
      ...promotion,
      partnerId: promotion?.partnerId?._id || promotion?.partnerId || "",
      startDate: toInputDate(promotion?.startDate),
      endDate: toInputDate(promotion?.endDate),
    }),
    [promotion]
  );

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const inputClass =
    "w-full h-12 md:h-14 border-2 border-slate-50 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl px-4 text-sm font-bold outline-none focus:border-secondary/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-secondary/5 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-primary dark:text-white";
  const textareaClass =
    "w-full border-2 border-slate-50 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl p-4 text-sm font-bold outline-none focus:border-secondary/30 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-secondary/5 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-primary dark:text-white resize-none";
  const labelClass =
    "text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 ml-2 mb-2 block";

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  useEffect(() => {
    if (formData.promoCategory !== "PARTNER") return undefined;

    let mounted = true;

    const loadPartners = async () => {
      setPartnersLoading(true);
      try {
        const response = await fetchPartners({ limit: 100, status: "ACTIVE" });
        if (mounted) setPartners(unwrapPartners(response));
      } catch (err) {
        notifyError("Impossible de charger les partenaires");
      } finally {
        if (mounted) setPartnersLoading(false);
      }
    };

    loadPartners();
    return () => {
      mounted = false;
    };
  }, [formData.promoCategory]);

  const validateStep = (targetStep = step) => {
    const nextErrors = {};

    if (targetStep === 1) {
      if (!formData.title.trim()) nextErrors.title = "Titre requis";
      if (!formData.code.trim()) nextErrors.code = "Code requis";
      if (!formData.badge.trim()) nextErrors.badge = "Badge requis";
      if (!formData.description.trim()) nextErrors.description = "Description requise";
    }

    if (targetStep === 2) {
      if (formData.promoCategory === "PARTNER" && !formData.partnerId) {
        nextErrors.partnerId = "Partenaire requis";
      }
      if (!formData.endDate) nextErrors.endDate = "Date de fin requise";
      if (!formData.waTemplate.trim()) nextErrors.waTemplate = "Template WhatsApp requis";
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(1)) return;
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstStepValid = validateStep(1);
    const secondStepValid = validateStep(2);

    if (!firstStepValid) {
      setStep(1);
      return;
    }

    if (!secondStepValid) {
      setStep(2);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        code: formData.code.trim().toUpperCase(),
        partnerId: formData.promoCategory === "PARTNER" ? formData.partnerId : null,
        startDate: formData.startDate || undefined,
      };

      if (formData._id) await updatePromotion(formData._id, payload);
      else await createPromotion(payload);

      notifySuccess("Promotion enregistrée");
      onSave?.();
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const errorText = (field) =>
    errors[field] ? (
      <p className="text-rose-500 text-[8px] font-black uppercase mt-1 ml-2 italic tracking-widest">
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[1.75rem] md:rounded-[2.5rem] shadow-2xl border border-slate-50 dark:border-slate-800 overflow-hidden w-full max-w-2xl mx-auto max-h-[92vh] flex flex-col">
      <div className="shrink-0 p-5 md:p-7 bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="w-11 h-11 md:w-12 md:h-12 bg-primary dark:bg-white/[0.05] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 dark:shadow-none rotate-3 border border-transparent dark:border-white/10 shrink-0">
              <Gift size={21} className="text-white dark:text-secondary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-2xl font-black text-primary dark:text-white italic font-display leading-none uppercase truncate">
                {promotion?._id ? "Modifier Promotion" : "Nouvelle Promotion"}
              </h2>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                Campagne marketing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:border-rose-100 dark:hover:border-rose-900/30 transition-all active:scale-90 shrink-0"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-5">
          {STEPS.map((item) => {
            const Icon = item.icon;
            const active = step === item.id;
            const completed = step > item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 1 || validateStep(1)) setStep(item.id);
                }}
                className={`h-11 rounded-2xl border text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  active || completed
                    ? "bg-primary dark:bg-secondary text-white border-primary dark:border-secondary shadow-sm"
                    : "bg-white dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/10"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="min-h-0 flex-1 flex flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-7">
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Titre *</label>
                  <input
                    className={`${inputClass} ${errors.title ? "border-rose-100 dark:border-rose-900/50" : ""}`}
                    placeholder="Livraison offerte"
                    value={formData.title}
                    onChange={(e) => setField("title", e.target.value)}
                  />
                  {errorText("title")}
                </div>
                <div>
                  <label className={labelClass}>Code promo *</label>
                  <input
                    className={`${inputClass} font-mono uppercase ${errors.code ? "border-rose-100 dark:border-rose-900/50" : ""}`}
                    placeholder="WELCOME10"
                    value={formData.code}
                    onChange={(e) => setField("code", e.target.value.toUpperCase())}
                  />
                  {errorText("code")}
                </div>
              </div>

              <div>
                <label className={labelClass}>Badge *</label>
                <input
                  className={`${inputClass} ${errors.badge ? "border-rose-100 dark:border-rose-900/50" : ""}`}
                  placeholder="Offre limitée"
                  value={formData.badge}
                  onChange={(e) => setField("badge", e.target.value)}
                />
                {errorText("badge")}
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  className={`${textareaClass} min-h-28 md:min-h-32 ${errors.description ? "border-rose-100 dark:border-rose-900/50" : ""}`}
                  placeholder="Description visible dans le carousel"
                  value={formData.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
                {errorText("description")}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Catégorie</label>
                  <select
                    className={inputClass}
                    value={formData.promoCategory}
                    onChange={(e) => {
                      const promoCategory = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        promoCategory,
                        partnerId: promoCategory === "PARTNER" ? prev.partnerId : "",
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        promoCategory: undefined,
                        partnerId: undefined,
                      }));
                    }}
                  >
                    <option value="PARTNER">Partenaire</option>
                    <option value="EMENO">EMENO</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select
                    className={inputClass}
                    value={formData.type}
                    onChange={(e) => setField("type", e.target.value)}
                  >
                    <option value="DISCOUNT">Réduction</option>
                    <option value="FIDELITY">Fidélité</option>
                  </select>
                </div>
              </div>

              {formData.promoCategory === "PARTNER" && (
                <div>
                  <label className={labelClass}>Partenaire *</label>
                  <select
                    className={`${inputClass} ${errors.partnerId ? "border-rose-100 dark:border-rose-900/50" : ""}`}
                    value={formData.partnerId || ""}
                    onChange={(e) => setField("partnerId", e.target.value)}
                    disabled={partnersLoading}
                  >
                    <option value="">
                      {partnersLoading ? "Chargement des partenaires..." : "Selectionner un partenaire"}
                    </option>
                    {partners.map((partner) => (
                      <option key={partner._id} value={partner._id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                  {errorText("partnerId")}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Icône</label>
                  <input
                    className={inputClass}
                    placeholder="Gift"
                    value={formData.icon}
                    onChange={(e) => setField("icon", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Gradient</label>
                  <input
                    className={inputClass}
                    placeholder="from-emerald-500 to-green-600"
                    value={formData.gradient}
                    onChange={(e) => setField("gradient", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Début</label>
                  <div className="relative">
                    <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 pointer-events-none" />
                    <input
                      type="date"
                      className={`${inputClass} pl-11`}
                      value={formData.startDate}
                      onChange={(e) => setField("startDate", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Fin *</label>
                  <div className="relative">
                    <CalendarDays size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 pointer-events-none" />
                    <input
                      type="date"
                      className={`${inputClass} pl-11 ${errors.endDate ? "border-rose-100 dark:border-rose-900/50" : ""}`}
                      value={formData.endDate}
                      onChange={(e) => setField("endDate", e.target.value)}
                    />
                  </div>
                  {errorText("endDate")}
                </div>
              </div>

              <div>
                <label className={labelClass}>Template WhatsApp *</label>
                <div className="relative">
                  <MessageCircle size={16} className="absolute left-4 top-4 text-slate-300 dark:text-slate-600 pointer-events-none" />
                  <textarea
                    className={`${textareaClass} min-h-28 md:min-h-36 pl-11 ${errors.waTemplate ? "border-rose-100 dark:border-rose-900/50" : ""}`}
                    placeholder="Bonjour, je souhaite profiter de l'offre {{code}}..."
                    value={formData.waTemplate}
                    onChange={(e) => setField("waTemplate", e.target.value)}
                  />
                </div>
                {errorText("waTemplate")}
              </div>

              <label className="flex items-center justify-between gap-4 p-4 bg-slate-50/70 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 cursor-pointer">
                <span className="min-w-0">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Promotion active
                  </span>
                  <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                    Visible si les dates sont valides.
                  </span>
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-secondary shrink-0"
                  checked={formData.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)}
                />
              </label>
            </div>
          )}
        </div>

        <div className="shrink-0 p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          {step === 1 ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="w-28 md:w-40 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex-1 py-4 bg-primary dark:bg-secondary text-white rounded-[1.25rem] font-black uppercase tracking-widest text-[10px] md:text-[11px] flex items-center justify-center gap-2 shadow-xl shadow-primary/10 dark:shadow-none hover:bg-secondary dark:hover:bg-secondary/80 active:scale-[0.98] transition-all"
              >
                Suivant <ArrowRight size={17} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-12 md:w-40 py-4 rounded-[1.25rem] bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-300 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
              >
                <ArrowLeft size={17} strokeWidth={3} />
                <span className="hidden md:inline">Retour</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 bg-primary dark:bg-secondary text-white rounded-[1.25rem] font-black uppercase tracking-widest text-[10px] md:text-[11px] flex items-center justify-center gap-2 shadow-xl shadow-primary/10 dark:shadow-none hover:bg-secondary dark:hover:bg-secondary/80 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                <Check size={17} strokeWidth={3} />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
