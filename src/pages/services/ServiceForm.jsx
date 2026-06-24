import { useEffect, useState } from "react";
import { X, Image as ImageIcon, Plus, Smartphone, Tag, Layers, FileText } from "lucide-react";
import { create, update } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PhoneInput from "../../components/forms/PhoneInput";
import { useSettings } from "../../context/Settings/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";

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

const SectionHeader = ({ icon: Icon, title }) => (
  <h3 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 mt-6">
    <Icon size={12} /> {title}
  </h3>
);

export default function ServiceForm({ service, onClose, onSuccess }) {
  const isEdit = !!service;
  const { settings } = useSettings();
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "", type: "", description: "", whatsappNumber: "",
    whatsappTemplate: "Bonjour, je souhaite obtenir plus d'informations sur le service {{serviceName}}.",
    pricingMode: "WHATSAPP_ONLY", pricingIncreaseAmount: 0, displayOrder: 0,
    isActive: true, benefits: [], image: null
  });

  const [newBenefit, setNewBenefit] = useState("");
  const [preview, setPreview] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Requis";
    if (!form.type) newErrors.type = "Requis";
    if (!form.whatsappNumber) newErrors.whatsappNumber = "Requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { // Validation avant envoi
      notifyError("Veuillez remplir les champs requis");
      return;
    }
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image') {
          if (value instanceof File) fd.append('image', value);
        } else if (key === 'benefits') {
          fd.append('benefits', JSON.stringify(value));
        } else if (key === 'pricingIncreaseAmount' || key === 'displayOrder') {
          fd.append(key, Number(value) || 0);
        } else if (value !== null) {
          fd.append(key, value);
        }
      });

      isEdit ? await update(service._id, fd) : await create(fd);
      notifySuccess("Service enregistré avec succès");
      onSuccess();
    } catch (err) {
      console.error(err);
      notifyError("Erreur lors de l’enregistrement");
    }
  };

  const inputClass = "w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
      >
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
          <h2 className="text-lg font-black uppercase tracking-tighter text-primary dark:text-white">
            {isEdit ? "Modification" : "Nouveau Service"}
          </h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-1">

        {/* SECTION 1: GÉNÉRAL */}
          <SectionHeader icon={FileText} title="Informations générales" />
          {/* Image & Base */}
          <div className="flex gap-6 items-center">
            <div className="relative group w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center transition-all hover:border-primary">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-slate-400" size={32} />
              )}
              <label className="absolute inset-0 cursor-pointer bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black uppercase transition-opacity">
                Modifier
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  setForm(p => ({ ...p, image: file }));
                  setPreview(URL.createObjectURL(file));
                }} />
              </label>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black mb-1">Illustration du service</h4>
              <p className="text-[11px] text-slate-400">Format recommandé : JPG, PNG (Max 2MB). Cette image sera affichée dans le catalogue.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Titre</label>
              <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass} required>
                <option value="">Sélectionner...</option>
                {Object.entries(SERVICE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {/* <div>
              <label className={labelClass}>Ordre</label>
              <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} className={inputClass} />
            </div> */}
          </div>

          {/* SECTION 2: TARIFICATION & STATUT */}
          <SectionHeader icon={Tag} title="Configuration commerciale" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Mode de tarification</label>
              <select name="pricingMode" value={form.pricingMode} onChange={handleChange} className={inputClass}>
                {Object.entries(PRICING_MODE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Majoration (FCFA)</label>
              <input type="number" name="pricingIncreaseAmount" value={form.pricingIncreaseAmount} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* SECTION 3: COMMUNICATION */}
          <SectionHeader icon={Smartphone} title="Canal WhatsApp" />
          <div className="p-5 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><Smartphone size={12}/> WhatsApp</label>
            <PhoneInput value={form.whatsappNumber} onChange={(v) => setForm(p => ({ ...p, whatsappNumber: v }))} />
            <textarea name="whatsappTemplate" value={form.whatsappTemplate} onChange={handleChange} className={inputClass} rows={2} placeholder="Template message..." />
            <p className="text-[10px] text-slate-400 italic">
              Aperçu du message : "{form.whatsappTemplate.replace("{{serviceName}}", form.title || "Nom du service")}"
            </p>
          </div>

          {/* SECTION 4: AVANTAGES */}
          <SectionHeader icon={Layers} title="Avantages" />
          <div>
            <label className={labelClass}>Avantages</label>
            <div className="flex gap-2">
              <input value={newBenefit} onChange={e => setNewBenefit(e.target.value)} className={inputClass} placeholder="Ajouter un avantage" />
              <button type="button" onClick={() => {if(newBenefit) {setForm(p => ({...p, benefits: [...p.benefits, newBenefit]})); setNewBenefit("")}}} className="px-6 bg-primary text-white rounded-2xl font-black"><Plus size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {form.benefits.map((b, i) => (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={i} 
                  className="pl-3 pr-2 py-1.5 bg-primary/10 text-secondary rounded-xl text-[11px] font-bold uppercase flex items-center gap-2 border border-primary/20"
                >
                  {b} 
                  <button type="button" onClick={() => setForm(p => ({...p, benefits: p.benefits.filter((_,idx) => idx !== i)}))} className="hover:bg-primary/20 rounded-full p-0.5">
                    <X size={12}/>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer">
             <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-5 h-5" />
             <span className="text-sm font-bold">Service actif</span>
          </label>

          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={inputClass} placeholder="Description du service..." required />
        </div>

        <div className="p-8 pt-4 border-t border-slate-100 dark:border-white/10">
          <button type="submit" className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all">
            {isEdit ? "Enregistrer les modifications" : "Créer le service"}
          </button>
        </div>
      </form>

    </motion.div>
    </div>
  );
}