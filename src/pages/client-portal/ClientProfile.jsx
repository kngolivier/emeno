// FILE: src/pages/client-portal/ClientProfile.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../api/users.api";
import { User, Mail, Pencil, Check, X, Phone, MapPin, Shield } from "lucide-react";

export default function ClientProfile() {
  const { user, login } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom: user?.nom || "", prenom: user?.prenom || "", telephone: user?.telephone || "", email: user?.email || "", adresse: user?.adresse || "" });

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
      {/* HEADER CARD */}
      <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <User size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">{user.nom} {user.prenom}</h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold italic">
              <Mail size={14} /> {user.email}
            </div>
          </div>
        </div>
        <button onClick={handleOpen} className="flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-lg active:scale-95 transition-all">
          <Pencil size={18} /> Modifier le profil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileDetailCard icon={<User />} title="Identité" items={[{ label: "Nom", value: user.nom }, { label: "Prénom", value: user.prenom }, { label: "Téléphone", value: user.telephone || "-" }]} />
        <ProfileDetailCard icon={<Shield className="text-secondary" />} title="Compte" items={[{ label: "Email", value: user.email }, { label: "Rôle", value: user.role, highlight: true }]} />
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-lg border border-white">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-primary italic tracking-tighter">Éditer mon profil</h2>
              <button onClick={() => setOpenModal(false)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Nom</label><input name="nom" value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className={inputClass} /></div>
                <div><label className={labelClass}>Prénom</label><input name="prenom" value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Téléphone</label><input name="telephone" value={form.telephone} onChange={(e) => setForm({...form, telephone: e.target.value})} className={inputClass} /></div>
              <div><label className={labelClass}>Adresse</label><input name="adresse" value={form.adresse} onChange={(e) => setForm({...form, adresse: e.target.value})} className={inputClass} /></div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
                {loading ? "Enregistrement..." : "Sauvegarder les modifications"}
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
    <div className="bg-white border border-slate-50 rounded-[2.5rem] p-8 shadow-soft space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
        <div className="text-primary">{icon}</div>
        <h2 className="font-black text-primary uppercase tracking-widest text-xs">{title}</h2>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.label}</span>
            <span className={`text-sm font-black ${item.highlight ? "text-secondary italic" : "text-primary"}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}