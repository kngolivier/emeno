// src/components/landing/PriceEstimator.jsx
import { useState, useEffect } from "react";
import { Truck, MapPin, ArrowRight, Loader2, AlertCircle, Phone } from "lucide-react";
import { calculatePrice, fetchPricing } from "../../api/pricing.api";
import toast from "react-hot-toast";

export default function PriceEstimator() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const [noRouteFound, setNoRouteFound] = useState(false); // Nouvel état pour le trajet inexistant

  useEffect(() => {
    const loadZones = async () => {
      try {
        // Tentative de récupération des zones
        const response = await fetchPricing(1, 100);
        const data = response.data?.data || response.data || [];
        const allZones = data.flatMap(p => [p.from, p.to]);
        setZones([...new Set(allZones)].sort());
      } catch (error) {
        // On ne redirige pas, on log juste l'erreur
        console.warn("Zones indisponibles en mode public:", error.message);
        // Optionnel: charger une liste par défaut si l'API est protégée
        setZones(["Libreville", "Akanda", "Owendo", "Ntoum"]);
      }
    };
    loadZones();
  }, []);

  const handleEstimate = async () => {
    if (!origin || !destination) {
      toast.error("Veuillez choisir un départ et une arrivée");
      return;
    }

    setLoading(true);
    setPrice(null);
    setNoRouteFound(false);

    try {
      const response = await calculatePrice(origin, destination);
      const estimatedPrice = response.data?.price || response.data?.totalPrice;
      
      if (estimatedPrice) {
        setPrice(estimatedPrice);
      } else {
        setNoRouteFound(true);
      }
    } catch (error) {
      // Si l'API renvoie 404 ou 401, on affiche le message "Trajet non trouvé"
      setNoRouteFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
      <h3 className="text-2xl font-black text-primary mb-6 flex items-center gap-3">
        <Truck className="text-secondary" /> Estimer mon tarif
      </h3>

      <div className="space-y-4">
        {/* DEPART */}
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={20} />
          <select 
            value={origin}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-secondary/10 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-primary transition-all appearance-none cursor-pointer"
            onChange={(e) => { setOrigin(e.target.value); setPrice(null); setNoRouteFound(false); }}
          >
            <option value="">Lieu de ramassage</option>
            {zones.map(z => <option key={`from-${z}`} value={z}>{z}</option>)}
          </select>
        </div>

        {/* ARRIVEE */}
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={20} />
          <select 
            value={destination}
            className="w-full bg-slate-50 border-2 border-transparent focus:border-secondary/10 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-primary transition-all appearance-none cursor-pointer"
            onChange={(e) => { setDestination(e.target.value); setPrice(null); setNoRouteFound(false); }}
          >
            <option value="">Lieu de livraison</option>
            {zones.map(z => <option key={`to-${z}`} value={z}>{z}</option>)}
          </select>
        </div>

        <button 
          onClick={handleEstimate}
          disabled={loading}
          className="w-full bg-secondary text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-secondary/40 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>Calculer le prix <ArrowRight className="group-hover:translate-x-2 transition-transform" /></>
          )}
        </button>

        {/* AFFICHAGE DU PRIX */}
        {price && !loading && (
          <div className="mt-6 p-6 bg-primary rounded-[2rem] text-center animate-in zoom-in-95 duration-300 shadow-xl shadow-primary/20 border border-white/10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Tarif Estimé</p>
            <p className="text-4xl font-black text-white mt-1">{price.toLocaleString()} <span className="text-sm">FCFA</span></p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="mt-4 w-full py-3 bg-secondary rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Commander maintenant
            </button>
          </div>
        )}

        {/* MESSAGE TRAJET NON TROUVÉ */}
        {noRouteFound && !loading && (
          <div className="mt-6 p-6 bg-amber-50 border border-amber-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 text-amber-600 mb-2">
              <AlertCircle size={20} />
              <p className="font-black text-xs uppercase tracking-widest">Zone non desservie</p>
            </div>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Désolé, ce trajet n'est pas encore automatisé. Contactez-nous pour un tarif sur mesure.
            </p>
            <a 
              href="tel:+24101234567"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white border border-amber-200 rounded-xl text-amber-700 text-xs font-black uppercase hover:bg-amber-100 transition-colors"
            >
              <Phone size={14} /> Contacter le support
            </a>
          </div>
        )}
      </div>
    </div>
  );
}