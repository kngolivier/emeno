// FILE: EMENO/src/pages/TrackingPage.jsx

import { useState } from "react";
import { Search, Loader2, Package, MapPin, User, CheckCircle, Clock, XCircle, Truck } from "lucide-react";
import { trackDeliveryPublic } from "../api/deliveries.api";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

// 1. Fonction utilitaire pour rendre le statut humain
const getStatusLabel = (status) => {
  const statusMap = {
    PENDING: { text: "En attente de traitement", color: "bg-amber-100 text-amber-700", icon: Clock },
    ASSIGNED: { text: "Livreur assigné, en route pour le ramassage", color: "bg-blue-100 text-blue-700", icon: User },
    PICKED_UP: { text: "Colis ramassé par le livreur", color: "bg-indigo-100 text-indigo-700", icon: Package },
    IN_PROGRESS: { text: "En cours de livraison", color: "bg-purple-100 text-purple-700", icon: Truck },
    DELIVERED: { text: "Livré avec succès", color: "bg-green-100 text-green-700", icon: CheckCircle },
    CANCELLED: { text: "Livraison annulée", color: "bg-red-100 text-red-700", icon: XCircle },
  };
  return statusMap[status] || { text: status, color: "bg-gray-100 text-gray-700", icon: Package };
};

export default function TrackingPage() {
  const [trackId, setTrackId] = useState("");
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!trackId) return;
    setLoading(true);
    setError("");
    setDelivery(null);

    try {
      const res = await trackDeliveryPublic(trackId);
      setDelivery(res?.data?.data || res?.data || res);
    } catch (err) {
      setError("Désolé, nous n'avons pas trouvé de commande avec ce numéro.");
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = delivery ? getStatusLabel(delivery.status) : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050810] py-16 px-6">
      <Navbar />
      <div className="max-w-lg mx-auto mt-24">
        {/* Titre et description pour guider l'utilisateur */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic text-primary dark:text-white mb-4">
            Suivi de colis
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Entrez votre numéro de commande ci-dessous pour suivre votre livraison 
            en temps réel, de l'entrepôt à votre porte.
          </p>
        </div>
        
        {/* Input avec inputMode pour forcer le clavier numérique mobile sans flèches */}
        <div className="relative mb-8">
          <input 
            type="text" 
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Ex: 12345" 
            className="w-full p-6 pr-16 rounded-[2rem] border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] text-lg font-bold shadow-lg focus:border-secondary outline-none transition-all"
            onChange={(e) => setTrackId(e.target.value.replace(/[^0-9]/g, ''))} // Nettoyage strict
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-3 top-3 p-3 bg-secondary text-white rounded-2xl hover:bg-secondary/90 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
          </button>
        </div>

        {/* État vide illustratif */}
        {!delivery && !error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
              <Truck size={40} className="opacity-50" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-300">Aucune recherche active</p>
          </div>
        )}

        {error && (
          <p className="text-center text-red-500 font-bold bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl">
            {error}
          </p>
        )}

        {delivery && (
          <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header de la carte */}
            <div className={`p-8 ${statusInfo.color} flex items-center gap-4`}>
              <StatusIcon size={32} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Statut actuel</p>
                <h2 className="text-xl font-black">{statusInfo.text}</h2>
              </div>
            </div>

            {/* Corps de la carte */}
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-secondary">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Livreur en charge</p>
                  <p className="font-bold text-primary dark:text-white">
                    {delivery.driverId ? `${delivery.driverId.prenom} ${delivery.driverId.nom}` : "En attente d'assignation"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-secondary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Trajet</p>
                  <p className="font-bold text-primary dark:text-white">{delivery.pickupLocation} ➔ {delivery.dropoffLocation}</p>
                </div>
              </div>
            </div>
            
            <div className="px-8 pb-8">
              <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:opacity-90 transition-all">
                Contacter le support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}