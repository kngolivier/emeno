// src/pages/client-portal/ClientCreateOrder.jsx

import { useState, useEffect } from "react";
import { createDelivery } from "../../api/deliveries.api";
import { calculatePrice } from "../../api/pricing.api"; 
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, ArrowLeft, Loader2, User, MapPin, 
  Package, UserCircle, Truck, CheckCircle2, Eye, Banknote, AlertTriangle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PhoneInput from "../../components/forms/PhoneInput";
import CommuneSelect from "../../components/forms/CommuneSelect";
import { notifySuccess, notifyError } from "../../utils/notify";
import { CATEGORY_LABELS } from "../../constants/constants";

export default function ClientCreateOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [step, setStep] = useState(1);
  const [clientPosition, setClientPosition] = useState('SENDER');
  const [priceData, setPriceData] = useState(null);
  const [communeNames, setCommuneNames] = useState({ pickup: "", dropoff: "" });

  const [form, setForm] = useState({
    isForSomeoneElse: false,
    pickupContact: { name: "", phone: "" },
    dropoffContact: { name: "", phone: "" },
    pickupLocation: "",
    dropoffLocation: "",
    pickupCommune: "",
    dropoffCommune: "",
    payerType: "SENDER",
    packageDetails: { 
      category: "FOOD", 
      description: "", 
      isFragile: false, 
      weight: "" 
    },
    notes: ""
  });

  useEffect(() => {
    const userInfo = { name: `${user?.nom} ${user?.prenom}`, phone: user?.telephone || "" };
    const emptyInfo = { name: "", phone: "" };

    setForm(prev => {
      let newForm = { ...prev };
      if (clientPosition === 'SENDER') {
        newForm.pickupContact = userInfo;
        newForm.pickupLocation = user?.adresse || "";
        newForm.dropoffContact = emptyInfo;
        newForm.dropoffLocation = "";
        newForm.isForSomeoneElse = false;
      } 
      else if (clientPosition === 'RECEIVER') {
        newForm.dropoffContact = userInfo;
        newForm.dropoffLocation = user?.adresse || "";
        newForm.pickupContact = emptyInfo;
        newForm.pickupLocation = "";
        newForm.isForSomeoneElse = false;
      } 
      else {
        newForm.pickupContact = emptyInfo;
        newForm.dropoffContact = emptyInfo;
        newForm.pickupLocation = "";
        newForm.dropoffLocation = "";
        newForm.isForSomeoneElse = true;
      }
      return newForm;
    });
  }, [clientPosition, user]);

  const handleNested = (section, field, value) => {
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleFetchPrice = async () => {
    if (!form.pickupCommune || !form.dropoffCommune) {
      return notifyError("Veuillez sélectionner les deux communes.");
    }
    try {
      setLoadingPrice(true);
      const res = await calculatePrice(form.pickupCommune, form.dropoffCommune, null);
      const data = res.data?.data || res.data;
      if (!data || data.price === undefined) {
        return notifyError("Désolé, ce trajet n'est pas encore desservi.");
      }
      setPriceData(data); 
      setStep(3);
    } catch (err) {
      notifyError("Erreur lors du calcul du prix.");
    } finally {
      setLoadingPrice(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { 
        ...form, 
        packageDetails: { 
          ...form.packageDetails, 
          weight: form.packageDetails.weight ? Number(form.packageDetails.weight) : 0 
        } 
      };
      const res = await createDelivery(payload);
      notifySuccess("Commande confirmée !");
      navigate(`/client/orders/${res?.data?._id}`);
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  };

  // Styles Tailwind dynamiques pour le mode sombre
  const inputClass = "w-full bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-primary dark:text-white outline-none focus:border-secondary/20 dark:focus:border-secondary/40 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block ml-2";

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      {/* HEADER PROGRESS */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl md:text-3xl font-black text-primary dark:text-white tracking-tight italic uppercase">Nouvelle commande</h1>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">Étape {step} sur 3</p>
        </div>
        <div className="flex gap-2">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 w-6 md:w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-secondary shadow-lg shadow-secondary/20' : 'bg-slate-200 dark:bg-slate-800'}`} />
            ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ÉTAPE 1 : IDENTIFICATION */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-soft space-y-8 animate-in fade-in zoom-in-95">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RoleOption active={clientPosition === 'SENDER'} onClick={() => setClientPosition('SENDER')} icon={<UserCircle />} title="Expéditeur" desc="Je donne le colis" />
                <RoleOption active={clientPosition === 'RECEIVER'} onClick={() => setClientPosition('RECEIVER')} icon={<Truck />} title="Destinataire" desc="Je reçois le colis" />
                <RoleOption active={clientPosition === 'NONE'} onClick={() => setClientPosition('NONE')} icon={<CheckCircle2 />} title="Envoi tiers" desc="Commande pour autrui" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="space-y-4">
                    <SectionTitle icon={<User size={16} />} title="Infos Expéditeur" />
                    <div>
                        <label className={labelClass}>Nom complet</label>
                        <input placeholder="Ex: Jean Paul" className={inputClass} value={form.pickupContact.name} onChange={(e) => handleNested("pickupContact", "name", e.target.value)} disabled={clientPosition === 'SENDER'} />
                    </div>
                    <PhoneInput label="TÉLÉPHONE" value={form.pickupContact.phone} onChange={(v) => handleNested("pickupContact", "phone", v)} disabled={clientPosition === 'SENDER'} />
                </div>
                <div className="space-y-4">
                    <SectionTitle icon={<User className="text-secondary" size={16} />} title="Infos Destinataire" />
                    <div>
                        <label className={labelClass}>Nom complet</label>
                        <input placeholder="Ex: Marie Claire" className={inputClass} value={form.dropoffContact.name} onChange={(e) => handleNested("dropoffContact", "name", e.target.value)} disabled={clientPosition === 'RECEIVER'} />
                    </div>
                    <PhoneInput label="TÉLÉPHONE" value={form.dropoffContact.phone} onChange={(v) => handleNested("dropoffContact", "phone", v)} disabled={clientPosition === 'RECEIVER'} />
                </div>
            </div>
            
            <div className="flex justify-end pt-4">
                <button type="button" disabled={!form.pickupContact.name || !form.dropoffContact.name} onClick={() => setStep(2)} className="w-full md:w-auto bg-primary dark:bg-secondary text-white dark:text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-20 hover:opacity-90 transition-all shadow-xl shadow-primary/10 dark:shadow-none">Suivant <ArrowRight size={18} /></button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : ITINÉRAIRE & DÉTAILS COLIS */}
        {step === 2 && (
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-soft space-y-8 animate-in slide-in-from-right-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <SectionTitle icon={<MapPin size={16} />} title="Itinéraire" />
                    <div>
                        <label className={labelClass}>Lieu de ramassage (Quartier)</label>
                        <input placeholder="Ex: Ancienne Sobraga" className={inputClass} value={form.pickupLocation} onChange={(e) => setForm({...form, pickupLocation: e.target.value})} />
                    </div>
                    <CommuneSelect 
                      label="ZONE DE DÉPART" 
                      value={form.pickupCommune} 
                      onChange={(id, name) => {
                        setForm({...form, pickupCommune: id});
                        setCommuneNames(prev => ({...prev, pickup: name}));
                      }} 
                    />
                    
                    <div className="pt-4">
                        <label className={labelClass}>Lieu de livraison (Quartier)</label>
                        <input placeholder="Ex: Nzeng-Ayong" className={inputClass} value={form.dropoffLocation} onChange={(e) => setForm({...form, dropoffLocation: e.target.value})} />
                    </div>
                    <CommuneSelect 
                      label="ZONE D'ARRIVÉE" 
                      value={form.dropoffCommune} 
                      onChange={(id, name) => {
                        setForm({...form, dropoffCommune: id});
                        setCommuneNames(prev => ({...prev, dropoff: name}));
                      }} 
                    />
                </div>
                
                <div className="space-y-5">
                    <SectionTitle icon={<Package className="text-secondary" size={16} />} title="Le Colis" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                          <label className={labelClass}>Catégorie</label>
                          <select className={inputClass + " uppercase text-[11px] appearance-none"} value={form.packageDetails.category} onChange={(e) => handleNested("packageDetails", "category", e.target.value)}>
                              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <option key={key} value={key} className="bg-white dark:bg-slate-900">{label.toUpperCase()}</option>
                              ))}
                          </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                          <label className={labelClass}>Poids (Approx. KG)</label>
                          <input type="number" placeholder="0.5" className={inputClass} value={form.packageDetails.weight} onChange={(e) => handleNested("packageDetails", "weight", e.target.value)} />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            type="button"
                            onClick={() => handleNested("packageDetails", "isFragile", !form.packageDetails.isFragile)}
                            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${form.packageDetails.isFragile ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900/40 text-orange-600 dark:text-orange-400' : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-50 dark:border-slate-800 text-slate-400'}`}
                        >
                            <AlertTriangle size={16}/> Fragile
                        </button>
                    </div>

                    <div>
                        <label className={labelClass}>Description / Notes</label>
                        <textarea placeholder="Contenu du colis..." className={inputClass + " h-24 resize-none"} value={form.packageDetails.description} onChange={(e) => handleNested("packageDetails", "description", e.target.value)} />
                    </div>

                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                        <label className={labelClass}>Qui paie la course ?</label>
                        <div className="grid grid-cols-2 gap-3">
                          <PayerOption active={form.payerType === 'SENDER'} onClick={() => setForm({...form, payerType: 'SENDER'})} label="Expéditeur" sub="Au départ" />
                          <PayerOption active={form.payerType === 'RECEIVER'} onClick={() => setForm({...form, payerType: 'RECEIVER'})} label="Destinataire" sub="À l'arrivée" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                <button type="button" onClick={() => setStep(1)} className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:text-primary dark:hover:text-white transition-colors"><ArrowLeft size={16} /> Retour</button>
                <button 
                  type="button" 
                  disabled={!form.pickupCommune || !form.dropoffCommune || loadingPrice} 
                  onClick={handleFetchPrice} 
                  className="w-full md:w-auto bg-primary dark:bg-secondary text-white dark:text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
                >
                  {loadingPrice ? <Loader2 className="animate-spin" size={18} /> : <><Eye size={18} /> Calculer le tarif</>}
                </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : RÉSUMÉ */}
        {step === 3 && (
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-soft space-y-8 animate-in zoom-in-95">
            <div className="bg-primary dark:bg-slate-800 text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-primary/30 dark:shadow-none relative overflow-hidden border border-transparent dark:border-slate-700">
                <div className="relative z-10 text-center md:text-left">
                    <p className="text-[10px] font-black opacity-60 dark:text-secondary uppercase tracking-[0.3em] mb-2">Tarif de livraison</p>
                    <p className="text-4xl md:text-6xl font-black tracking-tighter">
                        {priceData?.price?.toLocaleString()} <span className="text-xl md:text-2xl text-secondary">FCFA</span>
                    </p>
                </div>
                <div className="bg-white/10 dark:bg-secondary/20 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl z-10">
                    <Banknote size={44} className="text-secondary" />
                </div>
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-secondary/10 rounded-full blur-[80px]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryCard title="Départ" icon={<MapPin size={14}/>}>
                    <p className="font-bold text-primary dark:text-white">{form.pickupContact.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug truncate">{form.pickupLocation}</p>
                    <p className="text-[10px] font-black text-secondary uppercase mt-1">{communeNames.pickup || "Zone non définie"}</p>
                </SummaryCard>
                <SummaryCard title="Destination" icon={<Truck size={14}/>}>
                    <p className="font-bold text-primary dark:text-white">{form.dropoffContact.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug truncate">{form.dropoffLocation}</p>
                    <p className="text-[10px] font-black text-secondary uppercase mt-1">{communeNames.dropoff || "Zone non définie"}</p>
                </SummaryCard>
                <SummaryCard title="Le Colis" icon={<Package size={14}/>}>
                    <p className="font-bold text-primary dark:text-white uppercase text-xs">{CATEGORY_LABELS[form.packageDetails.category]}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-1 leading-tight line-clamp-2">"{form.packageDetails.description || "Pas de description"}"</p>
                    {form.packageDetails.isFragile && <span className="text-[8px] bg-red-50 dark:bg-red-900/20 text-red-500 px-2 py-0.5 rounded-full font-black mt-2 inline-block">FRAGILE</span>}
                </SummaryCard>
                <SummaryCard title="Paiement" icon={<CheckCircle2 size={14}/>}>
                    <p className="font-bold text-primary dark:text-white">Payé par : {form.payerType === 'SENDER' ? "L'expéditeur" : "Le destinataire"}</p>
                    <p className="text-[9px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-black px-3 py-1.5 rounded-xl mt-2 inline-block uppercase tracking-wider border border-emerald-100 dark:border-emerald-900/40">Espèces à la livraison</p>
                </SummaryCard>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                <button type="button" onClick={() => setStep(2)} className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:text-primary dark:hover:text-white transition-colors">
                  <ArrowLeft size={16} /> Modifier les infos
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full md:w-auto bg-secondary text-primary dark:text-primary px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-secondary/30 hover:opacity-90 transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><span>Confirmer la livraison</span><CheckCircle2 size={20} /></>}
                </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// COMPOSANTS LOCAUX MIS À JOUR POUR LE DARK MODE
function PayerOption({ active, onClick, label, sub }) {
  return (
    <button type="button" onClick={onClick} className={`p-3 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${active ? 'border-secondary bg-secondary/5 dark:bg-secondary/10 shadow-sm' : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 opacity-60'}`}>
      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${active ? 'border-secondary bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700'}`}>
          {active && <div className="w-2 h-2 bg-secondary rounded-full" />}
      </div>
      <div>
          <p className="text-[10px] font-black text-primary dark:text-white uppercase leading-none">{label}</p>
          <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-tighter">{sub}</p>
      </div>
    </button>
  );
}

function SummaryCard({ title, icon, children }) {
    return (
        <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-slate-300 dark:text-slate-600">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">{icon}</div>
                <span className="text-[9px] font-black uppercase tracking-widest italic">{title}</span>
            </div>
            {children}
        </div>
    );
}

function RoleOption({ active, onClick, icon, title, desc }) {
  return (
    <button type="button" onClick={onClick} className={`p-4 rounded-[2rem] border-2 transition-all text-left flex items-center gap-4 ${active ? 'border-secondary bg-white dark:bg-slate-800 shadow-xl shadow-secondary/10 dark:shadow-none scale-[1.02]' : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 opacity-60 hover:opacity-100'}`}>
      <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-secondary text-white dark:text-primary shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 shadow-sm'}`}>{icon}</div>
      <div>
        <p className="text-[11px] font-black text-primary dark:text-white uppercase leading-tight italic">{title}</p>
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1">{desc}</p>
      </div>
    </button>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-3 mb-4">
      <div className="p-2 bg-primary/5 dark:bg-secondary/10 rounded-xl text-primary dark:text-secondary">{icon}</div>
      <h2 className="font-black text-primary dark:text-white uppercase tracking-tighter italic text-[11px]">{title}</h2>
    </div>
  );
}