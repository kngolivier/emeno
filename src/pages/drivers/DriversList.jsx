// FILE: src/pages/drivers/DriversList.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, Edit, Phone, ShieldCheck, ExternalLink, UserX, 
  Map as MapIcon, List, RefreshCw, Clock, Users, Navigation 
} from "lucide-react";

// Leaflet & Cartographie
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// APIs & Éléments partagés EMENO
import API from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import NewDriverForm from "./NewDriverForm";
import { Pagination } from "../../components/Pagination";
import { fetchDrivers, updateUserStatus, createDriver, updateUser } from "../../api/users.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { notifySuccess, notifyError } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import TotalCard from "../../components/dashboard/TotalCard";

const STATUS_LABELS = {
  ALL: "Tous les livreurs",
  ACTIVE: "Actifs",
  INACTIVE: "Inactifs",
  BLOCKED: "Bloqués",
  DELETED: "Supprimés"
};

// --- CONFIGURATION CARTOGRAPHIE LIBREVILLE ---
const LIBREVILLE_CENTER = [0.4162, 9.4673]; 

const DRIVER_STATUS_CONFIG = {
  IDLE: {
    label: "Disponible",
    color: "#22c55e",
    bgClass: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20",
    pulseClass: "bg-emerald-500"
  },
  BUSY: {
    label: "En course",
    color: "#f97316",
    bgClass: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/20",
    pulseClass: "bg-orange-500"
  },
  PAUSE: {
    label: "En pause",
    color: "#eab308",
    bgClass: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20",
    pulseClass: "bg-amber-500"
  }
};

