// FILE: src/pages/admins/AdminDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Phone, Mail, Clock, Trash2, CheckCircle, Ban } from "lucide-react";
import { fetchClientById, updateUserStatus, deleteUser } from "../../api/users.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";

export default function AdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadAdmin = async () => {
    try {
      setLoading(true);
      const res = await fetchClientById(id);
      setAdmin(res.data);
    } catch (err) { notifyError("Erreur chargement admin"); } finally { setLoading(false); }
  };

  useEffect(() => { loadAdmin(); }, [id]);

  const handleAction = async (status) => {
    try {
      await updateUserStatus(id, status);
      loadAdmin();
      notifySuccess("Statut mis à jour");
    } catch (err) { notifyError("Erreur mise à jour"); }
  };

  if (loading) return <PageLoader />;
  if (!admin) return <div className="p-8 text-center font-black text-rose-500 uppercase tracking-widest">Admin introuvable</div>;

  const cardClass = "bg-white border border-slate-50 rounded-[2rem] p-8 shadow-soft";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4 block";

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      {/* TOP NAV */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft size={16} strokeWidth={3} /> Retour
        </button>
        <div className="flex gap-2">
          <button onClick={() => handleAction("ACTIVE")} className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"><CheckCircle size={20}/></button>
          <button onClick={() => handleAction("BLOCKED")} className="p-4 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"><Ban size={20}/></button>
          <button onClick={() => setShowDeleteModal(true)} className="p-4 bg-slate-800 text-white rounded-2xl shadow-lg hover:bg-black transition-all"><Trash2 size={20}/></button>
        </div>
      </div>

      {/* IDENTITY HEADER */}
      <div className={`${cardClass} flex flex-col md:flex-row justify-between items-center gap-8 border-l-[12px] border-l-primary`}>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-[2rem] bg-slate-100 flex items-center justify-center text-4xl font-black text-primary italic border-4 border-white shadow-xl">
            {admin.nom?.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 font-display italic tracking-tighter uppercase">{admin.nom} {admin.prenom}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest italic">{admin.role}</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ID: {admin._id}</span>
            </div>
          </div>
        </div>
        <div className="text-center md:text-right">
          <span className={`inline-block px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border ${admin.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
            Compte {admin.status}
          </span>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className={cardClass}>
          <span className={labelClass}>Coordonnées</span>
          <div className="space-y-4 font-bold text-slate-700">
            <div className="flex items-center gap-4"><div className="p-2 bg-slate-50 rounded-lg"><Phone size={16} className="text-primary"/></div> {admin.telephone}</div>
            <div className="flex items-center gap-4"><div className="p-2 bg-slate-50 rounded-lg"><Mail size={16} className="text-primary"/></div> {admin.email || "—"}</div>
          </div>
        </div>

        <div className={cardClass}>
          <span className={labelClass}>Historique</span>
          <div className="space-y-4 text-sm font-bold text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-300 uppercase text-[9px]">Création</span>
              <span>{new Date(admin.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 uppercase text-[9px]">Dernière Connexion</span>
              <span className="text-secondary">{admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Jamais"}</span>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <span className={labelClass}>Sécurité</span>
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <Shield className="text-primary" size={24}/>
            <div>
              <p className="text-[10px] font-black text-primary uppercase">Niveau d'accès</p>
              <p className="text-xs font-bold text-slate-600">Administrateur Système</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}