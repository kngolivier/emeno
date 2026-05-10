// FILE: src/pages/client-portal/ClientProfile.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../api/users.api";
import { User, Mail, Pencil, Check, X, Phone, MapPin, Shield, Lock } from "lucide-react";

export default function ClientProfile() {
  const { user, login } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom: user?.nom || "", prenom: user?.prenom || "", telephone: user?.telephone || "", email: user?.email || "", adresse: user?.adresse || "" });

  const formatPhone = (phone) => {
    if (!phone) return "";
    // On enlève tout ce qui n'est pas chiffre pour nettoyer
    const cleaned = phone.replace(/\D/g, "");
    
    // Formatage pour le Gabon (ex: +241 066 12 34 56)
    // On gère le cas où le numéro commence par 241 ou 0
    const match = cleaned.match(/^(241|0)?(\d{1})(\d{2})(\d{2})(\d{2})$/);
    
    if (match) {
      return `+241 ${match[2]}${match[3]} ${match[4]} ${match[5]} ${match[6]}`;
    }
    
    // Si le format est différent, on met juste des espaces tous les 2 chiffres
    return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
  };

  const handleOpen = () => {
    setForm({ nom: user.nom, prenom: user.prenom, telephone: user.telephone || "", email: user.email || "", adresse: user.adresse || "" });
    setOpenModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateMyProfile(form);
      login({ user: res.data, token: localStorage.getItem("token") });
      setOpenModal(false);
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold text-primary outline-none focus:border-secondary/20 focus:bg-white transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-secondary mb-1 block";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* HEADER CARD - Optimisé pour EMENO */}
      <div className="bg-white border-2 border-slate-50 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-soft flex flex-col items-center sm:flex-row sm:justify-between gap-6 dark:bg-primary">
        <div className="flex flex-col items-center sm:flex-row gap-4 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
          {/* Avatar plus petit sur mobile */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 dark:bg-white dark:text-primary">
            <User size={28} sm:size={32} strokeWidth={2.5} />
          </div>
          
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-black text-primary tracking-tight dark:text-secondary">
              {user.nom} {user.prenom}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 font-bold italic text-xs sm:text-sm">
              <Mail size={12} sm:size={14} /> 
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Bouton Modifier - Largeur pleine sur mobile, compact sur desktop */}
        <button 
          onClick={handleOpen} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:shadow-lg active:scale-95 transition-all shadow-md shadow-secondary/10"
        >
          <Pencil size={14} sm:size={18} /> 
          <span>Modifier le profil</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileDetailCard icon={<User />} title="Identité" items={[{ label: "Nom", value: user.nom }, { label: "Prénom", value: user.prenom }, { label: "Téléphone", value: `${formatPhone(user.telephone)}` || "-" }]} />
        <ProfileDetailCard icon={<Shield className="text-secondary" />} title="Compte" items={[{ label: "Email", value: user.email }, { label: "Rôle", value: user.role, highlight: true }]} />
      </div>

      {/* MODAL DE MODIFICATION - Version EMENO Sécurisée */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white p-5 sm:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-white max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-primary italic tracking-tighter leading-none">Éditer mon profil</h2>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">Mise à jour des informations</p>
              </div>
              <button onClick={() => setOpenModal(false)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Grille Nom / Prénom - Adaptative */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>Nom</label>
                  <input name="nom" value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Prénom</label>
                  <input name="prenom" value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} className={inputClass} />
                </div>
              </div>

              {/* Téléphone - VERROUILLÉ */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className={labelClass}>Numéro de téléphone</label>
                  <span className="text-[8px] font-black text-slate-300 uppercase flex items-center gap-1">
                    <Shield size={10} /> Identifiant vérifié
                  </span>
                </div>
                <div className="relative">
                  <input 
                    value={formatPhone(form.telephone)}
                    readOnly 
                    className={`${inputClass} bg-slate-100 text-slate-400 border-dashed cursor-not-allowed`} 
                  />
                  <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
              </div>
              
              {/* Adresse */}
              <div className="space-y-1">
                <label className={labelClass}>Adresse de résidence</label>
                <input 
                  name="adresse" 
                  placeholder="Ex: Akanda, Carrefour Joli Soir"
                  value={form.adresse} 
                  onChange={(e) => setForm({...form, adresse: e.target.value})} 
                  className={inputClass} 
                />
              </div>

              {/* Bouton de sauvegarde optimisé sur une ligne */}
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary text-white py-4 sm:py-5 rounded-xl sm:rounded-[2rem] font-black uppercase tracking-[0.1em] text-[10px] sm:text-xs shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Enregistrement..." : <>Enregistrer les changements <Check size={16} /></>}
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
    <div className="bg-white border border-slate-50 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-soft space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
        {/* Icône plus petite */}
        <div className="text-primary scale-75 sm:scale-100">{icon}</div>
        <h2 className="font-black text-primary uppercase tracking-widest text-[9px] sm:text-xs">{title}</h2>
      </div>
      
      <div className="space-y-2 sm:space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50/30 p-3 sm:p-4 rounded-xl border border-slate-50">
            {/* Label en micro-police */}
            <span className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.label}</span>
            {/* Valeur réduite de text-sm à text-xs */}
            <span className={`text-xs sm:text-sm font-black ${item.highlight ? "text-secondary italic" : "text-primary"}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}