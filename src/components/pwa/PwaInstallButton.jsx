// src/components/pwa/PwaInstallButton.jsx
import { useState } from "react";
import { Download, X, Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePwaInstall } from "../../hooks/usePwaInstall";

export default function PwaInstallButton() {
  const { isInstallable, install } = usePwaInstall();
  const [showModal, setShowModal] = useState(false);

  // Détection basique de l'OS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (!isInstallable && !isIOS) return null;

  return (
    <>
      {/* Bouton Flottant */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-[999] bg-secondary text-primary p-4 rounded-full shadow-2xl shadow-secondary/30 flex items-center gap-2 hover:scale-105 transition-all"
      >
        <Download size={20} />
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-white/10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black uppercase text-sm">Installer l'app</h3>
                <button onClick={() => setShowModal(false)}><X size={20}/></button>
              </div>

              {isIOS ? (
                <div className="space-y-3 text-[12px] font-medium text-slate-500">
                  <p>Pour installer sur iPhone :</p>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>Appuyez sur le bouton <span className="font-bold">Partager</span> dans Safari.</li>
                    <li>Faites défiler et choisissez <span className="font-bold">Sur l'écran d'accueil</span>.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[12px] text-slate-500">Profitez d'une expérience fluide :</p>
                  <button 
                    onClick={() => { install(); setShowModal(false); }}
                    className="w-full bg-secondary text-white py-3 rounded-xl font-black text-xs uppercase"
                  >
                    Installer maintenant
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}