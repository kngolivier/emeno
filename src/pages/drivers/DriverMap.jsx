import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "../../api/apiClient"; 
import { ENDPOINTS } from "../../api/endpoints"; 
import { Loader2, RefreshCw, Navigation, Phone, Clock, ShieldCheck, Users } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- CENTRAGE INITIAL SUR LIBREVILLE / GABON ---
const LIBREVILLE_CENTER = [0.4162, 9.4673]; 

// --- DICTIONNAIRE DES STATUTS EMENO ---
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

// --- CRÉATION DES ICÔNES AVEC ANIMATION PULSE LIVE ---
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

export default function DriverMap() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stats dynamiques de la flotte
  const totalDrivers = drivers.length;
  const idleCount = drivers.filter(d => d.driver?.driverState === "IDLE").length;
  const busyCount = drivers.filter(d => d.driver?.driverState === "BUSY").length;

  const fetchDriversLocations = async (showPulse = false) => {
    if (showPulse) setIsRefreshing(true);
    try {
      const res = await axios.get(ENDPOINTS.DRIVER_MAP_ACTIVE);
      if (res?.success) {
        setDrivers(res.data || []);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des positions des livreurs", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDriversLocations();

    const interval = setInterval(() => {
      fetchDriversLocations(true); 
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-[650px] w-full bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] flex items-center justify-center border border-slate-100 dark:border-slate-800">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin text-secondary mx-auto" size={40} />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Cartographie EMENO en cours d'initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Injection de styles personnalisés pour écraser l'habillage Leaflet générique */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 20px !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 4px;
        }
        .dark .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95) !important;
        }
        .dark .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.95) !important;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          padding: 8px !important;
          font-size: 14px !important;
        }
      `}</style>

      {/* --- BANDEAU DE CONTRÔLE --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 italic">
            <Navigation className="text-secondary rotate-45" size={22} /> Supervision des Flottes
          </h1>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
            Libreville • Akanda • Owendo — Statut live rafraîchi toutes les 30s
          </p>
        </div>
        
        <button
          onClick={() => fetchDriversLocations(true)}
          disabled={isRefreshing}
          className="px-6 py-3 bg-slate-900 dark:bg-white/5 hover:bg-slate-800 dark:hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all border border-transparent disabled:opacity-50 shadow-md shadow-slate-900/10"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-secondary" : "text-secondary"}`} />
          {isRefreshing ? "Calcul des flux..." : "Actualiser la carte"}
        </button>
      </div>

      {/* --- CONTAINER DE LA CARTE --- */}
      <div className="relative h-[650px] w-full rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 z-10">
        
        {/* COMPTEUR DE FLOTTE FLOTTANT (Haut Gauche) */}
        <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl z-[1000] shadow-xl border border-slate-100 dark:border-slate-800/60 hidden md:flex items-center gap-4">
          <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-secondary">
            <Users size={18} />
          </div>
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
            En ligne : <span className="text-slate-900 dark:text-white text-sm font-black">{totalDrivers}</span> livreurs
          </div>
        </div>

        {/* LÉGENDE DU COCKPIT (Bas Gauche) */}
        <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-[2rem] z-[1000] shadow-xl border border-slate-100 dark:border-slate-800/60 space-y-2.5 min-w-[170px]">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-white/5 pb-1.5 flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-secondary" /> Légende flotte
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-sm animate-pulse" />
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-tight text-[11px]">Disponible</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md text-slate-500">{idleCount}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-sm animate-pulse" />
              <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-tight text-[11px]">En Course</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md text-slate-500">{busyCount}</span>
          </div>
        </div>

        <MapContainer 
          center={LIBREVILLE_CENTER} 
          zoom={12} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <ChangeView center={LIBREVILLE_CENTER} />
          
          {/* Fond de plan moderne et épuré Voyager */}
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {drivers.map((item) => {
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
                    {/* Header Profil */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-xs font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                          {item.driver?.prenom} {item.driver?.nom}
                        </h4>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">Livreur Certifié EMENO</p>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md border shrink-0 ${statusConfig.bgClass}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    
                    {/* Fiche technique de contact */}
                    <div className="text-[11px] space-y-2 bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-100 dark:border-white/5 font-medium">
                      <a 
                        href={`tel:${item.driver?.telephone}`}
                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-secondary dark:hover:text-secondary transition-colors"
                      >
                        <Phone size={12} className="text-secondary" /> 
                        <span className="font-bold text-[10px] tracking-wider">{item.driver?.telephone || 'Non renseigné'}</span>
                      </a>
                      
                      <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                        <Clock size={12} />
                        <span>Ping : {new Date(item.lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
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
  );
}