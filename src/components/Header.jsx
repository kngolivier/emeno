import { Bell, Search, Truck } from "lucide-react";
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

  // ======================
  // ROUTE DYNAMIQUE SELON RÔLE
  // ======================
  const getDeliveryRoute = (deliveryId) => {
    if (!deliveryId) return "#";

    switch (role) {
      case "ADMIN":
        return `/deliveries/${deliveryId}`;
      case "CLIENT":
        return `/client/deliveries/${deliveryId}`;
      case "DRIVER":
        return `/driver/deliveries/${deliveryId}`;
      default:
        return `/deliveries/${deliveryId}`;
    }
  };

  // ======================
  // NOTIFICATIONS VALIDES
  // ======================
  const validNotifications = useMemo(() => {
    return notifications.filter(
      notif => notif.deliveryId ?? notif?.data?.deliveryId
    );
  }, [notifications]);

  return (
    <header className="h-20 bg-primary px-8 flex justify-between items-center sticky top-0 z-10">

      {/* SEARCH */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="w-full bg-white/90 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-secondary/20"
        />
      </div>

      <div className="flex items-center gap-6 text-white relative">

        {/* NOTIFICATIONS */}
        <button 
          onClick={() => {
            setOpen(!open);
            markAllAsRead();
          }}
          className="relative p-2 rounded-full hover:bg-white/10 transition"
        >
          <Bell size={22} />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-secondary text-white rounded-full shadow">
              {unreadCount}
            </span>
          )}
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-14 w-[360px] 
            bg-white/80 backdrop-blur-md 
            text-slate-800 rounded-2xl shadow-soft border border-white/40 overflow-hidden">

            {/* HEADER */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <span className="text-xs text-muted">{validNotifications.length}</span>
            </div>

            {/* LIST */}
            <div className="max-h-80 overflow-y-auto">

              {validNotifications.length === 0 ? (
                <p className="p-4 text-sm text-muted text-center">
                  Aucune notification
                </p>
              ) : (
                validNotifications.map((notif, index) => {

                  const orderNumber = notif.orderNumber ?? notif?.data?.orderNumber ?? "—";
                  const deliveryId = notif.deliveryId ?? notif?.data?.deliveryId;

                  return (
                    <div
                      key={index}
                      onClick={() => navigate(getDeliveryRoute(deliveryId))}
                      className="px-4 py-3 border-b last:border-none cursor-pointer hover:bg-white/60 transition flex items-start gap-3"
                    >
                      {/* ICON */}
                      <div className="w-9 h-9 flex items-center justify-center bg-secondary/10 text-secondary rounded-xl">
                        <Truck size={18} />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          Commande #{orderNumber}
                        </p>
                        <p className="text-xs text-muted">
                          Mise à jour de livraison
                        </p>
                      </div>

                      {/* DOT */}
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                    </div>
                  );
                })
              )}
            </div>

            {/* FOOTER */}
            <div className="p-3 text-center border-t">
              <button
                onClick={() => navigate("/notifications")}
                className="text-xs text-secondary font-semibold hover:underline"
              >
                Voir toutes les notifications
              </button>
            </div>
          </div>
        )}

        {/* PROFIL */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/20">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">
              {user?.nom} {user?.prenom}
            </p>
            <p className="text-xs text-white/60 uppercase">
              {role}
            </p>
          </div>

          <div className="w-11 h-11 bg-white text-primary flex items-center justify-center rounded-xl font-bold shadow">
            {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
          </div>
        </div>

      </div>
    </header>
  );
}