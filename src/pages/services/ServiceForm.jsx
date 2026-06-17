import { useEffect, useState } from "react";
import { X, Check, Image as ImageIcon, Info, Plus, Trash2 } from "lucide-react";
import { create, update } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PhoneInput from "../../components/forms/PhoneInput";
import { useSettings } from "../../context/Settings/SettingsContext";

const SERVICE_TYPE_LABELS = {
  STANDARD: "Standard (Livraison classique)",
  EXPRESS: "Express (Rapide)",
  PRIVATE: "Privé (Sur mesure)",
  ADMIN: "Administratif",
  CARE: "Assistance / Care",
  BUSINESS: "Entreprise"
};

const PRICING_MODE_LABELS = {
  WHATSAPP_ONLY: "Commande via WhatsApp uniquement",
  BASE_PRICING: "Tarification automatique + WhatsApp"
};

export default function ServiceForm({ service, onClose, onSuccess }) {
  const isEdit = !!service;
  const { settings } = useSettings();

  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    whatsappNumber: "",
    whatsappTemplate: "Bonjour, je souhaite obtenir plus d'informations sur le service {{serviceName}}.",
    pricingMode: "WHATSAPP_ONLY",
    pricingIncreaseAmount: 0,
    displayOrder: 0,
    benefits: [],
    image: null
  });

  const [newBenefit, setNewBenefit] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (service) {
      setForm({
        title: service.title || "",
        type: service.type || "",
        description: service.description || "",
        whatsappNumber: service.whatsappNumber || settings?.contact?.whatsappNumber || "",
        whatsappTemplate: service.whatsappTemplate || "Bonjour, je souhaite obtenir plus d'informations sur le service {{serviceName}}.",
        pricingMode: service.pricingMode || "WHATSAPP_ONLY",
        pricingIncreaseAmount: service.pricingIncreaseAmount || 0,
        displayOrder: service.displayOrder || 0,
        benefits: service.benefits || [],
        image: null
      });
      setPreview(service.image?.url || null);
    } else if (settings?.contact?.whatsappNumber) {
      setForm(prev => ({ ...prev, whatsappNumber: settings.contact.whatsappNumber }));
    }
  }, [service, settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (file) => {
    setForm((p) => ({ ...p, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    setForm(p => ({ ...p, benefits: [...p.benefits, newBenefit] }));
    setNewBenefit("");
  };

  const removeBenefit = (index) => {
    setForm(p => ({ ...p, benefits: p.benefits.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image') {
          if (value instanceof File) fd.append('image', value);
        } else if (key === 'benefits') {
          fd.append('benefits', JSON.stringify(value));
        } else if (value !== null && value !== "") {
          fd.append(key, value);
        }
      });

      if (isEdit) {
        await update(service._id, fd);
        notifySuccess("Service mis à jour avec succès");
      } else {
        await create(fd);
        notifySuccess("Service créé avec succès");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      notifyError("Erreur lors de l’enregistrement");
    }
  };

  const inputClass = "w-full p-4 rounded-2xl border bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-white/10 text-sm font-semibold outline-none focus:border-secondary transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 mb-2 block";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-primary dark:text-white">{isEdit ? "Modifier le service" : "Créer un service"}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><X /></button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <label className={labelClass}><ImageIcon size={12} className="inline mr-1" /> Image</label>
            <div className="flex items-center gap-4">
              {preview && <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-2xl border" />}
              <label className="flex-1 cursor-pointer">
                <div className="p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-center text-sm text-slate-500">Choisir une image</div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImage(e.target.files[0])} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nom du service</label>
              <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Type de service</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass} required>
                <option value="">Sélectionner</option>
                {Object.entries(SERVICE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className={labelClass}>Numéro WhatsApp</label>
               <PhoneInput value={form.whatsappNumber} onChange={(v) => setForm(p => ({ ...p, whatsappNumber: v }))} required />
             </div>
             <div>
               <label className={labelClass}>Mode de tarification</label>
               <select name="pricingMode" value={form.pricingMode} onChange={handleChange} className={inputClass}>
                 {Object.entries(PRICING_MODE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
               </select>
             </div>
          </div>

          <div>
            <label className={labelClass}>Modèle de message WhatsApp</label>
            <textarea name="whatsappTemplate" value={form.whatsappTemplate} onChange={handleChange} className={inputClass} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className={labelClass}>Majoration Prix</label>
               <input type="number" name="pricingIncreaseAmount" value={form.pricingIncreaseAmount} onChange={handleChange} className={inputClass} />
            </div>
            <div>
               <label className={labelClass}>Ordre d'affichage</label>
               <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Avantages</label>
            <div className="flex gap-2 mb-2">
              <input value={newBenefit} onChange={e => setNewBenefit(e.target.value)} className={inputClass} placeholder="Ex: Livraison gratuite..." />
              <button type="button" onClick={addBenefit} className="p-4 bg-primary text-white rounded-2xl"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.benefits.map((b, i) => (
                <span key={i} className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs">
                  {b} <button type="button" onClick={() => removeBenefit(i)}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={inputClass} required />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-white/10">
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs hover:opacity-90">
            {isEdit ? "Mettre à jour" : "Créer le service"}
          </button>
        </div>
      </form>
    </div>
  );
}