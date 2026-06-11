// FILE: src/pages/drivers/DriverMap.jsx

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import driverApi from "../../api/driver.api";
import { Loader2, RefreshCw, Navigation, Phone, Clock, ShieldCheck, Users } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- CONFIGURATION ---
const LIBREVILLE_CENTER = [0.4162, 9.4673]; 

const DRIVER_STATUS_CONFIG = {
  IDLE: { label: "Disponible", color: "#22c55e", bgClass: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20 dark:text-emerald-400", pulseClass: "bg-emerald-500", hasPing: true },
  BUSY: { label: "En course", color: "#f97316", bgClass: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/20 dark:text-orange-400", pulseClass: "bg-orange-500", hasPing: true },
  PAUSE: { label: "En pause", color: "#eab308", bgClass: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20 dark:text-amber-400", pulseClass: "bg-amber-500", hasPing: true },
  OFFLINE: { label: "Inactif", color: "#64748b", bgClass: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-500/20 dark:text-slate-400", pulseClass: "bg-transparent", hasPing: false }
};

const createBikeIcon = (state) => {
  const config = DRIVER_STATUS_CONFIG[state] || DRIVER_STATUS_CONFIG.OFFLINE;
  return new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center" style="width: 44px; height: 44px;">
        ${config.hasPing ? `<span class="animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseClass} opacity-20"></span>` : ''}
        <div style="background-color: ${config.color}; width: 38px; height: 38px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 20px -3px rgba(0,0,0,0.25); border: 3px solid white; z-index: 10;" class="hover:scale-110 dark:border-slate-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M5.5 17.5H12l1.5-6H20M16 5l-2.5 4H9"/>
          </svg>
        </div>
      </div>
    `,
    className: "", iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -22]
  });
};

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

export default function DriverMap() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- CALCULS DES STATUTS ---
  const totalDrivers = drivers.length;
  const idleCount = drivers.filter(d => d.driver?.driverState === "IDLE").length;
  const busyCount = drivers.filter(d => d.driver?.driverState === "BUSY").length;
  const pauseCount = drivers.filter(d => d.driver?.driverState === "PAUSE").length;
  // const offlineCount = Math.max(0, totalDrivers - (idleCount + busyCount + pauseCount));

  const fetchDriversLocations = async (showPulse = false) => {
    if (showPulse) setIsRefreshing(true);
    try {
      const res = await driverApi.fetchDriversForMap();
      if (res?.success) setDrivers(res.data || []);
    } catch (error) { console.error("Erreur récupération:", error); }
    finally { setLoading(false); setIsRefreshing(false); }
  };

  useEffect(() => {
    const handleVisibilityChange = () => { if (document.visibilityState === 'visible') fetchDriversLocations(true); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    fetchDriversLocations();
    const interval = setInterval(() => fetchDriversLocations(false), 30000); 
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", handleVisibilityChange); };
  }, []);

  if (loading) return <div className="h-[650px] w-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;

  return (
    <div className="space-y-6">
      <style>{`.leaflet-popup-content-wrapper { border-radius: 24px !important; padding: 6px; } .dark .leaflet-popup-content-wrapper { background: rgba(15, 23, 42, 0.95) !important; } .dark .leaflet-tile-container { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }`}</style>

      {/* --- BANDEAU ET LÉGENDE --- */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase italic flex items-center gap-2">
            <Navigation className="text-amber-500 rotate-45" size={22} /> Supervision Flotte
          </h1>
          <p className="text-[10px] font-bold text-slate-400 mt-1">TOTAL : {totalDrivers} LIVREURS</p>
        </div>

        <div className="flex gap-4">
          {[ {label: "Disponible", count: idleCount, color: "#22c55e"}, {label: "En Course", count: busyCount, color: "#f97316"}, {label: "En Pause", count: pauseCount, color: "#eab308"}].map(s => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-lg font-black">{s.count}</span>
              <span className="text-[9px] font-bold uppercase" style={{color: s.color}}>{s.label}</span>
            </div>
          ))}
        </div>
        
        <button onClick={() => fetchDriversLocations(true)} disabled={isRefreshing} className="px-6 py-3 bg-slate-900 dark:bg-amber-500 text-white rounded-2xl flex items-center gap-3">
          <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={16} /> Actualiser
        </button>
      </div>

      {/* --- CARTE --- */}
      <div className="relative h-[60vh] w-full rounded-[3rem] overflow-hidden shadow-2xl z-10">
        <MapContainer center={LIBREVILLE_CENTER} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <ChangeView center={LIBREVILLE_CENTER} />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          {drivers.map((item) => {
            if (!item.location?.coordinates) return null;
            const position = [item.location.coordinates[1], item.location.coordinates[0]];
            const currentStatus = item.driver?.driverState || "OFFLINE";
            return (
              <Marker key={item._id} position={position} icon={createBikeIcon(currentStatus)}>
                <Popup closeButton={false}>
                  <div className="p-2 space-y-3 min-w-[200px]">
                    <h4 className="text-xs font-black uppercase">{item.driver?.prenom} {item.driver?.nom}</h4>
                    {currentStatus === "PAUSE" && (
                      <div className="text-[9px] font-black text-amber-600">
                        Pause : {Math.round((item.driver.pauseTracking?.totalPauseDurationToday || 0) / 60)} min
                      </div>
                    )}
                    <a href={`tel:${item.driver.telephone}`} className="flex items-center gap-2 text-amber-500 font-bold text-[11px]">
                      <Phone size={12} /> {item.driver.telephone}
                    </a>
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