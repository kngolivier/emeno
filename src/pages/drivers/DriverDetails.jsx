// FILE: src/pages/drivers/DriverDetails

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Phone, Activity, Truck, Package, ShieldOff, Trash2, Mail, Clock } from "lucide-react";
import { fetchDriverById, updateUserStatus, deleteUser } from "../../api/users.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";

export default function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadDriver = async () => {
    try {
      const res = await fetchDriverById(id);
      setDriver(res?.data?.data || res?.data || res);
    } catch (err) {
      notifyError("Impossible de charger le livreur");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadDriver(); }, [id]);

  const handleBlockToggle = async () => {
    try {
      const newStatus = driver.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
      await updateUserStatus(driver._id, newStatus);
      setDriver(prev => ({ ...prev, status: newStatus }));
      notifySuccess("Statut mis à jour");
    } catch (err) { notifyError("Erreur de statut"); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(driver._id);
      notifySuccess("Livreur supprimé");
      navigate("/admin/drivers");
    } catch (err) { notifyError("Erreur de suppression"); }
    finally { setDeleting(false); }
  };

  if (loading) return <PageLoader />;
  if (!driver) return <div className="p-20 text-center font-display italic text-primary">Livreur introuvable</div>;

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all text-primary">
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-primary font-display italic tracking-tighter">
              {driver.nom} {driver.prenom}
            </h1>
            <span className={`inline-block mt-2 px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border 
              ${driver.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-100' : 'bg-primary/10 text-primary border-primary/10'}`}>
              Compte {driver.status}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleBlockToggle} className="px-6 py-4 bg-white border border-slate-100 text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center gap-2">
            <ShieldOff size={16} /> {driver.status === "BLOCKED" ? "Débloquer" : "Bloquer"}
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="px-6 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-200 hover:bg-red-600 transition-all flex items-center gap-2">
            <Trash2 size={16} /> Supprimer
          </button>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-soft space-y-6">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Contact & Localisation</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl">
              <Phone className="text-secondary" size={20} />
              <span className="font-bold text-slate-700">{driver.telephone}</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl">
              <Mail className="text-secondary" size={20} />
              <span className="font-bold text-slate-700 break-all">{driver.email || "Non renseigné"}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Livraisons", val: "0", icon: Truck, col: "bg-blue-500" },
            { label: "Réussies", val: "0", icon: Package, col: "bg-emerald-500" },
            { label: "Score Actu", val: "N/A", icon: Activity, col: "bg-secondary" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-soft flex flex-col items-center text-center space-y-4">
              <div className={`w-14 h-14 ${item.col} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <item.icon size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-display font-black text-3xl text-primary italic">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md p-4">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={32} />
            </div>
            <div>
              <h2 className="font-display font-black text-2xl italic text-primary">Supprimer ?</h2>
              <p className="text-slate-400 text-sm mt-2">Cette action est irréversible. Le compte sera désactivé définitivement.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Annuler</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                {deleting ? "..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}