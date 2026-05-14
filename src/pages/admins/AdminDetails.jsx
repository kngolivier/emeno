// FILE: src/pages/admins/AdminDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Phone, Mail, Clock, Trash2, CheckCircle, Ban, Calendar } from "lucide-react";
import { fetchClientById, updateUserStatus, deleteUser } from "../../api/users.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";

export default function AdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadAdmin = async () => {
    try {
      setLoading(true);
      const res = await fetchClientById(id);
      setAdmin(res.data);
    } catch (err) { 
      notifyError("Erreur lors du chargement de l'admin"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { loadAdmin(); }, [id]);

  const handleAction = async (status) => {
    try {
      await updateUserStatus(id, status);
      loadAdmin();
      notifySuccess(`Le compte est désormais ${status}`);
    } catch (err) { 
      notifyError("Erreur lors de la mise à jour"); 
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(id);
      notifySuccess("Le compte administrateur a été supprimé");
      navigate("/admin/admins"); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Erreur lors de la suppression";
      notifyError(errorMsg);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!admin) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
       <div className="p-6 bg-rose-50 dark:bg-rose-500/10 rounded-full text-rose-500"><Shield size={48} /></div>
       <p className="font-black text-rose-500 uppercase tracking-widest italic">Admin introuvable</p>
       <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 border-b border-slate-200 dark:border-white/10 pb-1">Retourner à la liste</button>
    </div>
  );

  const cardClass = "bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-soft transition-all hover:shadow-xl dark:hover:shadow-none";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 mb-6 block";

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 font-sans pb-12 transition-colors">
      
      {/* NAVIGATION & ACTIONS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-all group">
          <div className="p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-slate-50 dark:border-white/10 group-hover:-translate-x-1 transition-transform">
            <ArrowLeft size={16} strokeWidth={3} /> 
          </div>
          Retour
        </button>
        
        <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 p-1.5 rounded-[1.5rem] border border-slate-100 dark:border-white/10 backdrop-blur-sm shadow-sm">
          <button onClick={() => handleAction("ACTIVE")} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
            <CheckCircle size={16} /> Activer
          </button>
          <button onClick={() => handleAction("BLOCKED")} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95">
            <Ban size={16} /> Bloquer
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg active:scale-95" title="Supprimer">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* MAIN IDENTITY CARD */}
      <div className={`${cardClass} relative overflow-hidden border-l-[12px] border-l-primary dark:border-l-secondary`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl">
              <div className="h-full w-full rounded-[2.3rem] bg-white dark:bg-slate-900 flex items-center justify-center text-4xl font-black text-primary dark:text-white italic border-4 border-white dark:border-slate-900">
                {admin.nom?.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white font-display italic tracking-tighter uppercase leading-none">
                  {admin.nom} {admin.prenom}
                </h1>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <span className="px-4 py-1.5 rounded-xl bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary text-[9px] font-black uppercase tracking-widest italic border border-primary/10">
                  {admin.role || 'ADMINISTRATEUR'}
                </span>
                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Membre Staff • ID {admin._id?.slice(-6)}</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className={`text-center px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 ${admin.status === "ACTIVE" ? "bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" : "bg-rose-50/50 dark:bg-rose-500/5 text-rose-500 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"}`}>
              {admin.status === "ACTIVE" ? "Accès Autorisé" : "Accès Révoqué"}
            </div>
          </div>
        </div>
        <Shield className="absolute -right-10 -bottom-10 text-slate-50 dark:text-white/5 opacity-50 pointer-events-none" size={200} strokeWidth={1} />
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className={cardClass}>
          <span className={labelClass}>Contact Direct</span>
          <div className="space-y-6">
            <div className="flex items-center gap-5 group">
              <div className="p-4 bg-slate-50 dark:bg-white/5 text-primary dark:text-secondary rounded-2xl group-hover:bg-primary dark:group-hover:bg-secondary group-hover:text-white transition-all">
                <Phone size={20} />
              </div> 
              <div>
                <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-0.5">Téléphone</p>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200 italic">{admin.telephone}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="p-4 bg-slate-50 dark:bg-white/5 text-primary dark:text-secondary rounded-2xl group-hover:bg-primary dark:group-hover:bg-secondary group-hover:text-white transition-all">
                <Mail size={20} />
              </div> 
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-0.5">Email Pro</p>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200 truncate italic">{admin.email || "Non renseigné"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <span className={labelClass}>Activité Compte</span>
          <div className="space-y-5">
            <div className="flex justify-between items-center p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-50 dark:border-white/5">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-slate-300 dark:text-slate-600" />
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Enregistré le</span>
              </div>
              <span className="text-xs font-black text-slate-600 dark:text-slate-400">{new Date(admin.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-50 dark:border-white/5">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-secondary" />
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dernier accès</span>
              </div>
              <span className="text-xs font-black text-secondary uppercase italic">
                {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Aucun"}
              </span>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <span className={labelClass}>Sécurité Système</span>
          <div className="p-5 bg-slate-900 dark:bg-secondary rounded-3xl text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col gap-4">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Privilèges</p>
                <p className="text-lg font-black italic tracking-tight uppercase leading-none">Accès Total <br/>Dashboard</p>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md p-0 md:p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-sm text-center space-y-6 shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95">
            <div className="w-16 h-1 bg-slate-100 dark:bg-white/10 rounded-full mx-auto md:hidden -mt-4 mb-4" />
            <div className="w-20 h-20 bg-red-50 dark:bg-rose-500/10 text-red-500 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto rotate-3">
              <Trash2 size={32} />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl italic text-slate-900 dark:text-white uppercase">Supprimer ?</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-2 px-4 italic leading-relaxed">Action irréversible. Toutes les données de cet administrateur seront définitivement effacées du système.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 pt-2">
              <button 
                onClick={handleDelete} 
                disabled={deleting} 
                className="w-full py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                {deleting ? "Suppression..." : "Confirmer"}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}