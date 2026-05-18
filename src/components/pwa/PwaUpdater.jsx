// FILE: src/components/pwa/PwaUpdater.jsx
import React, { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';

export default function PwaUpdater() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Vérification cyclique toutes les heures pour les applications mobiles persistantes
      r && setInterval(() => {
        r.update();
      }, 60 * 60 * 1000);
      console.log('Service Worker EMENO opérationnel');
    },
    onRegisterError(error) {
      console.error('Erreur SW:', error);
    }
  });

  useEffect(() => {
    if (needRefresh) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#1E293B] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-white/10`}>
          <div className="flex items-center gap-3">
            <RefreshCw className="text-[#F59E0B] animate-spin" size={20} style={{ animationDuration: '3s' }} />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Mise à jour disponible</p>
              <p className="text-[11px] text-white/75">Une nouvelle version d'EMENO est prête.</p>
            </div>
          </div>
          <button
            onClick={() => updateServiceWorker(true)}
            className="bg-[#F59E0B] text-[#1E293B] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform shrink-0"
          >
            Relancer
          </button>
        </div>
      ), { duration: Infinity });
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}