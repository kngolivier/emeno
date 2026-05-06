// FILE: src/pages/client-portal/ClientCreateOrder.jsx
import { useState, useEffect } from "react";
import { createDelivery } from "../../api/deliveries.api";
import { calculatePrice } from "../../api/pricing.api"; 
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, ArrowLeft, Loader2, User, MapPin, 
  Package, UserCircle, Truck, CheckCircle2, Eye, Banknote, Info
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PhoneInput from "../../components/forms/PhoneInput";
import CommuneSelect from "../../components/forms/CommuneSelect";
import { notifySuccess, notifyError } from "../../utils/notify";

export default function ClientCreateOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [step, setStep] = useState(1);
  const [clientPosition, setClientPosition] = useState('SENDER');
  const [priceData, setPriceData] = useState(null);

  const [form, setForm] = useState({
    isForSomeoneElse: false,
    pickupContact: { name: "", phone: "" },
    dropoffContact: { name: "", phone: "" },
    pickupLocation: "",
    dropoffLocation: "",
    pickupCommune: "",
    dropoffCommune: "",
    payerType: "SENDER",
    packageDetails: { category: "OTHER", description: "", isFragile: false, weight: "" },
    notes: ""
  });

  // Gestion intelligente des rôles (Expéditeur / Destinataire / Tiers)
  useEffect(() => {
    const userInfo = { name: `${user?.nom} ${user?.prenom}`, phone: user?.telephone || "" };
    const emptyInfo = { name: "", phone: "" };

    setForm(prev => {
      let newForm = { ...prev };

      if (clientPosition === 'SENDER') {
        // L'utilisateur est l'expéditeur
        newForm.pickupContact = userInfo;
        newForm.pickupLocation = user?.adresse || "";
        // On vide le destinataire
        newForm.dropoffContact = emptyInfo;
        newForm.dropoffLocation = "";
        newForm.isForSomeoneElse = false;
      } 
      else if (clientPosition === 'RECEIVER') {
        // L'utilisateur est le destinataire
        newForm.dropoffContact = userInfo;
        newForm.dropoffLocation = user?.adresse || "";
        // On vide l'expéditeur
        newForm.pickupContact = emptyInfo;
        newForm.pickupLocation = "";
        newForm.isForSomeoneElse = false;
      } 
      else {
        // Envoi tiers : on vide tout pour laisser la main libre
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

      if (!data || data.price === undefined || data.price === null) {
        return notifyError("Désolé, ce trajet n'est pas encore desservi.");
      }

      setPriceData(data); 
      setStep(3);
    } catch (err) {
      const status = err?.response?.status;
      const errorMsg = status === 404 
        ? "Ce trajet n'est pas encore répertorié dans nos tarifs." 
        : "Erreur lors du calcul du prix.";
      notifyError(errorMsg);
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
        packageDetails: { ...form.packageDetails, weight: Number(form.packageDetails.weight) } 
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

  const inputClass = "w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-primary outline-none focus:border-secondary/20 focus:bg-white transition-all shadow-inner";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2";

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Nouvelle commande</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Étape {step} sur 3</p>
        </div>
        <div className="flex gap-2">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 w-6 md:w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-secondary shadow-lg shadow-secondary/20' : 'bg-slate-200'}`} />
            ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ÉTAPE 1 : IDENTIFICATION CONTACTS */}
        {step === 1 && (
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-soft space-y-8 animate-in fade-in zoom-in-95">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RoleOption active={clientPosition === 'SENDER'} onClick={() => setClientPosition('SENDER')} icon={<UserCircle />} title="Expéditeur" desc="Je donne le colis" />
                <RoleOption active={clientPosition === 'RECEIVER'} onClick={() => setClientPosition('RECEIVER')} icon={<Truck />} title="Destinataire" desc="Je reçois le colis" />
                <RoleOption active={clientPosition === 'NONE'} onClick={() => setClientPosition('NONE')} icon={<CheckCircle2 />} title="Envoi tiers" desc="Je commande pour autrui" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-6 border-t border-slate-50">
                <div className="space-y-4">
                    <SectionTitle icon={<User size={16} />} title="Expéditeur" />
                    <div>
                        <label className={labelClass}>Nom complet</label>
                        <input placeholder="Ex: Jean Paul" className={inputClass} value={form.pickupContact.name} onChange={(e) => handleNested("pickupContact", "name", e.target.value)} disabled={clientPosition === 'SENDER'} />
                    </div>
                    <PhoneInput label="TÉLÉPHONE" value={form.pickupContact.phone} onChange={(v) => handleNested("pickupContact", "phone", v)} disabled={clientPosition === 'SENDER'} />
                </div>
                <div className="space-y-4">
                    <SectionTitle icon={<User className="text-secondary" size={16} />} title="Destinataire" />
                    <div>
                        <label className={labelClass}>Nom complet</label>
                        <input placeholder="Ex: Marie Claire" className={inputClass} value={form.dropoffContact.name} onChange={(e) => handleNested("dropoffContact", "name", e.target.value)} disabled={clientPosition === 'RECEIVER'} />
                    </div>
                    <PhoneInput label="TÉLÉPHONE" value={form.dropoffContact.phone} onChange={(v) => handleNested("dropoffContact", "phone", v)} disabled={clientPosition === 'RECEIVER'} />
                </div>
            </div>
            
            <div className="flex justify-end pt-4">
                <button type="button" disabled={!form.pickupContact.name || !form.dropoffContact.name} onClick={() => setStep(2)} className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-20 hover:bg-secondary transition-all shadow-xl shadow-primary/10">Suivant <ArrowRight size={18} /></button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : LOCALISATION & COLIS */}
        {step === 2 && (
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-soft space-y-8 animate-in slide-in-from-right-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <SectionTitle icon={<MapPin size={16} />} title="Itinéraire" />
                    <div>
                        <label className={labelClass}>Lieu précis de ramassage</label>
                        <input placeholder="Ex: En face de la pharmacie" className={inputClass} value={form.pickupLocation} onChange={(e) => setForm({...form, pickupLocation: e.target.value})} />
                    </div>
                    <CommuneSelect label="COMMUNE DÉPART" value={form.pickupCommune} onChange={(v) => setForm({...form, pickupCommune: v})} />
                    
                    <div className="pt-4">
                        <label className={labelClass}>Lieu précis de livraison</label>
                        <input placeholder="Ex: Villa n°12" className={inputClass} value={form.dropoffLocation} onChange={(e) => setForm({...form, dropoffLocation: e.target.value})} />
                    </div>
                    <CommuneSelect label="COMMUNE ARRIVÉE" value={form.dropoffCommune} onChange={(v) => setForm({...form, dropoffCommune: v})} />
                </div>
                
                <div className="space-y-5">
                    <SectionTitle icon={<Package className="text-secondary" size={16} />} title="Le Colis" />
                    <div>
                        <label className={labelClass}>Catégorie</label>
                        <select className={inputClass} value={form.packageDetails.category} onChange={(e) => handleNested("packageDetails", "category", e.target.value)}>
                            <option value="OTHER">Autre catégorie</option>
                            <option value="FOOD">Alimentaire</option>
                            <option value="ELECTRONICS">Électronique / Fragile</option>
                            <option value="DOCUMENT">Plis / Documents</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Description du contenu</label>
                        <textarea placeholder="Que transportons-nous ?" className={inputClass + " h-32 resize-none"} value={form.packageDetails.description} onChange={(e) => handleNested("packageDetails", "description", e.target.value)} />
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                        <Info size={18} className="text-amber-500 shrink-0" />
                        <p className="text-[9px] text-amber-700 font-black leading-relaxed uppercase">
                            Le prix est calculé selon les zones. Si aucun prix ne s'affiche, la zone n'est pas encore couverte.
                        </p>
                    </div>
                </div>
                {/* SÉLECTEUR DE PAYEUR - Intégré à l'Étape 2 */}
                <div className="space-y-4 pt-4 border-t border-slate-50 mt-4">
                    <SectionTitle icon={<Banknote className="text-secondary" size={16} />} title="Responsable du paiement" />
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <button 
                          type="button"
                          onClick={() => setForm({...form, payerType: 'SENDER'})}
                          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${form.payerType === 'SENDER' ? 'border-secondary bg-secondary/5' : 'border-slate-50 bg-slate-50/50'}`}
                      >
                          {/* shrink-0 empêche la déformation en ovale */}
                          <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${form.payerType === 'SENDER' ? 'border-secondary bg-white' : 'border-slate-200'}`}>
                              {form.payerType === 'SENDER' && <div className="w-2.5 h-2.5 bg-secondary rounded-full" />}
                          </div>
                          <div className="text-left min-w-0">
                              <p className="text-[9px] font-black text-primary uppercase leading-none truncate">Expéditeur</p>
                              <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Départ</p>
                          </div>
                      </button>

                      <button 
                          type="button"
                          onClick={() => setForm({...form, payerType: 'RECEIVER'})}
                          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${form.payerType === 'RECEIVER' ? 'border-secondary bg-secondary/5' : 'border-slate-50 bg-slate-50/50'}`}
                      >
                          <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${form.payerType === 'RECEIVER' ? 'border-secondary bg-white' : 'border-slate-200'}`}>
                              {form.payerType === 'RECEIVER' && <div className="w-2.5 h-2.5 bg-secondary rounded-full" />}
                          </div>
                          <div className="text-left min-w-0">
                              <p className="text-[9px] font-black text-primary uppercase leading-none truncate">Destinataire</p>
                              <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Arrivée</p>
                          </div>
                      </button>
                  </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-50">
                <button type="button" onClick={() => setStep(1)} className="text-slate-400 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:text-primary transition-colors"><ArrowLeft size={16} /> Retour</button>
                <button 
                  type="button" 
                  disabled={!form.pickupCommune || !form.dropoffCommune || loadingPrice} 
                  onClick={handleFetchPrice} 
                  className="w-full md:w-auto bg-primary text-white px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:bg-secondary active:scale-95 transition-all"
                >
                  {loadingPrice ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Eye size={14} /> 
                      <span>Calculer le tarif</span>
                    </>
                  )}
                </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : RÉSUMÉ FINAL */}
        {step === 3 && (
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-soft space-y-8 animate-in zoom-in-95">
            <div className="bg-primary text-white p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-primary/30 relative overflow-hidden">
                <div className="relative z-10 text-center md:text-left">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] mb-2">Total de la course</p>
                    <p className="text-4xl md:text-6xl font-black tracking-tighter">
                        {priceData?.price?.toLocaleString()} <span className="text-xl md:text-2xl text-secondary">FCFA</span>
                    </p>
                </div>
                <div className="bg-white/10 p-5 rounded-[2rem] border border-white/10 backdrop-blur-xl z-10">
                    <Banknote size={40} className="text-secondary" />
                </div>
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-secondary/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryCard title="Départ" icon={<MapPin size={14}/>}>
                    <p className="font-bold text-primary">{form.pickupContact.name}</p>
                    <p className="text-xs text-slate-500 leading-snug">{form.pickupLocation}</p>
                    <p className="text-[10px] font-black text-secondary uppercase mt-1">{form.pickupCommune}</p>
                </SummaryCard>
                <SummaryCard title="Destination" icon={<Truck size={14}/>}>
                    <p className="font-bold text-primary">{form.dropoffContact.name}</p>
                    <p className="text-xs text-slate-500 leading-snug">{form.dropoffLocation}</p>
                    <p className="text-[10px] font-black text-secondary uppercase mt-1">{form.dropoffCommune}</p>
                </SummaryCard>
                <SummaryCard title="Objet" icon={<Package size={14}/>}>
                    <p className="font-bold text-primary capitalize">{form.packageDetails.category.toLowerCase()}</p>
                    <p className="text-xs text-slate-500 italic mt-1">"{form.packageDetails.description || "Aucun détail"}"</p>
                </SummaryCard>
                <SummaryCard title="Paiement" icon={<CheckCircle2 size={14}/>}>
                    <p className="font-bold text-primary">Frais à la charge du {form.payerType === 'SENDER' ? "Client" : "Destinataire"}</p>
                    <p className="text-[9px] bg-secondary text-white font-black px-2 py-1 rounded mt-2 inline-block uppercase tracking-wider">Paiement Cash à la livraison</p>
                </SummaryCard>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
                <button type="button" onClick={() => setStep(2)} className="text-slate-300 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:text-primary transition-colors">
                  <ArrowLeft size={16} /> Modifier les infos
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full md:w-auto bg-secondary text-white px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] sm:text-xs flex items-center justify-center gap-3 shadow-xl shadow-secondary/30 hover:bg-primary active:scale-95 transition-all"
                >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} /> 
                    ) : (
                      <>
                        <span>Valider la commande</span>
                        <CheckCircle2 size={16} />
                      </>
                    )}
                </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// COMPOSANTS INTERNES RÉ-UTILISÉS
function SummaryCard({ title, icon, children }) {
    return (
        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4 text-slate-300">
                <div className="p-2 bg-white rounded-xl shadow-sm">{icon}</div>
                <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
            </div>
            {children}
        </div>
    );
}

function RoleOption({ active, onClick, icon, title, desc }) {
  return (
    <button type="button" onClick={onClick} className={`p-4 md:p-5 rounded-[2rem] border-2 transition-all text-left flex items-center gap-4 ${active ? 'border-secondary bg-white shadow-xl shadow-secondary/10 scale-[1.02]' : 'border-slate-50 bg-slate-50/50 opacity-60 hover:opacity-100'}`}>
      <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-secondary text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm'}`}>{icon}</div>
      <div>
        <p className="text-xs font-black text-primary uppercase leading-tight">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 mt-1">{desc}</p>
      </div>
    </button>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
      <div className="p-2 bg-primary/5 rounded-xl text-primary">{icon}</div>
      <h2 className="font-black text-primary uppercase tracking-tighter italic text-[11px]">{title}</h2>
    </div>
  );
}