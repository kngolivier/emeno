// src/pages/client-portal/ClientProfile.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../api/users.api";
import { User, Mail, Pencil, Check, X, Phone, MapPin, Shield, Lock } from "lucide-react";

export default function ClientProfile() {
  const { user, login } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    nom: user?.nom || "", 
    prenom: user?.prenom || "", 
    telephone: user?.telephone || "", 
    email: user?.email || "", 
    adresse: user?.adresse || "" 
  });

  const formatPhone = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(241|0)?(\d{1})(\d{2})(\d{2})(\d{2})$/);
    
    if (match) {
      return `+241 ${match[2]}${match[3]} ${match[4]} ${match[5]} ${match[6]}`;
    }
    return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
  };

  const handleOpen = () => {
    setForm({ 
      nom: user.nom, 
      prenom: user.prenom, 
      telephone: user.telephone || "", 
      email: user.email || "", 
      adresse: user.adresse || "" 
    });
    setOpenModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateMyProfile(form);
      // 💡 Plus besoin de lire ni de ré-injecter localStorage.getItem("token") ici !
      login({ user: res.data }); 
      setOpenModal(false);
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-[12px] font-bold text-primary dark:text-white outline-none focus:border-secondary/30 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm";
  const labelClass = "text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 block italic";

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER CARD - Look Chic & Dark Mode ready */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-soft flex flex-col items-center sm:flex-row sm:justify-between gap-8">
        <div className="flex flex-col items-center sm:flex-row gap-6 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] bg-primary dark:bg-secondary text-white dark:text-primary flex items-center justify-center shadow-xl shadow-primary/10 dark:shadow-secondary/5 border-4 border-white dark:border-slate-800">
            <User size={36} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-primary dark:text-white italic tracking-tighter uppercase">
              {user.prenom} {user.nom}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 dark:text-slate-500 font-bold italic text-sm">
              <Mail size={14} className="text-secondary" /> 
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleOpen} 
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary dark:bg-secondary text-white dark:text-primary px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl active:scale-95 transition-all shadow-lg shadow-primary/20 dark:shadow-none"
        >
          <Pencil size={16} strokeWidth={3} /> 
          <span>Éditer le profil</span>
        </button>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProfileDetailCard 
          icon={<User className="text-secondary" size={20} />} 
          title="Identité personnelle" 
          items={[
            { label: "Nom de famille", value: user.nom }, 
            { label: "Prénom", value: user.prenom }, 
            { label: "Contact Gabon", value: formatPhone(user.telephone) || "Non renseigné" }
          ]} 
        />
        <ProfileDetailCard 
          icon={<Shield className="text-secondary" size={20} />} 
          title="Sécurité du compte" 
          items={[
            { label: "Adresse E-mail", value: user.email }, 
            { label: "Type d'utilisateur", value: user.role, highlight: true },
            { label: "Localisation", value: user.adresse || "Libreville, Gabon" }
          ]} 
        />
      </div>

      {/* MODAL DE MODIFICATION */}
      {openModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 dark:bg-black/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3rem] shadow-2xl w-full max-w-xl border-4 border-white/50 dark:border-slate-800/50 max-h-[90vh] overflow-y-auto scrollbar-hide relative">
            
            <button 
              onClick={() => setOpenModal(false)} 
              className="absolute right-8 top-8 p-2 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <X size={28} strokeWidth={3} />
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-black text-primary dark:text-white italic tracking-tighter uppercase leading-none">Profil EMENO</h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-3 italic">Mise à jour des informations client</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className={labelClass}>Nom</label>
                  <input name="nom" value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Prénom</label>
                  <input name="prenom" value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} className={inputClass} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className={labelClass}>Téléphone (Verrouillé)</label>
                  <span className="text-[8px] font-black text-secondary uppercase flex items-center gap-1">
                    <Lock size={10} /> Sécurisé
                  </span>
                </div>
                <div className="relative group">
                  <input 
                    value={formatPhone(form.telephone)}
                    readOnly 
                    className={`${inputClass} bg-slate-50 dark:bg-slate-800 text-slate-400 border-dashed cursor-not-allowed opacity-70`} 
                  />
                  <Shield size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200 dark:text-slate-700" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className={labelClass}>Adresse de livraison par défaut</label>
                <div className="relative">
                   <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
                   <input 
                    name="adresse" 
                    placeholder="Ex: Akanda, Face au stade"
                    value={form.adresse} 
                    onChange={(e) => setForm({...form, adresse: e.target.value})} 
                    className={`${inputClass} pl-12`} 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary dark:bg-secondary text-white dark:text-primary py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {loading ? "Enregistrement..." : <>Confirmer les modifications <Check size={18} strokeWidth={3} /></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileDetailCard({ icon, title, items }) {
  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-soft space-y-8">
      <div className="flex items-center gap-4 border-b-2 border-slate-50 dark:border-slate-800 pb-5">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-primary dark:text-white">
          {icon}
        </div>
        <h2 className="font-black text-primary dark:text-white uppercase tracking-[0.2em] text-[11px] italic">{title}</h2>
      </div>
      
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-[1.5rem] border border-slate-50/50 dark:border-slate-800/50 group hover:border-secondary/20 transition-colors">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{item.label}</span>
            <span className={`text-[13px] font-black tracking-tight ${item.highlight ? "text-secondary italic" : "text-primary dark:text-white"}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}