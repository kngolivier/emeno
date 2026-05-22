// FILE: src/pages/partner-portal/PartnerOrderDetailModal.jsx

import React, { useState } from "react";
import { X, MapPin, User, ShieldCheck, Phone, DollarSign, Package, RefreshCw, Check } from "lucide-react";
import { resendDeliveryOtp } from "../../api/deliveries.api";
import { STATUS_LABELS } from "../../constants/constants";

export default function PartnerOrderDetailModal({ delivery, onClose }) {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!delivery) return null;

  // Déterminer si la livraison est close (Empêche l'action si DELIVERED ou CANCELLED)
  const isClosed = ["DELIVERED", "CANCELLED"].includes(delivery.status);

  const handleResendOtp = async () => {
    if (loading || isClosed) return;
    setLoading(true);
    try {
      await resendDeliveryOtp(delivery._id);
      setIsSent(true);
      // Réinitialise l'état du bouton après 3 secondes
      setTimeout(() => setIsSent(false), 3000);
    } catch (error) {
      console.error("Erreur lors du renvoi de l'OTP :", error);
      alert(error?.response?.data?.message || "Impossible de renvoyer le code de sécurité.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden relative flex flex-col animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-300">
        
        {/* HEADER */}
        <div className="p-6 bg-gradient-to-r from-primary to-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">Bordereau Logistique</span>
            <h3 className="text-xl font-black italic font-display uppercase tracking-tight mt-1 text-white">Course #{delivery.orderNumber}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* DETAILS BODY */}
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-hide">
          
          {/* STATUT */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">État d'avancement</span>
            <span className="text-xs font-black uppercase text-secondary tracking-widest">{STATUS_LABELS[delivery.status]}</span>
          </div>

          {/* ACTIONS SÉCURITÉ (OTP) */}
          {!isClosed && (
            <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-secondary mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-xs font-black text-primary dark:text-white uppercase tracking-wide">Code de Sécurité</h5>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">Le client n'a pas reçu le SMS ? Vous pouvez déclencher un renvoi manuel immédiat.</p>
                </div>
              </div>
              
              <button
                onClick={handleResendOtp}
                disabled={loading || isSent}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  isSent 
                    ? "bg-emerald-500 text-white cursor-default"
                    : "bg-primary text-white hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50"
                }`}
              >
                {isSent ? (
                  <>
                    <Check size={14} className="animate-bounce" />
                    Code Réexpédié !
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    {loading ? "Génération en cours..." : "Renvoyer le code par SMS"}
                  </>
                )}
              </button>
            </div>
          )}

          {/* BLOCK CLIENT DESTINATAIRE */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><User size={12} /> Point de Dépôt Destinataire</h4>
            <div className="p-4 border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-white/[0.01] rounded-2xl space-y-2">
              <p className="text-sm font-black text-primary dark:text-white">{delivery.dropoffContact?.name}</p>
              <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Phone size={12} /> {delivery.dropoffContact?.phone}</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-start gap-1.5"><MapPin size={14} className="shrink-0 text-slate-300 mt-0.5" /> {delivery.dropoffLocation}</p>
            </div>
          </div>

          {/* COLIS ET PACKAGING SPECIFICATIONS */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Package size={12} /> Nature de la Marchandise</h4>
            <div className="p-4 border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-white/[0.01] rounded-2xl">
              <span className="inline-block text-[9px] font-black px-2.5 py-0.5 bg-secondary text-primary rounded-md uppercase tracking-wider mb-2">
                {delivery.packageDetails?.category || "GÉNÉRIQUE"}
              </span>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic">
                "{delivery.packageDetails?.description || "Aucune note additionnelle laissée."}"
              </p>
            </div>
          </div>

          {/* TARIFICATION SNAPSHOT */}
          <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl shadow-md">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-secondary" />
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Coût d'expédition</span>
            </div>
            <span className="text-sm font-black tracking-tight">{delivery.totalAmount?.toLocaleString("fr-FR")} {delivery.currency || "FCFA"}</span>
          </div>

        </div>
      </div>
    </div>
  );
}