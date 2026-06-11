// FILE: src/components/layout/Header.jsx

import {
  Bell,
  Search,
  Menu,
  ChevronRight,
  Sun,
  Moon,
  Truck,
  PackageCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/Theme/ThemeContext";
import { useNotifications } from "../hooks/useNotifications";

import { useState, useMemo } from "react";

import {
  useLocation,
  Link,
} from "react-router-dom";

export default function Header({
  toggleSidebar,
}) {
  const { user } = useAuth();

  const {
    isDarkMode,
    toggleTheme,
  } = useTheme();

  const {
    unreadCount,
    notifications,
    markAllAsRead,
  } = useNotifications();

  const [openNotif, setOpenNotif] =
    useState(false);

  const location = useLocation();

  const role = user?.role;

  /* ==========================================================================
     NOTIFICATIONS
     ========================================================================== 
  */
  const validNotifications = useMemo(() => {
    // Le filtrage par rôle est déjà géré dans le Provider, 
    // on ne garde ici qu'une sécurité pour éviter les doublons UI
    const seen = new Set();
    return notifications.filter((n) => {
      const id = n._id || n.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [notifications]);

  /* ==========================================================================
     HELPERS
     ========================================================================== */

  const getNotifIcon = (message) => {
    const msg =
      message?.toLowerCase() || "";

    if (
      msg.includes("confirmé") ||
      msg.includes("validé")
    ) {
      return <PackageCheck size={18} />;
    }

    if (
      msg.includes("attention") ||
      msg.includes("erreur") ||
      msg.includes("annulé")
    ) {
      return <AlertCircle size={18} />;
    }

    return <Truck size={18} />;
  };

  const notificationRoute =
    role === "CLIENT"
      ? "/client/notifications"
      : role === "DRIVER"
      ? "/driver/notifications"
      : role === "PARTNER_MANAGER"
      ? "/partner/notifications"
      : "/admin/notifications";

  return (
    <header className="
      h-20 lg:h-24
      sticky top-0 z-[90]
      flex items-center justify-between
      px-4 lg:px-10
      border-b
      border-slate-200/70 dark:border-white/[0.06]
      bg-white/80 dark:bg-primary
      backdrop-blur-2xl
      transition-colors duration-300
    ">

      {/* LEFT */}
      <div className="flex items-center gap-3 flex-1">

        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="
            lg:hidden
            w-10 h-10 // Réduit légèrement pour laisser plus de place
            rounded-xl
            flex items-center justify-center
            bg-slate-100 dark:bg-white/[0.05]
            text-primary dark:text-white
            hover:bg-slate-200 dark:hover:bg-white/[0.08]
            transition-all
            active:scale-95
          "
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* LOGO - Modifié pour être visible partout */}
        <div className="flex items-center">
          <img 
            src={isDarkMode ? "/logo.png" : "/logo-dark.png"} 
            alt="EMENO" 
            // h-8 sur mobile, h-10 sur desktop pour ne pas briser la mise en page
            className="h-8 md:h-10 w-auto object-contain" 
          />
        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-2 lg:gap-4 relative">

        {/* THEME */}

        <button
          onClick={toggleTheme}
          title={
            isDarkMode
              ? "Mode clair"
              : "Mode sombre"
          }
          className="
            w-12 h-12
            rounded-2xl
            flex items-center justify-center
            bg-slate-100 dark:bg-white/[0.05]
            border border-transparent dark:border-white/[0.05]
            text-slate-500 dark:text-yellow-400
            hover:bg-slate-200 dark:hover:bg-white/[0.08]
            transition-all
            active:scale-90
          "
        >
          {isDarkMode ? (
            <Sun
              size={20}
              strokeWidth={2.5}
            />
          ) : (
            <Moon
              size={20}
              strokeWidth={2.5}
            />
          )}
        </button>

        {/* NOTIFICATIONS */}

        <div className="relative">

          <button
            onClick={() => {
              setOpenNotif(!openNotif);

              if (!openNotif) {
                markAllAsRead();
              }
            }}
            className={`
              relative
              w-12 h-12
              rounded-2xl
              flex items-center justify-center
              transition-all duration-300

              ${
                openNotif
                  ? "bg-secondary text-white shadow-xl shadow-secondary/20"
                  : "bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08]"
              }
            `}
          >
            <Bell
              size={20}
              strokeWidth={2.5}
            />

            {unreadCount > 0 && (
              <span className="
                absolute -top-1 -right-1
                min-w-[20px] h-5
                px-1
                flex items-center justify-center
                rounded-full
                bg-rose-500
                text-white
                text-[10px]
                font-black
                ring-2
                ring-white dark:ring-primary
              ">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN */}

          {openNotif && (

            <div className="
              fixed sm:absolute
              right-4 sm:right-0
              top-20 sm:top-16
              w-[calc(100vw-2rem)]
              sm:w-[380px]
              overflow-hidden
              rounded-[2rem]
              border
              border-slate-200 dark:border-white/[0.06]
              bg-white/95 dark:bg-primary/95
              backdrop-blur-2xl
              shadow-2xl
              z-[120]
              animate-in fade-in slide-in-from-top-2 duration-300
            ">

              {/* HEADER */}

              <div className="
                flex items-center justify-between
                p-5
                border-b
                border-slate-100 dark:border-white/[0.06]
                bg-slate-50/80 dark:bg-white/[0.03]
              ">

                <div>

                  <h4 className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-primary
                  ">
                    Notifications
                  </h4>

                  <p className="
                    mt-1
                    text-[9px]
                    uppercase
                    tracking-[0.18em]
                    text-slate-400
                    font-bold
                  ">
                    Flux en temps réel
                  </p>

                </div>

                <div className="
                  px-3 py-1
                  rounded-full
                  bg-secondary/10
                  text-secondary
                  text-[10px]
                  font-black
                ">
                  {validNotifications.length}
                </div>

              </div>

              {/* LIST */}

              <div className="
                max-h-[360px]
                overflow-y-auto
                p-2
                space-y-1
              ">

                {validNotifications.length ===
                0 ? (

                  <div className="
                    py-14 px-6
                    text-center
                  ">

                    <Bell
                      size={30}
                      className="
                        mx-auto
                        text-slate-300 dark:text-white/20
                      "
                    />

                    <p className="
                      mt-4
                      text-[10px]
                      uppercase
                      tracking-[0.2em]
                      font-black
                      text-slate-400
                    ">
                      Aucune notification
                    </p>

                  </div>

                ) : (

                  validNotifications
                    .slice(0, 6)
                    .map((n, idx) => {

                      const deliveryId =
                        n.deliveryId ||
                        n.data?.deliveryId;

                      return (

                        <Link
                          key={idx}
                          to={
                            user.role ===
                            "CLIENT"
                              ? `/client/orders/${deliveryId}`
                              : user.role ===
                                "DRIVER"
                              ? `/driver/deliveries`
                              : `/admin/deliveries/${deliveryId}`
                          }
                          onClick={() =>
                            setOpenNotif(false)
                          }
                          className="
                            group
                            flex gap-4
                            rounded-[1.5rem]
                            p-4
                            hover:bg-slate-50 dark:hover:bg-white/[0.04]
                            transition-all
                          "
                        >

                          {/* ICON */}

                          <div className="
                            shrink-0
                            w-11 h-11
                            rounded-2xl
                            flex items-center justify-center
                            bg-slate-100 dark:bg-white/[0.05]
                            text-slate-400
                            group-hover:bg-secondary/10
                            group-hover:text-secondary
                            transition-all
                          ">
                            {getNotifIcon(
                              n.message
                            )}
                          </div>

                          {/* CONTENT */}

                          <div className="flex-1 min-w-0">

                            <p className="
                              text-[11px]
                              font-bold
                              leading-relaxed
                              text-primary
                              line-clamp-2
                            ">
                              {n.message ||
                                "Nouvelle notification"}
                            </p>

                            <div className="
                              mt-2
                              flex items-center gap-2
                            ">

                              <span className="
                                text-[8px]
                                uppercase
                                tracking-[0.18em]
                                font-black
                                text-secondary
                              ">
                                Voir détails
                              </span>

                              <ChevronRight
                                size={11}
                                className="
                                  text-secondary
                                  opacity-0
                                  -translate-x-2
                                  group-hover:opacity-100
                                  group-hover:translate-x-0
                                  transition-all
                                "
                              />

                            </div>

                          </div>

                        </Link>

                      );
                    })

                )}

              </div>

              {/* FOOTER LINK */}

              <div className="
                p-3
                border-t
                border-slate-100 dark:border-white/[0.06]
                bg-slate-50/50 dark:bg-white/[0.02]
              ">

                <Link
                  to={notificationRoute}
                  onClick={() =>
                    setOpenNotif(false)
                  }
                  className="
                    flex items-center justify-center gap-2
                    w-full
                    rounded-2xl
                    px-4 py-3
                    bg-primary dark:bg-secondary
                    text-white
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    hover:scale-[1.01]
                    active:scale-[0.98]
                    transition-all
                  "
                >
                  Voir toutes les notifications

                  <ExternalLink size={14} />
                </Link>

              </div>

            </div>

          )}

        </div>

        {/* PROFILE */}

        <div className="
          flex items-center gap-3
          pl-3 lg:pl-6
          border-l
          border-slate-200 dark:border-white/[0.06]
        ">

          <div className="hidden sm:block text-right">

            <p className="
              text-[11px] lg:text-xs
              font-black
              uppercase italic
              tracking-tighter
              text-primary dark:text-white
              leading-none
            ">
              {user?.nom}
            </p>

            <p className="
              mt-1
              text-[8px]
              uppercase
              tracking-[0.2em]
              font-black
              text-secondary/70
            ">
              {role}
            </p>

          </div>

          <div className="
            w-11 h-11 lg:w-12 lg:h-12
            rounded-2xl
            flex items-center justify-center
            bg-white dark:bg-white/[0.06]
            border
            border-slate-200 dark:border-white/[0.08]
            text-primary dark:text-white
            font-black
            shadow-lg
          ">
            <Link to={role === "CLIENT" ? "profile" : "settings"}>
              {user?.nom?.charAt(0)}
            </Link>
          </div>

        </div>

      </div>
    </header>
  );
}