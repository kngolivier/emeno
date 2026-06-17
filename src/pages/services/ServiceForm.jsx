import { useEffect, useState } from "react";
import { X, Check, Image as ImageIcon, Info, Plus, Trash2, Tag, Layers, FileText, Smartphone } from "lucide-react";
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
  WHATSAPP_ONLY: "WhatsApp uniquement",
  BASE_PRICING: "Auto + WhatsApp"
};

export default function ServiceForm({ service, onClose, onSuccess }) {
  const isEdit = !!service;
  const { settings } = useSettings();

  const [form, setForm] = useState({
    title: "", type: "", description: "", whatsappNumber: "",
    whatsappTemplate: "Bonjour, je souhaite obtenir plus d'informations sur le service {{serviceName}}.",
    pricingMode: "WHATSAPP_ONLY", pricingIncreaseAmount: 0, displayOrder: 0,
    benefits: [], image: null
  });

  const [newBenefit, setNewBenefit] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (service) {
      setForm({
        ...service,
        whatsappNumber: service.whatsappNumber || settings?.contact?.whatsappNumber || "",
        image: null
      });
      setPreview(service.image?.url || null);
    } else if (settings?.contact?.whatsappNumber) {
      setForm(prev => ({ ...prev, whatsappNumber: settings.contact.whatsappNumber }));
    }
  }, [service, settings]);

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) fd.append('image', value);
        else if (key === 'benefits') fd.append('benefits', JSON.stringify(value));
        else if (key === 'pricingIncreaseAmount' || key === 'displayOrder') fd.append(key, Number(value) || 0);
        else if (value !== null && value !== "") fd.append(key, value);
      });
      isEdit ? await update(service._id, fd) : await create(fd);
      notifySuccess("Opération réussie");
      onSuccess();
    } catch (err) { notifyError("Erreur lors de l’enregistrement"); }
  };

  const inputClass = "w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Moderne */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-black uppercase tracking-tighter text-primary dark:text-white">
            {isEdit ? "Modification" : "Nouveau Service"}
          </h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          {/* Image Upload */}
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-white/10 flex items-center justify-center">
              {preview ? <img src={preview} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-400" size={24} />}
            </div>
            <label className="flex-1">
              <span className={labelClass}>Image du service</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                setForm(p => ({ ...p, image: file }));
                setPreview(URL.createObjectURL(file));
              }} />
              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-center text-xs font-bold text-slate-500 cursor-pointer hover:border-primary transition-colors">
                Importer un visuel
              </div>
            </label>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Titre</label>
              <input name="title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select name="type" value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={inputClass} required>
                <option value="">Choisir...</option>
                {Object.entries(SERVICE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Ordre</label>
              <input type="number" name="displayOrder" value={form.displayOrder} onChange={e => setForm({...form, displayOrder: e.target.value})} className={inputClass} />
            </div>
          </div>

          {/* WhatsApp Section */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><Smartphone size={12}/> Paramètres WhatsApp</label>
            <PhoneInput value={form.whatsappNumber} onChange={(v) => setForm(p => ({ ...p, whatsappNumber: v }))} />
            <textarea name="whatsappTemplate" value={form.whatsappTemplate} onChange={e => setForm({...form, whatsappTemplate: e.target.value})} className={inputClass} rows={2} placeholder="Message template..." />
          </div>

          {/* Avantages */}
          <div>
            <label className={labelClass}>Avantages (Tag)</label>
            <div className="flex gap-2">
              <input value={newBenefit} onChange={e => setNewBenefit(e.target.value)} className={inputClass} placeholder="Ex: Livraison gratuite" />
              <button type="button" onClick={() => {if(newBenefit) {setForm(p => ({...p, benefits: [...p.benefits, newBenefit]})); setNewBenefit("")}}} className="px-6 bg-primary text-white rounded-2xl font-black"><Plus size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {form.benefits.map((b, i) => (
                <span key={i} className="px-3 py-1 bg-primary/10 text-primary dark:bg-white/10 dark:text-white rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                  {b} <button type="button" onClick={() => setForm(p => ({...p, benefits: p.benefits.filter((_,idx) => idx !== i)}))}><X size={10}/></button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-4 border-t border-slate-100 dark:border-white/10">
          <button type="submit" className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all active:scale-[0.98]">
            {isEdit ? "Enregistrer les modifications" : "Créer le service"}
          </button>
        </div>
      </form>
    </div>
  );
}