const createBikeIcon = (state) => {
  const config = DRIVER_STATUS_CONFIG[state] || { color: "#94a3b8", pulseClass: "bg-slate-400" };
  return new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center" style="width: 42px; height: 42px;">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseClass} opacity-25" style="animation-duration: 2s;"></span>
        <div style="
          background-color: ${config.color}; 
          width: 42px; 
          height: 42px; 
          border-radius: 50%; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          border: 3px solid white;
          position: relative;
          z-index: 10;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/>
            <path d="M5.5 17.5H12l1.5-6H20M16 5l-2.5 4H9"/>
          </svg>
        </div>
      </div>
    `,
    className: "",
    iconSize: [42, 42],
    iconAnchor: [21, 21], 
    popupAnchor: [0, -25]
  });
};

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function DriversList() {
  const { data: drivers = [], meta, loading, setPage, setStatus, status, refresh } = usePaginatedFetch(fetchDrivers, 10);
  const [activeTab, setActiveTab] = useState("list"); // "list" ou "map"
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  
  // États dédiés à la cartographie live
  const [mapDrivers, setMapDrivers] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);

  const getStatusStyle = (s) => {
    switch (s) {
      case "ACTIVE": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
      case "INACTIVE": return "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10";
      case "BLOCKED": return "bg-primary/10 dark:bg-rose-500/10 text-primary dark:text-rose-400 border-primary/10 dark:border-rose-500/20";
      case "DELETED": return "bg-black text-white border-black";
      default: return "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/5";
    }
  };

  // Récupération des coordonnées géographiques
  const fetchDriversLocations = async () => {
    if (activeTab !== "map") return;
    setMapLoading(true);
    try {
      const res = await API.get(ENDPOINTS.DRIVER_MAP_ACTIVE);
      if (res?.success) {
        setMapDrivers(res.data || []);
      }
    } catch (error) {
      console.error("Erreur de récupération des positions:", error);
    } finally {
      setMapLoading(false);
    }
  };

  // Déclencher le tracking si l'onglet carte est actif
  useEffect(() => {
    if (activeTab === "map") {
      fetchDriversLocations();
      const interval = setInterval(fetchDriversLocations, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleSave = async (driver) => {
    try {
      if (!driver._id) {
        await createDriver(driver);
        notifySuccess("Livreur enregistré");
      } else {
        await updateUser(driver._id, driver);
        notifySuccess("Informations du livreur mises à jour");
      }
      setShowForm(false);
      setEditingDriver(null);
      refresh();
      if (activeTab === "map") fetchDriversLocations();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const toggleDriverStatus = async (driver) => {
    if (driver.status === "DELETED") return;
    try {
      const newStatus = driver.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateUserStatus(driver._id, newStatus);
      refresh();
      notifySuccess("Statut mis à jour");
    } catch (err) {
      notifyError(err.message);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 font-sans pb-10 transition-colors duration-300">
      
      {/* Styles personnalisés pour injecter l'habillage Leaflet moderne */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(8px);
          border-radius: 20px !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 4px;
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

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-display italic tracking-tighter">
            Livreurs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
            Gestion de la flotte logistique
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* SÉLECTEUR D'ONGLET DESIGN SYSTEM */}
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                activeTab === "list"
                  ? "bg-primary dark:bg-secondary text-white shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white"
              }`}
            >
              <List size={14} /> LISTE
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                activeTab === "map"
                  ? "bg-primary dark:bg-secondary text-white shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white"
              }`}
            >
              <MapIcon size={14} /> MAP LIVE
            </button>
          </div>

          <div className="hidden sm:block">
            <TotalCard title="Actifs" value={meta?.total || 0} subtitle="Livreurs" />
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary dark:bg-secondary text-white hover:opacity-90 transition-all shadow-xl dark:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} />
            Ajouter
          </button>
        </div>
      </div>

      {/* RENDER DU DESIGN SELON L'ONGLET ACTIF */}
      {activeTab === "list" ? (
        <>
          {/* FILTERS */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {["ALL", "ACTIVE", "INACTIVE", "BLOCKED"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                  ${status === s 
                    ? "bg-primary dark:bg-secondary text-white border-primary dark:border-secondary shadow-md" 
                    : "bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"}`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {drivers.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700">
                 <UserX size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display font-black text-xl italic text-slate-900 dark:text-white uppercase tracking-tight">Aucun livreur trouvé</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-[250px] mx-auto mt-2">
                  Il n'y a actuellement aucun livreur correspondant à la catégorie <span className="text-secondary font-bold italic">"{STATUS_LABELS[status]}"</span>.
                </p>
              </div>
              {status !== "ALL" && (
                <button 
                  onClick={() => setStatus("ALL")}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary underline underline-offset-4"
                >
                  Voir tous les livreurs
                </button>
              )}
            </div>
          ) : (
            <>
              {/* --- VUE MOBILE : CARDS --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {drivers.map((d) => (
                  <div key={d._id} className={`bg-white dark:bg-white/[0.03] p-5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm transition-all ${d.status === "DELETED" ? "opacity-40 grayscale" : ""}`}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center font-display font-black text-primary dark:text-secondary italic border border-slate-200 dark:border-white/10 shadow-inner">
                          {d.nom?.charAt(0)}{d.prenom?.charAt(0)}
                        </div>
                        <div>
                          <Link to={`/admin/drivers/${d._id}`} className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-1 hover:text-secondary">
                            {d.nom} {d.prenom}
                            <ExternalLink size={10} />
                          </Link>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(d.status)}`}>
                            {STATUS_LABELS[d.status] || d.status}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => { setEditingDriver(d); setShowForm(true); }} className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-secondary transition-colors">
                        <Edit size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-5">
                      <div className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
                          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                            <Phone size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest">Contact</span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-900 dark:text-slate-200 italic">{d.telephone}</p>
                      </div>
                      <div className="p-3 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
                          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                            <ShieldCheck size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest">ID Verifié</span>
                          </div>
                          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 italic uppercase">Oui</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => toggleDriverStatus(d)}
                      className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border
                        ${d.status === "ACTIVE" 
                          ? "bg-white dark:bg-transparent border-rose-100 dark:border-rose-500/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10" 
                          : "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none"}`}
                    >
                      {d.status === "ACTIVE" ? "Suspendre l'accès" : "Réactiver le compte"}
                    </button>
                  </div>
                ))}
              </div>

              {/* --- VUE DESKTOP : TABLEAU --- */}
              <div className="hidden lg:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                    <tr>
                      <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Identité</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Contact</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Statut</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {drivers.map((d) => (
                      <tr key={d._id} className={`hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group ${d.status === "DELETED" ? "opacity-30" : ""}`}>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center font-display font-black text-primary dark:text-secondary italic border border-slate-200 dark:border-white/10 shadow-inner group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                              {d.nom?.charAt(0)}{d.prenom?.charAt(0)}
                            </div>
                            <div>
                              <Link to={`/admin/drivers/${d._id}`} className="font-display font-black text-slate-900 dark:text-white italic text-lg tracking-tighter hover:text-secondary transition-colors leading-none uppercase">
                                {d.nom} {d.prenom}
                              </Link>
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1 tracking-tighter">Membre depuis {new Date(d.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-white/10">
                            {d.telephone}
                          </span>
                        </td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(d.status)}`}>
                            {STATUS_LABELS[d.status] || d.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button 
                              onClick={() => { setEditingDriver(d); setShowForm(true); }} 
                              className="p-2.5 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => toggleDriverStatus(d)} 
                              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all 
                                ${d.status === "ACTIVE" 
                                  ? "border-rose-100 dark:border-rose-500/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10" 
                                  : "border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"}`}
                            >
                              {d.status === "ACTIVE" ? "Suspendre" : "Activer"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination meta={meta} setPage={setPage} />
            </>
          )}
        </>
      ) : (
        /* --- INTEGRATION CARTOGRAPHIE EN TEMPS RÉEL (COCKPIT FLOTTE) --- */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 italic">
                <Navigation className="text-secondary rotate-45" size={20} /> Supervision Active
              </h2>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Libreville • Akanda • Owendo — Statut live rafraîchi automatiquement
              </p>
            </div>
            
            <button
              onClick={fetchDriversLocations}
              disabled={mapLoading}
              className="px-6 py-3 bg-slate-900 dark:bg-white/5 hover:bg-slate-800 dark:hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all border border-transparent disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${mapLoading ? "animate-spin text-secondary" : "text-secondary"}`} />
              {mapLoading ? "Mise à jour..." : "Forcer l'actualisation"}
            </button>
          </div>

          <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 z-10">
            
            {/* COMPTEUR DE FLOTTE FLOTTANT */}
            <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl z-[1000] shadow-xl border border-slate-100 dark:border-slate-800/60 hidden md:flex items-center gap-4">
              <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-secondary">
                <Users size={18} />
              </div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Livreurs connectés : <span className="text-slate-900 dark:text-white text-sm font-black">{mapDrivers.length}</span>
              </div>
            </div>

            {/* LÉGENDE FLOTTANTE (Bas Gauche) */}
            <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-[2rem] z-[1000] shadow-xl border border-slate-100 dark:border-slate-800/60 space-y-2.5 min-w-[170px]">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-white/5 pb-1.5 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-secondary" /> Légende flotte
              </p>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
                  <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-tight text-[11px]">Disponible</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md text-slate-500">{mapDrivers.filter(d => d.driver?.driverState === "IDLE").length}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] animate-pulse" />
                  <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-tight text-[11px]">En Course</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md text-slate-500">{mapDrivers.filter(d => d.driver?.driverState === "BUSY").length}</span>
              </div>
            </div>

            <MapContainer 
              center={LIBREVILLE_CENTER} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <ChangeView center={LIBREVILLE_CENTER} />
              
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />

              {mapDrivers.map((item) => {
                if (!item.location?.coordinates) return null;
                
                const position = [item.location.coordinates[1], item.location.coordinates[0]];
                const statusConfig = DRIVER_STATUS_CONFIG[item.driver?.driverState] || { label: item.driver?.driverState, bgClass: "bg-slate-100 text-slate-600" };
                
                return (
                  <Marker 
                    key={item._id} 
                    position={position} 
                    icon={createBikeIcon(item.driver?.driverState)}
                  >
                    <Popup closeButton={false}>
                      <div className="p-2 space-y-3 min-w-[200px] text-slate-900 dark:text-white">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-xs font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                              {item.driver?.prenom} {item.driver?.nom}
                            </h4>
                            <p className="text-[9px] font-bold text-slate-400 mt-0.5">Coursier Certifié EMENO</p>
                          </div>
                          <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md border shrink-0 ${statusConfig.bgClass}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        
                        <div className="text-[11px] space-y-2 bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-100 dark:border-white/5 font-medium">
                          <a href={`tel:${item.driver?.telephone}`} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-secondary transition-colors">
                            <Phone size={12} className="text-secondary" /> 
                            <span className="font-bold text-[10px] tracking-wider">{item.driver?.telephone || 'Non renseigné'}</span>
                          </a>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                            <Clock size={12} />
                            <span>Dernier ping : {new Date(item.lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <Link to={`/admin/drivers/${item.driver?._id || item._id}`} className="block text-center text-[10px] font-black uppercase tracking-wider text-white bg-primary py-2 rounded-xl hover:opacity-90">
                          Consulter la fiche profil
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      )}

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 dark:bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl transform animate-in slide-in-from-bottom-8 duration-500">
            <NewDriverForm 
              driver={editingDriver} 
              onSave={handleSave} 
              onCancel={() => { setShowForm(false); setEditingDriver(null); }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}