import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // <--- Import nécessaire
import { useRegisterSW } from 'virtual:pwa-register/react';
import PageLoader from '../ui/PageLoader';
import { toast } from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

export default function PwaUpdater() {
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('Erreur Service Worker:', error);
    }
  });

  // Si c'est en train de mettre à jour, on utilise un PORTAL
  // pour afficher le loader directement dans le body, par-dessus tout.
  if (isUpdating) {
    return createPortal(<PageLoader />, document.body);
  }

  useEffect(() => {
    if (needRefresh) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10 dark:border-slate-200`}>
          <div className="flex items-center gap-3">
            <RefreshCw className="text-secondary animate-spin" size={20} style={{ animationDuration: '3s' }} />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Mise à jour prête</p>
              <p className="text-[11px] opacity-75">Une nouvelle version est disponible.</p>
            </div>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setIsUpdating(true);
              // On laisse une micro-seconde au state pour mettre à jour l'UI avant le reload
              setTimeout(() => updateServiceWorker(true), 100);
            }}
            className="bg-secondary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary/90 active:scale-95 transition-all shrink-0"
          >
            Actualiser
          </button>
        </div>
      ), { duration: Infinity });
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}