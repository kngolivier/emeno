// FILE: src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';

// Leaflet & Cartographie
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// APIs & Éléments partagés EMENO
import API from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { fetchAdminStats, fetchComparisonStats } from "../../api/stats.api";
import { fetchAdminDeliveries } from "../../api/deliveries.api";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications"; 

import PageLoader from "../../components/ui/PageLoader";
import StatCard from "../../components/dashboard/StatCard";
import ProgressRow from "../../components/dashboard/ProgressRow";

import {
  Truck, CreditCard, PackageCheck, Activity, AlertTriangle, Bell,
  CheckCircle, ArrowUpRight, Users, Settings, Shield, Star, ShoppingBag, Eye, Navigation,
  Award, Phone, Clock, Store
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";

const fullConfig = resolveConfig(tailwindConfig);
const theme = fullConfig.theme.colors;

// Centrage initial de la flotte (Libreville, Gabon)
const LIBREVILLE_CENTER = [0.4162, 9.4673]; 

// Configuration sémantique des statuts livreurs EMENO
const DRIVER_STATES_MAP = {
  IDLE: { 
    label: "Disponible", 
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", 
    iconColor: "#22c55e",
    pulseClass: "bg-emerald-500"
  },
  BUSY: { 
    label: "En course", 
    color: "text-orange-500 bg-orange-500/10 border-orange-500/20", 
    iconColor: "#f97316",
    pulseClass: "bg-orange-500"
  },
  PAUSE: { 
    label: "En pause", 
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20", 
    iconColor: "#eab308",
    pulseClass: "bg-amber-500"
  },
  OFFLINE: { 
    label: "Déconnecté", 
    color: "text-slate-400 bg-slate-500/10 border-slate-500/10", 
    iconColor: "#94a3b8",
    pulseClass: "bg-slate-400"
  }
};

// Icône de moto personnalisée Leaflet avec effet radar pulsé
const createBikeIcon = (state) => {
  const config = DRIVER_STATES_MAP[state] || { iconColor: "#94a3b8", pulseClass: "bg-slate-400" }; 
  return new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center" style="width: 38px; height: 38px;">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseClass} opacity-25" style="animation-duration: 2s;"></span>
        <div style="
          background-color: ${config.iconColor}; 
          width: 38px; 
          height: 38px; 
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25);
          border: 2.5px solid white;
          position: relative;
          z-index: 10;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/>
            <path d="M5.5 17.5H12l1.5-6H20M16 5l-2.5 4H9"/>
          </svg>
        </div>
      </div>
    `,
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19], 
    popupAnchor: [0, -22]
  });
};

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("TODAY");
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const { user } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications(); 
  const navigate = useNavigate();
  const [comparisonData, setComparisonData] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  const isDark = document.documentElement.classList.contains('dark');

  const COLORS = {
    primary: theme.primary?.DEFAULT || "#0F172A",
    secondary: theme.secondary?.DEFAULT || "#10B981",
    muted: isDark ? "#475569" : "#94A3B8",
    grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
  };
  
  const PIE_PALETTE = [COLORS.secondary, "#818CF8", "#64748b"];

  
  const getLabelForRelativeDate = (index, period) => {
    // const now = new Date();
    
    if (period === 'WEEK') {
      // Crée une date correspondant au jour (index 0 = aujourd'hui)
      const date = new Date();
      date.setDate(date.getDate() - index);
      return date.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase(); // "LUN", "MAR"...
    }
    
    if (period === 'MONTH') {
      return `J-${index + 1}`; // Garde J-1, J-2 pour le mois
    }
    
    if (period === 'YEAR') {
      const date = new Date();
      date.setMonth(date.getMonth() - index);
      return date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(); // "JAN", "FÉV"...
    }
    
    return index;
  };

  const loadComparison = async () => {
    try {
      const res = await fetchComparisonStats(period);
      // Supposons que res soit directement le tableau d'objets
      setComparisonData(res.data || res); 
    } catch (err) {
      console.error("Erreur chargement comparaison", err);
    }
  };
  const loadData = async () => {
    try {
      const [statsRes, deliveriesRes, driversRes] = await Promise.all([
        fetchAdminStats({ period }),
        fetchAdminDeliveries(),
        API.get(ENDPOINTS.DRIVER_MAP_ACTIVE)
      ]);

      setStats(statsRes?.data || statsRes);
      
      if (driversRes?.success) {
        setDrivers(driversRes.data || []);
      }

      const deliveries = deliveriesRes?.data?.data || deliveriesRes?.data || deliveriesRes;
      const sorted = Array.isArray(deliveries) 
        ? [...deliveries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
        : [];
      setRecentDeliveries(sorted);

    } catch (err) {
      console.error("Erreur de synchronisation Dashboard:", err);
    }
  };

  useEffect(() => {
    loadData();
    if (isComparing) loadComparison(); // Recharge la comparaison si elle est active
  }, [period]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [period]);

  useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  }, [unreadCount]);

  if (!stats) return <PageLoader />;

  const deliveryStats = stats?.deliveryBreakdown || {};
  const overview = stats?.overview || {};
  const userStats = stats?.users || {};
  const total = overview.totalDeliveries || 0;
  const revenue = overview.totalRevenue || 0;
  const successRate = overview.successRate || "0%";

  // Utilise ta fonction existante en lui passant les bons paramètres
  const chartData = (deliveryStats.deliveriesOverTime || [])
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((d) => ({
      name: new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase(),
      current: d.total || 0,
      previous: 0 // On met 0 car il n'y a pas de comparaison en mode standard
    }));

  const statusData = [
    { name: "Livrées", value: deliveryStats.completed || 0 },
    { name: "En cours", value: deliveryStats.inProgress || 0 },
    { name: "Annulées", value: deliveryStats.cancelled || 0 }
  ];

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + ' Mds F';
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' M F';
    if (amount >= 1000) return (amount / 1000).toFixed(1) + ' K F';
    return amount.toLocaleString() + ' F';
  };

  return (
    <div className="space-y-8 pb-10 transition-colors duration-300">
      
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.96) !important;
          backdrop-filter: blur(8px);
          border-radius: 16px !important;
          box-shadow: 0 15px 25px -5px rgb(0 0 0 / 0.1) !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 2px;
        }
        .dark .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.96) !important;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.96) !important;
        }
        .dark .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.96) !important;
        }
      `}</style>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
            Tableau de bord <span className="text-secondary">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            {user?.role === 'SUPER_ADMIN' ? 'Pilotage Stratégique EMENO' : 'Gestion des flux opérationnels'}
          </p>
        </div>

        <div className="flex bg-slate-200/50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-md shadow-sm">
          {["TODAY", "WEEK", "MONTH", "YEAR"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                period === p 
                  ? "bg-primary dark:bg-secondary text-white shadow-lg" 
                  : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white"
              }`}
            >
              {p === "TODAY" ? "AUJOURD'HUI" : p === "WEEK" ? "SEMAINE" : p === "MONTH" ? "MOIS" : "ANNÉE"}
            </button>
          ))}
        </div>
        {/* Dans le bloc flex qui contient tes boutons de période
        <button
          onClick={() => {
            if (!isComparing) loadComparison();
            setIsComparing(!isComparing);
          }}
          className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all border ${
            isComparing 
              ? "bg-secondary text-white border-secondary" 
              : "bg-transparent border-slate-300 dark:border-white/10 text-slate-500 hover:border-secondary"
          }`}
        >
          {isComparing ? "DÉSACTIVER COMPARAISON" : "COMPARER (N-1)"}
        </button> */}
      </div>

      {/* KPI GRID AMÉLIORÉ (Intégration de la carte activePartners de l'API) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="En attente" value={deliveryStats.pending || 0} icon={PackageCheck} color="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
        <StatCard title="En cours" value={deliveryStats.inProgress || 0} icon={Activity} color="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
        <StatCard title="Livreurs" value={userStats.activeDrivers || 0} icon={Truck} color="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" to="/admin/drivers" />
        <StatCard title="Clients" value={userStats.activeClients || 0} icon={Users} color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" to="/admin/clients" />
        <StatCard title="Partenaires" value={userStats.activePartners || 0} icon={Store} color="bg-purple-500/10 text-purple-600 dark:text-purple-400" to="/admin/pricing" />
        <StatCard title="Revenus" value={formatCurrency(revenue)} icon={CreditCard} color="bg-primary dark:bg-white/10 text-white" />
        <StatCard title="Succès" value={successRate} icon={CheckCircle} color="bg-emerald-500/20 text-emerald-600 dark:text-emerald-500" />
      </div>

      {/* BLOC SUPÉRIEUR : Graphique + Raccourcis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-white/[0.02] p-8 rounded-[3xl] border border-slate-200 dark:border-white/5 shadow-soft">
          {/* TITRE ET LÉGENDE */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest flex items-center gap-2 italic">
              <Activity size={16} className="text-secondary" /> Courbe des livraisons
            </h3>
            
            {isComparing && (
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest italic">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="w-6 h-1 bg-secondary rounded-full" /> Période actuelle
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-6 h-1 border-t-2 border-dashed border-slate-400" /> Période précédente
                </div>
              </div>
            )}
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={isComparing ? comparisonData : chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: '900', fill: COLORS.muted }} 
                />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: isDark ? '#1e293b' : '#ffffff' }} />
                
                {/* LIGNE ACTUELLE */}
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke={COLORS.secondary} 
                  strokeWidth={4} 
                  connectNulls 
                />
                
                {/* LIGNE PRÉCÉDENTE (Uniquement si isComparing est true) */}
                {isComparing && (
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#94a3b8" 
                    strokeWidth={3} 
                    strokeDasharray="5 5" 
                    connectNulls
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-primary p-8 rounded-[3xl] shadow-2xl shadow-primary/30 text-white flex flex-col relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-secondary/10 blur-3xl rounded-full" />
            <h3 className="font-black uppercase text-[10px] tracking-widest text-secondary mb-2 italic">Raccourcis</h3>
            <p className="text-white/40 text-[10px] mb-8 font-black uppercase italic tracking-widest">Navigation rapide</p>
            <div className="space-y-3 relative z-10">
              <QuickAction label="Livraisons" icon={Truck} onClick={() => navigate("/admin/deliveries")} color={COLORS.secondary} />
              <QuickAction label="Clients" icon={Users} onClick={() => navigate("/admin/clients")} color={COLORS.secondary} />
              <QuickAction label="Livreurs" icon={Users} onClick={() => navigate("/admin/drivers")} color={COLORS.secondary} />
              <QuickAction label="Tarifs" icon={CreditCard} onClick={() => navigate("/admin/pricing")} color={COLORS.secondary} />
              <QuickAction label="Partenaires" icon={Store} onClick={() => navigate("/admin/partners")} color={COLORS.secondary} />
              {user?.role === 'SUPER_ADMIN' && (
                <QuickAction label="Gestion Staff" icon={Shield} onClick={() => navigate("/admin/admins")} color={COLORS.secondary} />
              )}
              <QuickAction label="Paramètres" icon={Settings} onClick={() => navigate("/admin/settings")} color={COLORS.secondary} />
            </div>
          </div>
        </div>

      {/* BLOC MILIEU : ALERTES OPÉRATIONNELLES LIVE */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-[3xl] border-2 border-dashed border-slate-200 dark:border-white/10 shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[rgba(245,158,11,0.1)] text-amber-500 rounded-xl relative">
                <Bell size={18} className="animate-pulse" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest italic">
                  Flux d'alertes en temps réel
                </h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Mouvements critiques & Commandes orphelines</p>
              </div>
            </div>
            <span className="text-[9px] font-black px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl uppercase tracking-widest">
              Live
            </span>
          </div>

          <div className="max-h-[280px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-600">
                <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-[10px] font-black uppercase tracking-widest italic">Aucune alerte critique pour le moment</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isUnassigned = notif._id?.toString().includes("unassigned");
                
                let displayMessage = notif.message;
                let matchedStateBadge = null;

                Object.keys(DRIVER_STATES_MAP).forEach((stateKey) => {
                  if (notif.message && notif.message.includes(`maintenant ${stateKey}`)) {
                    const stateData = DRIVER_STATES_MAP[stateKey];
                    
                    displayMessage = notif.message.replace(
                      `maintenant ${stateKey}`, 
                      `maintenant ${stateData.label.toLowerCase()}`
                    );

                    matchedStateBadge = (
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border tracking-widest shrink-0 ${stateData.color}`}>
                        {stateData.label.toUpperCase()}
                      </span>
                    );
                  }
                });

                return (
                  <div 
                    key={notif._id}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                      isUnassigned 
                        ? "bg-rose-500/5 border-rose-500/20 text-rose-900 dark:text-rose-100" 
                        : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5"
                    }`}
                  >
                    <div className="flex gap-4 min-w-0 flex-1 items-center">
                      <div className={`p-2.5 rounded-xl shrink-0 ${isUnassigned ? "bg-rose-500/10 text-rose-500" : "bg-primary dark:bg-slate-800 text-secondary"}`}>
                        {isUnassigned ? <AlertTriangle size={16} /> : <Bell size={16} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            {notif.title || (isUnassigned ? "ALERTE OPÉRATIONNELLE" : "STATUT LIVREUR")}
                          </p>
                          {matchedStateBadge}
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                          {displayMessage}
                        </p>
                      </div>
                    </div>
                    {notif.deliveryId && (
                      <button 
                        onClick={() => navigate(`/admin/deliveries/${notif.deliveryId}`)}
                        className="ml-4 p-2 bg-white dark:bg-slate-800 hover:bg-secondary dark:hover:bg-secondary hover:text-primary shadow-sm rounded-xl text-slate-400 transition-colors shrink-0 group"
                      >
                        <Eye size={14} className="group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* BLOC CARTOGRAPHIE LIVE & MOUVEMENTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* CARTE MINI SUR LE DASHBOARD */}
        <div className="xl:col-span-2 bg-white dark:bg-white/[0.02] p-6 rounded-[3xl] border border-slate-200 dark:border-white/5 shadow-soft flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest italic flex items-center gap-2">
                <Navigation size={14} className="text-secondary rotate-45" /> Supervision de la flotte en mouvement
              </h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Libreville • Akanda • Owendo</p>
            </div>
            <button 
              onClick={() => navigate("/admin/drivers")} 
              className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline"
            >
              Vue Plein écran
            </button>
          </div>

          <div className="relative h-[380px] w-full rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800/80 z-10">
            <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl z-[1000] shadow-md border border-slate-100 dark:border-slate-800/60 flex gap-4 text-[9px] font-black uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" /> <span className="text-slate-600 dark:text-slate-300">Disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" /> <span className="text-slate-600 dark:text-slate-300">En course</span>
              </div>
            </div>

            <MapContainer 
              center={LIBREVILLE_CENTER} 
              zoom={11} 
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <ChangeView center={LIBREVILLE_CENTER} />
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {drivers.map((item) => {
                if (!item.location?.coordinates) return null;
                
                const position = [item.location.coordinates[1], item.location.coordinates[0]];
                const statusConfig = DRIVER_STATES_MAP[item.driver?.driverState] || { label: item.driver?.driverState, color: "bg-slate-100 text-slate-600" };
                
                return (
                  <Marker 
                    key={item._id} 
                    position={position} 
                    icon={createBikeIcon(item.driver?.driverState)}
                  >
                    <Popup closeButton={false}>
                      <div className="p-1.5 space-y-2.5 min-w-[170px] text-slate-900 dark:text-white">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-black text-xs uppercase italic tracking-tight text-slate-900 dark:text-white">
                              {item.driver?.prenom} {item.driver?.nom}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">Coursier EMENO</p>
                          </div>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        
                        <div className="text-[11px] space-y-1.5 bg-slate-50 dark:bg-white/5 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                          <a href={`tel:${item.driver?.telephone}`} className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 text-[10px]">
                            <Phone size={10} className="text-secondary" /> {item.driver?.telephone || 'N/A'}
                          </a>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[9px]">
                            <Clock size={10} />
                            <span>{new Date(item.lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* DERNIERS MOUVEMENTS RECENTRÉS */}
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-[3xl] border border-slate-200 dark:border-white/5 shadow-soft flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest italic">Derniers mouvements</h3>
            <button onClick={() => navigate("/admin/deliveries")} className="text-[10px] font-black text-secondary uppercase tracking-widest">Voir tout</button>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar flex-1">
            {recentDeliveries.map((d) => (
              <div key={d._id} onClick={() => navigate(`/admin/deliveries/${d._id}`)} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 rounded-2xl cursor-pointer group transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-primary dark:text-slate-300 shadow-sm group-hover:text-secondary transition-colors">
                    <Truck size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 dark:text-white italic uppercase tracking-tighter truncate">{d.pickupContact?.name || "Client"}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ID: {d.orderNumber || "..."}</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-secondary transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 🎯 SECTIONS DE COMPARAISON : CLASSEMENTS LIVREURS, CLIENTS & PARTENAIRES B2B */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* TOP 5 LIVREURS */}
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-[3xl] border border-slate-200 dark:border-white/5 shadow-soft">
          <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest flex items-center gap-2 mb-6 italic">
            <Award size={16} className="text-secondary" /> Top 5 Livreurs
          </h3>
          <div className="space-y-4">
            {(userStats.topDrivers || []).map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100/30 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black ${index === 0 ? 'bg-secondary text-primary' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white'}`}>
                    {index + 1}
                  </span>
                  <p className="text-sm font-black text-slate-900 dark:text-white italic uppercase tracking-tighter truncate max-w-[140px]">{driver.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{driver.deliveries}</span>
                  <p className="text-[9px] text-slate-400 font-black uppercase">Courses</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP 5 CLIENTS  */}
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-[3xl] border border-slate-200 dark:border-white/5 shadow-soft">
          <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest flex items-center gap-2 mb-6 italic">
            <Star size={16} className="text-secondary" /> Top 5 Clients
          </h3>
          <div className="space-y-4">
            {(userStats.topClients || []).map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100/30 dark:border-white/5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-primary dark:text-secondary shadow-sm shrink-0">
                    <ShoppingBag size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white italic uppercase tracking-tighter truncate">{client.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{client.orders} commandes</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-secondary">{(client.totalSpent || 0).toLocaleString()} F</p>
                  <p className="text-[8px] text-slate-400 font-black uppercase italic">Volume</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 NOUVEAU : TOP 5 PARTENAIRES COMMERCIAUX (B2B) */}
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-[3xl] border border-slate-200 dark:border-white/5 shadow-soft">
          <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest flex items-center gap-2 mb-6 italic">
            <Store size={16} className="text-purple-500" /> Top 5 Partenaires B2B
          </h3>
          <div className="space-y-4">
            {(userStats.topPartners || []).map((partner, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-purple-500/10 dark:border-white/5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm shrink-0">
                    <Store size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white italic uppercase tracking-tighter truncate" title={partner.name}>
                      {partner.name || "Partenaire Pro"}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{partner.orders} flux expédiés</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-purple-500">{(partner.totalSpent || 0).toLocaleString()} F</p>
                  <p className="text-[8px] text-slate-400 font-black uppercase italic">CA Généré</p>
                </div>
              </div>
            ))}
            {(userStats.topPartners || []).length === 0 && (
              <div className="py-8 text-center text-slate-300 dark:text-slate-700">
                <Store size={24} className="mx-auto mb-1 opacity-30" />
                <p className="text-[9px] font-black uppercase tracking-wider">Aucun flux B2B enregistré</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* PERFORMANCE GLOBALE (PIE CHART) */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-[3xl] border border-slate-200 dark:border-white/5 shadow-soft">
          <h3 className="font-black text-slate-900 dark:text-white uppercase text-[10px] tracking-widest mb-8 italic text-center">Performance globale</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-4xl mx-auto">
            <div className="w-full md:w-1/3 flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} innerRadius={50} outerRadius={75} paddingAngle={8} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_PALETTE[index % PIE_PALETTE.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000', fontSize: '11px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <ProgressRow label="Livrées" value={deliveryStats.completed} total={total} colorClass="bg-emerald-400" />
              <ProgressRow label="En cours" value={deliveryStats.inProgress} total={total} colorClass="bg-secondary" />
              <ProgressRow label="Annulées" value={deliveryStats.cancelled} total={total} colorClass="bg-slate-300 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function QuickAction({ label, icon: Icon, onClick, color }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
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