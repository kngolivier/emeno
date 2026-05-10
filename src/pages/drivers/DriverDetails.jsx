// FILE: src/pages/drivers/DriverDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Phone, Activity, Truck, Package, 
  ShieldOff, Trash2, Mail, ExternalLink, ShieldCheck, Clock 
} from "lucide-react";

// API Services
import { fetchDriverById, updateUserStatus, deleteUser } from "../../api/users.api";
import { fetchDriverStats } from "../../api/stats.api"; //

// Utils
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";

export default function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États pour les données
  const [driver, setDriver] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0, distance: 0 }); //
  const [loading, setLoading] = useState(true);
  
  // États pour les actions
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /**
   * Chargement combiné du profil et des statistiques
   */
  const loadData = async () => {
    try {
      const [driverRes, statsRes] = await Promise.all([
        fetchDriverById(id),
        fetchDriverStats(id, "MONTH") // Statistique mensuelle par défaut
      ]);
      
      setDriver(driverRes?.data?.data || driverRes?.data || driverRes);
      setStats(statsRes?.data?.data || statsRes?.data || statsRes);
    } catch (err) {
      notifyError("Impossible de charger les données du livreur");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    loadData(); 
  }, [id]);

  /**
   * Calcul du taux de réussite (Performance)
   */
  const performanceRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) + "%" 
    : "0%";

  const formatJoinDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
  };

  const handleBlockToggle = async () => {
    try {
      const newStatus = driver.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
      await updateUserStatus(driver._id, newStatus);
      setDriver(prev => ({ ...prev, status: newStatus }));
      notifySuccess(newStatus === "ACTIVE" ? "Livreur débloqué" : "Livreur bloqué");
    } catch (err) { 
      notifyError("Erreur lors du changement de statut"); 
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(driver._id);
      notifySuccess("Livreur supprimé avec succès");
      navigate("/admin/drivers");
    } catch (err) { 
      notifyError("Erreur de suppression"); 
    } finally { 
      setDeleting(false); 
    }
  };

  if (loading) return <PageLoader />;
  if (!driver) return <div className="p-20 text-center font-display italic text-primary">Livreur introuvable</div>;

  return (
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 font-sans max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-slate-100 hover:shadow-lg transition-all text-primary active:scale-90"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <div className="min-w-0 py-1"> 
              <h1 className="text-3xl md:text-5xl font-black text-primary font-display italic tracking-tighter leading-[1.1] pr-2">
                {driver.nom} {driver.prenom}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border shrink-0 
                  ${driver.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  ● {driver.status}
                  </span>
                  <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest italic">ID: {driver._id.slice(-6)}</span>
              </div>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleBlockToggle} 
            className="flex-1 md:flex-none px-4 md:px-6 py-4 bg-white border border-slate-100 text-primary rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {driver.status === "BLOCKED" ? <ShieldCheck size={16} className="text-secondary" /> : <ShieldOff size={16} />} 
            {driver.status === "BLOCKED" ? "Activer" : "Bloquer"}
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="flex-1 md:flex-none px-4 md:px-6 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-xl shadow-red-200 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* CONTACT CARD */}
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-50 shadow-soft space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Contact & Localisation</h3>
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <Activity size={16} />
            </div>
          </div>
          
          <div className="space-y-3">
            <a href={`tel:${driver.telephone}`} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-secondary group-hover:scale-110 transition-transform"><Phone size={18} /></div>
                    <span className="font-bold text-slate-700 text-sm md:text-base">{driver.telephone}</span>
                </div>
                <ExternalLink size={14} className="text-slate-300" />
            </a>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent">
              <div className="p-2 bg-white rounded-xl shadow-sm text-secondary"><Mail size={18} /></div>
              <span className="font-bold text-slate-700 text-sm md:text-base break-all">{driver.email || "Non renseigné"}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-slate-100">
             <p className="text-[9px] font-black text-slate-300 uppercase mb-2 ml-1">Adresse de résidence</p>
             <p className="text-sm font-bold text-primary italic bg-slate-50/50 p-4 rounded-2xl">{driver.adresse || "Libreville, Gabon"}</p>
          </div>
        </div>

        {/* REAL-TIME STATISTICS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { label: "Livraisons", val: stats.total, icon: Truck, col: "bg-primary" },
            { label: "Réussies", val: stats.completed, icon: Package, col: "bg-secondary" },
            { label: "Performance", val: performanceRate, icon: Activity, col: "bg-emerald-500" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-50 shadow-soft flex flex-row sm:flex-col items-center justify-between sm:justify-center text-left sm:text-center gap-4">
              <div className={`w-12 h-12 md:w-16 md:h-16 ${item.col} rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                <item.icon size={24} />
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-display font-black text-2xl md:text-4xl text-primary italic leading-none">{item.val}</p>
              </div>
            </div>
          ))}

          {/* JOIN DATE CARD */}
          <div className="sm:col-span-3 bg-primary text-white p-6 rounded-[2rem] flex items-center justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1 font-sans">Membre du staff depuis</p>
                <p className="text-lg md:text-2xl font-display italic font-black capitalize">
                  {formatJoinDate(driver.dateCreation || driver.createdAt)}
                </p>
              </div>
              <Clock className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-primary/40 backdrop-blur-md p-0 md:p-4">
          <div className="bg-white p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-sm text-center space-y-6 shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95">
            <div className="w-16 h-1 w-12 bg-slate-100 rounded-full mx-auto md:hidden -mt-4 mb-4" />
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto rotate-3">
              <Trash2 size={32} />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl italic text-primary uppercase">Supprimer ?</h2>
              <p className="text-slate-400 text-xs md:text-sm mt-2 px-4">Cette action est irréversible. Toutes les données du livreur seront effacées.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 pt-2">
              <button 
                onClick={handleDelete} 
                disabled={deleting} 
                className="w-full py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                {deleting ? "Suppression..." : "Confirmer la suppression"}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
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