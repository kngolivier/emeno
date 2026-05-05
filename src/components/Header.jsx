// FILE: src/components/Header.jsx
import { Bell, Search, Truck, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../hooks/useNotifications";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user } = useAuth();
  const { unreadCount, notifications, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const role = user?.role;

  const getDeliveryRoute = (deliveryId) => {
    if (!deliveryId) return "#";
    switch (role) {
      case "ADMIN": return `/admin/deliveries/${deliveryId}`;
      case "CLIENT": return `/client/orders/${deliveryId}`;
      case "DRIVER": return `/driver/deliveries/${deliveryId}`;
      default: return `/deliveries/${deliveryId}`;
    }
  };

  const validNotifications = useMemo(() => {
    const seen = new Set();
    return notifications.filter(n => {
      const id = n._id || n.data?.deliveryId;
      if (seen.has(id)) return false;
      seen.add(id);
      return n.deliveryId ?? n?.data?.deliveryId;
    });
  }, [notifications]);

  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-50 px-8 flex justify-between items-center sticky top-0 z-40">
      
      {/* BARRE DE RECHERCHE ULTRA-CHIC */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher un colis, un client..." 
          className="w-full bg-slate-50/50 rounded-[1.2rem] py-3 pl-12 pr-4 text-sm font-bold text-primary outline-none border-2 border-transparent focus:border-secondary/10 focus:bg-white transition-all shadow-inner"
        />
      </div>

      <div className="flex items-center gap-8 relative">
        
        {/* NOTIFICATIONS AVEC BADGE FLOTTANT */}
        <div className="relative">
          <button 
            onClick={() => { setOpen(!open); markAllAsRead(); }}
            className={`relative p-3 rounded-2xl transition-all ${open ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <Bell size={22} strokeWidth={2.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-black bg-red-500 text-white rounded-full ring-4 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN PREMIUM */}
          {open && (
            <div className="absolute right-0 top-16 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h4 className="font-black text-primary uppercase tracking-tighter">Notifications</h4>
                <span className="bg-primary text-white text-[10px] px-3 py-1 rounded-full font-black">{validNotifications.length}</span>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {validNotifications.length === 0 ? (
                  <div className="p-10 text-center text-slate-300 font-bold italic text-sm">Aucune nouvelle alerte</div>
                ) : (
                  validNotifications.map((notif, index) => {
                    const orderNumber = notif.orderNumber ?? notif?.data?.orderNumber ?? "—";
                    const deliveryId = notif.deliveryId ?? notif?.data?.deliveryId;
                    const notifKey = notif._id || index;

                    return (
                      <div
                        key={notifKey}
                        onClick={() => { navigate(getDeliveryRoute(deliveryId)); setOpen(false); }}
                        className="p-4 rounded-[1.5rem] hover:bg-slate-50 cursor-pointer transition-all flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 flex items-center justify-center bg-secondary/10 text-secondary rounded-2xl group-hover:scale-110 transition-transform">
                          <Truck size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-primary italic">#{orderNumber}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mise à jour statut</p>
                        </div>
                        <div className="w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                      </div>
                    );
                  })
                )}
              </div>
              <button onClick={() => navigate("/notifications")} className="w-full p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-secondary border-t border-slate-50 transition-colors">
                Voir tout l'historique
              </button>
            </div>
          )}
        </div>

        {/* PROFIL UTILISATEUR */}
        <div className="flex items-center gap-4 pl-8 border-l-2 border-slate-50">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-black text-primary leading-none mb-1 uppercase tracking-tighter">
              {user?.nom} {user?.prenom}
            </p>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] opacity-80">
              {role}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-[1.2rem] font-black shadow-lg shadow-primary/20 border-2 border-white cursor-pointer hover:scale-105 transition-transform">
            {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}