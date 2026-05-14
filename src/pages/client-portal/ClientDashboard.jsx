// src/pages/client-portal/ClientDashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Configuration & API
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';
import { fetchMyStats } from "../../api/stats.api";
import { fetchClientDeliveries } from "../../api/deliveries.api"; 
import { useAuth } from "../../context/AuthContext";

// UI Components
import PageLoader from "../../components/ui/PageLoader";
import StatCard from "../../components/dashboard/StatCard";

import { 
  Package, CheckCircle, Plus, TrendingUp, CreditCard, 
  ArrowUpRight, MessageSquare, HelpCircle, Truck
} from "lucide-react";
import { STATUS_LABELS } from "../../constants/constants.js"

const fullConfig = resolveConfig(tailwindConfig);
const theme = fullConfig.theme.colors;

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("MONTH");
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const COLORS = {
    primary: theme.primary?.DEFAULT || "#000",
    secondary: theme.secondary?.DEFAULT || "#fcb045",
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, deliveriesRes] = await Promise.all([
        fetchMyStats(period),
        fetchClientDeliveries() 
      ]);
      
      setStats(statsRes?.data || statsRes);
      const deliveries = deliveriesRes?.data?.data || deliveriesRes?.data || [];
      setRecentOrders(Array.isArray(deliveries) ? deliveries.slice(0, 5) : []);
      
    } catch (err) {
      console.error("Erreur chargement données client:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [period]);

  if (loading || !stats) return <PageLoader />;

  const totalSpent = stats.totalSpent || 0;
  const totalOrders = stats.totalOrders || 0;
  const completedOrders = stats.completedOrders || 0;
  const successRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  return (
    <div className="p-4 md:p-6 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-primary dark:text-white italic tracking-tighter uppercase">
            Bonjour, <span className="text-secondary">{user?.prenom || 'Client'}</span>
          </h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
            Suivi de vos activités EMENO
          </p>
        </div>

        {/* Sélecteur de période adapté Dark Mode */}
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft transition-colors">
          {["WEEK", "MONTH", "YEAR"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                period === p 
                  ? "bg-primary dark:bg-secondary text-white dark:text-primary shadow-lg shadow-primary/20 dark:shadow-none" 
                  : "text-primary dark:text-slate-400 hover:text-secondary"
              }`}
            >
              {p === "WEEK" ? "SEMAINE" : p === "MONTH" ? "MOIS" : "ANNÉE"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI GRID - Utilisation de couleurs contrastées en Dark Mode */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Dépenses" value={`${totalSpent.toLocaleString()} F`} icon={CreditCard} color="bg-primary dark:bg-slate-800 text-white" />
        <StatCard title="Commandes" value={totalOrders} icon={Package} color="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" />
        <StatCard title="Livrées" value={completedOrders} icon={CheckCircle} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" />
        <StatCard title="Taux de succès" value={`${successRate}%`} icon={TrendingUp} color="bg-secondary/10 dark:bg-secondary/5 text-secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* DERNIÈRES EXPÉDITIONS */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-soft">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-primary dark:text-white uppercase text-[10px] tracking-widest italic">Dernières expéditions</h3>
            <button onClick={() => navigate("/client/orders")} className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline">Voir tout</button>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div 
                key={order._id} 
                onClick={() => navigate(`/client/orders/${order._id}`)}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-card rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-primary dark:text-white shadow-sm group-hover:text-secondary transition-colors">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary dark:text-white italic uppercase tracking-tighter">
                      {order.receiverContact?.name || order.receiverName || "Destinataire"}
                    </p>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {STATUS_LABELS[order.status]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-primary dark:text-white">{order.price?.toLocaleString()} F</p>
                  <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-600 ml-auto group-hover:text-secondary transition-all" />
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <Package className="mx-auto text-slate-200 dark:text-slate-800 mb-2" size={32} />
                <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">Aucune commande récente</p>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS & SUPPORT */}
        <div className="space-y-6">
          <div className="bg-primary dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 dark:shadow-none text-white border border-transparent dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
            <h3 className="font-black uppercase text-[10px] tracking-widest text-secondary mb-8 italic">Actions Rapides</h3>
            <div className="space-y-3 relative z-10">
              <QuickAction label="Nouvelle Commande" icon={Plus} onClick={() => navigate("/client/new-order")} color={COLORS.secondary} />
            </div>
          </div>
          
          <div className="bg-secondary p-8 rounded-[2.5rem] text-primary">
             <div className="flex items-center gap-3 mb-4">
                <HelpCircle size={20} className="font-black" />
                <h3 className="font-black uppercase text-[10px] tracking-widest italic text-primary">Aide</h3>
             </div>
             <p className="text-[11px] font-black leading-relaxed uppercase opacity-80 text-primary">
               Besoin d'assistance pour un colis ? Contactez-nous directement sur WhatsApp.
             </p>
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
      className="w-full flex items-center justify-between p-4 bg-white/5 dark:bg-white/[0.03] hover:bg-white/10 rounded-2xl transition-all border border-white/5 group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
            <Icon size={18} style={{ color: color }} className="group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <ArrowUpRight size={14} className="text-white/20 group-hover:text-secondary transition-all" />
    </button>
  );
}