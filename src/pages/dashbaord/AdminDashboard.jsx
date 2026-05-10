// FILE: src/pages/dashboard/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Utilitaire pour extraire la config Tailwind en temps réel
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';

import { fetchAdminStats } from "../../api/stats.api";
import { fetchAdminDeliveries } from "../../api/deliveries.api";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "../../components/ui/PageLoader";
import StatCard from "../../components/dashboard/StatCard";
import ProgressRow from "../../components/dashboard/ProgressRow";

import {
  Truck, CreditCard, PackageCheck, Activity,
  CheckCircle, ArrowUpRight, Users, Settings, Shield, Star, Award, ShoppingBag
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";

// Résolution de la configuration pour accès JS
const fullConfig = resolveConfig(tailwindConfig);
const theme = fullConfig.theme.colors;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("TODAY");
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const COLORS = {
    primary: theme.primary?.DEFAULT || theme.primary || "#000",
    secondary: theme.secondary?.DEFAULT || theme.secondary || "#ccc",
    danger: theme.danger || "#ef4444",
    success: theme.success || "#10b981",
    muted: theme.muted || "#64748b"
  };
  
  const PIE_PALETTE = [COLORS.secondary, "#818CF8", COLORS.muted];

  const loadData = async () => {
    try {
      const [statsRes, deliveriesRes] = await Promise.all([
        fetchAdminStats({ period }),
        fetchAdminDeliveries()
      ]);
      
      setStats(statsRes?.data || statsRes);
      
      const deliveries = deliveriesRes?.data?.data || deliveriesRes?.data || deliveriesRes;
      const sorted = Array.isArray(deliveries) 
        ? [...deliveries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
        : [];
      setRecentDeliveries(sorted);
    } catch (err) {
      console.error("Erreur Dashboard:", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [period]);

  if (!stats) return <PageLoader />;

  /** 
   * MAPPING DES DONNÉES (Format API : overview, deliveryBreakdown, users)
   */
  const deliveryStats = stats?.deliveryBreakdown || {};
  const overview = stats?.overview || {};
  const userStats = stats?.users || {};
  
  const total = overview.totalDeliveries || 0;
  const revenue = overview.totalRevenue || 0;
  const successRate = overview.successRate || "0%";

  // Calcul du compte Admin pour le Super Admin
  const adminsCount = userStats.roles?.reduce((acc, curr) => {
    if (curr._id === 'ADMIN' || curr._id === 'SUPER_ADMIN') return acc + curr.count;
    return acc;
  }, 0) || 0;

  const chartData = (deliveryStats.deliveriesOverTime || []).map(d => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  }));

  const statusData = [
    { name: "Livrées", value: deliveryStats.completed || 0 },
    { name: "En cours", value: deliveryStats.inProgress || 0 },
    { name: "Annulées", value: deliveryStats.cancelled || 0 }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary italic uppercase tracking-tighter">
            Dashboard <span className="text-secondary">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</span>
          </h1>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            {user?.role === 'SUPER_ADMIN' ? 'Pilotage Stratégique EMENO' : 'Gestion des flux opérationnels'}
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-soft">
          {["TODAY", "WEEK", "MONTH"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                period === p 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-primary hover:text-primary"
              }`}
            >
              {p === "TODAY" ? "AUJOURD'HUI" : p === "WEEK" ? "SEMAINE" : "MOIS"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="En attente" value={deliveryStats.pending || 0} icon={PackageCheck} color="bg-amber-50 text-amber-500" />
        <StatCard title="En cours" value={deliveryStats.inProgress || 0} icon={Activity} color="bg-blue-50 text-blue-500" />
        <StatCard title="Livreurs Actifs" value={userStats.activeDrivers || 0} icon={Truck} color="bg-indigo-50 text-indigo-500" />
        <StatCard title="Clients Actifs" value={userStats.activeClients || 0} icon={Users} color="bg-emerald-50 text-emerald-500" />
        <StatCard title="Revenus" value={`${revenue.toLocaleString()} F`} icon={CreditCard} color="bg-primary text-white" />
        <StatCard title="Succès" value={successRate} icon={CheckCircle} color="bg-emerald-50 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRAPHIQUE D'ACTIVITÉ */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3xl] border border-slate-50 shadow-soft">
          <h3 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2 mb-8 italic">
            <Activity size={16} className="text-secondary" /> Courbe des livraisons
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" />
                <XAxis 
                  dataKey="formattedDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: '900', fill: COLORS.muted }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke={COLORS.secondary} 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: COLORS.secondary, strokeWidth: 2, stroke: '#c9181800' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTIONS RAPIDES */}
        <div className="bg-primary p-8 rounded-[3xl] shadow-2xl shadow-primary/30 text-white flex flex-col relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
          
          <h3 className="font-black uppercase text-[10px] tracking-widest text-secondary mb-2 italic">Raccourcis</h3>
          <p className="text-white/40 text-[10px] mb-8 font-black uppercase italic tracking-widest">Navigation rapide</p>
          
          <div className="space-y-3 relative z-10">
            <QuickAction label="Livraisons" icon={Truck} onClick={() => navigate("/admin/deliveries")} color={COLORS.secondary} />
            <QuickAction label="Livreurs" icon={Users} onClick={() => navigate("/admin/drivers")} color={COLORS.secondary} />
            <QuickAction label="Tarifs" icon={CreditCard} onClick={() => navigate("/admin/pricing")} color={COLORS.secondary} />
            {user?.role === 'SUPER_ADMIN' && (
              <QuickAction label="Gestion Staff" icon={Shield} onClick={() => navigate("/admin/admins")} color={COLORS.secondary} />
            )}
            <QuickAction label="Paramètres" icon={Settings} onClick={() => navigate("/admin/settings")} color={COLORS.secondary} />
          </div>
        </div>

      </div>

      {/* CLASSEMENTS TOP 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TOP LIVREURS */}
        <div className="bg-white p-8 rounded-[3xl] border border-slate-50 shadow-soft">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2 italic">
              <Award size={16} className="text-secondary" /> Top 5 Livreurs
            </h3>
            <span className="text-[10px] text-muted font-black uppercase tracking-widest">Succès</span>
          </div>
          <div className="space-y-4">
            {(userStats.topDrivers || []).map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black ${index === 0 ? 'bg-secondary text-primary' : 'bg-primary text-white'}`}>
                    {index + 1}
                  </span>
                  <p className="text-sm font-black text-primary italic uppercase tracking-tighter">{driver.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-primary">{driver.deliveries}</span>
                  <p className="text-[10px] text-muted font-bold uppercase">Courses</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP CLIENTS */}
        <div className="bg-white p-8 rounded-[3xl] border border-slate-50 shadow-soft">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2 italic">
              <Star size={16} className="text-secondary" /> Top 5 Clients
            </h3>
            <span className="text-[10px] text-muted font-black uppercase tracking-widest">Fidélité</span>
          </div>
          <div className="space-y-4">
            {(userStats.topClients || []).map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary italic uppercase tracking-tighter">{client.name}</p>
                    <p className="text-[10px] text-muted font-bold uppercase">{client.orders} commandes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-secondary">{client.totalSpent?.toLocaleString()} F</p>
                  <p className="text-[10px] text-muted font-bold uppercase italic">Volume</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FLUX TEMPS RÉEL */}
        <div className="bg-white p-8 rounded-[3xl] border border-slate-50 shadow-soft">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-primary uppercase text-[10px] tracking-widest italic">Derniers mouvements</h3>
            <button onClick={() => navigate("/admin/deliveries")} className="text-[10px] font-black text-secondary uppercase tracking-widest">Voir tout</button>
          </div>
          <div className="space-y-3">
            {recentDeliveries.map((d) => (
              <div key={d._id} onClick={() => navigate(`/admin/deliveries/${d._id}`)} className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white hover:shadow-card rounded-2xl cursor-pointer group transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:text-secondary transition-colors">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary italic uppercase tracking-tighter">{d.pickupContact?.name || "Client"}</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider">ID: {d.orderNumber || "..."}</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-secondary transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* RÉPARTITION STATUTS */}
        <div className="bg-white p-8 rounded-[3xl] border border-slate-50 shadow-soft">
          <h3 className="font-black text-primary uppercase text-[10px] tracking-widest mb-8 italic text-center">Performance globale</h3>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_PALETTE[index % PIE_PALETTE.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', fontSize: '11px', fontWeight: 'bold' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <ProgressRow label="Livrées" value={deliveryStats.completed} total={total} colorClass="bg-emerald-400" />
              <ProgressRow label="En cours" value={deliveryStats.inProgress} total={total} colorClass="bg-secondary" />
              <ProgressRow label="Annulées" value={deliveryStats.cancelled} total={total} colorClass="bg-slate-200" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function QuickAction({ label, icon: Icon, onClick, color }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
            <Icon size={18} style={{ color: color }} className="group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <ArrowUpRight size={14} className="text-white/20 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
    </button>
  );
}