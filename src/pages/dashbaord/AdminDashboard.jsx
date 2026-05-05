// FILE: src/pages/dashboard/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';

import { fetchAdminStats } from "../../api/stats.api";
import { fetchAdminDeliveries } from "../../api/deliveries.api";
import PageLoader from "../../components/ui/PageLoader";
import StatCard from "../../components/dashbord/StatCard";
import ProgressRow from "../../components/dashbord/ProgressRow";

import {
  Truck, CreditCard, PackageCheck, Activity,
  CheckCircle, AlertCircle, ArrowUpRight, Users, Settings
} from "lucide-react";

import {
  LineChart, Line, XAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const fullConfig = resolveConfig(tailwindConfig);
const themeColors = fullConfig.theme.colors;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("TODAY");
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const navigate = useNavigate();

  const PRIMARY_COLOR = themeColors.primary?.DEFAULT || themeColors.primary;
  const SECONDARY_COLOR = themeColors.secondary?.DEFAULT || themeColors.secondary;
  const DANGER_COLOR = themeColors.danger?.DEFAULT || themeColors.danger || "#ef4444";
  
  const PIE_COLORS = [SECONDARY_COLOR, "#3b82f6", DANGER_COLOR];

  const loadData = async () => {
    try {
      const [statsRes, deliveriesRes] = await Promise.all([
        fetchAdminStats({ period }),
        fetchAdminDeliveries()
      ]);
      setStats(statsRes?.data || statsRes);
      const deliveries = deliveriesRes?.data?.data || deliveriesRes?.data || deliveriesRes;
      const sorted = [...deliveries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      setRecentDeliveries(sorted);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [period]);

  if (!stats) return <PageLoader />;

  const deliveryStats = stats?.deliveries || {};
  const userStats = stats?.users || {};
  const total = deliveryStats.total || 0;
  const successRate = total ? Math.round((deliveryStats.livree / total) * 100) : 0;

  const statusData = [
    { name: "Livrées", value: deliveryStats.livree || 0 },
    { name: "En cours", value: deliveryStats.enCours || 0 },
    { name: "Annulées", value: deliveryStats.annulee || 0 }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary italic uppercase tracking-tighter">
            Dashboard <span className="text-secondary">Admin</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Pilotage EMENO System</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          {["TODAY", "WEEK", "MONTH"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                period === p ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-primary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="En attente" value={deliveryStats.enAttente} icon={PackageCheck} color="bg-amber-50 text-amber-500" />
        <StatCard title="En cours" value={deliveryStats.enCours} icon={Activity} color="bg-cyan-50 text-secondary" />
        <StatCard title="Livreurs" value={userStats.driversActive} icon={Truck} color="bg-indigo-50 text-indigo-500" />
        <StatCard title="Revenus" value={`${stats?.revenue || 0} F`} icon={CreditCard} color="bg-primary text-white" />
        <StatCard title="Succès" value={`${successRate}%`} icon={CheckCircle} color="bg-emerald-50 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LINE CHART: ACTIVITÉ */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-soft">
          <h3 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2 mb-8">
            <Activity size={16} className="text-secondary" /> Flux d'activité
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.deliveriesOverTime || []}>
              <XAxis dataKey="date" hide />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke={SECONDARY_COLOR} 
                strokeWidth={4} 
                dot={{ r: 4, fill: SECONDARY_COLOR, strokeWidth: 2, stroke: '#fff' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ACTIONS RAPIDES (Redirection des flux) */}
        <div className="bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 text-white flex flex-col">
          <h3 className="font-black uppercase text-[10px] tracking-widest text-secondary mb-2 italic">Gestion des flux</h3>
          <p className="text-white/40 text-xs mb-8 font-medium italic">Accès direct aux modules clés</p>
          
          <div className="space-y-3 mt-auto">
            <QuickAction label="Livraisons" icon={Truck} onClick={() => navigate("/admin/deliveries")} />
            <QuickAction label="Livreurs" icon={Users} onClick={() => navigate("/admin/drivers")} />
            <QuickAction label="Tarifications" icon={CreditCard} onClick={() => navigate("/admin/pricing")} />
            <QuickAction label="Configuration" icon={Settings} onClick={() => navigate("/admin/settings")} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LIVRAISONS RÉCENTES */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-primary uppercase text-[10px] tracking-widest italic">Derniers mouvements</h3>
            <button onClick={() => navigate("/admin/deliveries")} className="text-[9px] font-black text-secondary underline uppercase tracking-widest">Voir tout</button>
          </div>
          <div className="space-y-3">
            {recentDeliveries.map((d) => (
              <div key={d._id} onClick={() => navigate(`/admin/deliveries/${d._id}`)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 cursor-pointer group transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:text-secondary transition-colors">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary italic uppercase tracking-tighter">{d.pickupContact?.name || "Client"}</p>
                    <p className="text-[10px] text-slate-400 font-bold">#{d.orderNumber || "EM-000"}</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-secondary transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* RÉPARTITION (PieChart) & PERFORMANCE */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-soft">
          <h3 className="font-black text-primary uppercase text-[10px] tracking-widest mb-6 italic text-center">Répartition & Alertes</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <ProgressRow label="Livrées" value={deliveryStats.livree} total={total} colorClass="bg-secondary" />
              <ProgressRow label="Annulées" value={deliveryStats.annulee} total={total} colorClass="bg-red-400" />
            </div>
          </div>
          
          {deliveryStats.annulee > 5 && (
            <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100">
              <AlertCircle size={14} /> Attention : Taux d'annulation anormal
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Sous-composant pour les actions rapides
function QuickAction({ label, icon: Icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group"
    >
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-secondary group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <ArrowUpRight size={14} className="text-white/20 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
    </button>
  );
}