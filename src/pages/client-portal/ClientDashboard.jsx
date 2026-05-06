// FILE: src/pages/client-portal/ClientDashboard.jsx
import { useEffect, useState } from "react";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import { useNavigate } from "react-router-dom";
import {
  Package, Truck, CheckCircle, XCircle, Plus, Clock, ChevronRight, LayoutDashboard
} from "lucide-react";

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchClientDeliveries({ page: 1, limit: 10 });
      setDeliveries(res.data.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === "PENDING").length,
    inProgress: deliveries.filter(d => ["ASSIGNED", "PICKED_UP", "IN_PROGRESS"].includes(d.status)).length,
    delivered: deliveries.filter(d => d.status === "DELIVERED").length,
    cancelled: deliveries.filter(d => d.status === "CANCELLED").length
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-600 border-amber-100";
      case "ASSIGNED":
      case "PICKED_UP":
      case "IN_PROGRESS": return "bg-primary/10 text-primary border-primary/20";
      case "DELIVERED": return "bg-success/10 text-success border-success/20";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <LayoutDashboard size={20} />
            <span className="text-xs font-black uppercase tracking-widest opacity-70">Aperçu</span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Tableau de bord</h1>
        </div>
        <button onClick={() => navigate("/client/new-order")} className="flex items-center gap-3 bg-secondary text-white px-6 py-3.5 rounded-2xl font-bold hover:shadow-lg active:scale-95 transition-all">
          <Plus size={20} strokeWidth={3} /> Nouvelle commande
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={<Package size={22} />} label="Total" value={stats.total} color="primary" />
        <StatCard icon={<Clock size={22} />} label="En attente" value={stats.pending} color="secondary" />
        <StatCard icon={<Truck size={22} />} label="En cours" value={stats.inProgress} color="primary" />
        <StatCard icon={<CheckCircle size={22} />} label="Livrées" value={stats.delivered} color="success" />
        <StatCard icon={<XCircle size={22} />} label="Annulées" value={stats.cancelled} color="red-500" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-black text-primary uppercase tracking-tighter text-lg">Dernières commandes</h2>
        </div>
        <div className="p-2">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Chargement...</div>
          ) : deliveries.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">Aucune commande</div>
          ) : (
            <div className="space-y-3 p-3"> {/* Augmentation de l'espacement entre les cartes */}
            {deliveries.slice(0, 5).map((d) => (
              <div 
                key={d._id} 
                onClick={() => navigate(`/client/orders/${d._id}`)} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white border border-slate-50 sm:border-none rounded-[2rem] sm:rounded-3xl transition-all hover:bg-slate-50 cursor-pointer gap-4 shadow-sm sm:shadow-none"
              >
                <div className="flex items-center gap-4">
                  {/* Icône masquée sur très petits écrans pour gagner de la place */}
                  <div className="hidden xs:flex w-12 h-12 rounded-2xl bg-slate-50 text-primary items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                    <Package size={20} />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-primary italic leading-none text-base">#{d.orderNumber}</p>
                      {/* Badge déplacé ici sur mobile pour l'équilibre visuel */}
                      <span className={`sm:hidden text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${getStatusStyle(d.status)}`}>
                        {d.status}
                      </span>
                    </div>
                    
                    {/* Adresses sur deux lignes sur mobile pour éviter l'étroitement */}
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                        De: {d.pickupLocation}
                      </p>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter truncate">
                        À: {d.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-none pt-3 sm:pt-0">
                  <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                    <Clock size={12} /> {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`hidden sm:block text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${getStatusStyle(d.status)}`}>
                    {d.status}
                  </span>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = { primary: "text-primary bg-primary/5", secondary: "text-secondary bg-secondary/5", success: "text-success bg-success/5", "red-500": "text-red-500 bg-red-50" };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-2xl font-black text-primary leading-none">{value}</p>
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}