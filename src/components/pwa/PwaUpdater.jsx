// FILE: src/components/pwa/PwaUpdater.jsx

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRegisterSW } from "virtual:pwa-register/react";
import PageLoader from "../ui/PageLoader";
import { toast } from "react-hot-toast";
import { RefreshCw, Download } from "lucide-react";
import { usePwaInstall } from "../../hooks/usePwaInstall";

export default function PwaUpdater() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { isInstallable, install } = usePwaInstall();

  const { needRefresh: [needRefresh], updateServiceWorker } =
    useRegisterSW({
      onRegisterError(error) {
        console.error("SW error:", error);
      },
    });

  // LOADER UPDATE GLOBAL
  if (isUpdating) {
    return createPortal(<PageLoader />, document.body);
  }

  // UPDATE AVAILABLE
  useEffect(() => {
    if (!needRefresh) return;

    toast.custom((t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4`}>

        <div className="flex items-center gap-3">
          <RefreshCw className="text-secondary animate-spin" size={18} />
          <div>
            <p className="text-xs font-black uppercase">Mise à jour disponible</p>
            <p className="text-[11px] opacity-70">Nouvelle version prête</p>
          </div>
        </div>

        <button
          onClick={() => {
            toast.dismiss(t.id);
            setIsUpdating(true);
            setTimeout(() => updateServiceWorker(true), 150);
          }}
          className="bg-secondary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
        >
          Actualiser
        </button>
      </div>
    ), { duration: Infinity });
  }, [needRefresh, updateServiceWorker]);

  // INSTALL BUTTON (NEW)
  useEffect(() => {
    if (!isInstallable) return;

    toast.custom((t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-200 dark:border-white/10`}>

        <div className="flex items-center gap-3">
          <Download className="text-primary" size={18} />
          <div>
            <p className="text-xs font-black uppercase">Installer l’application</p>
            <p className="text-[11px] opacity-70">Accès rapide sur ton écran</p>
          </div>
        </div>

        <button
          onClick={() => {
            toast.dismiss(t.id);
            install();
          }}
          className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
        >
          Installer
        </button>
      </div>
    ), { duration: Infinity });
  }, [isInstallable, install]);

  return null;
}