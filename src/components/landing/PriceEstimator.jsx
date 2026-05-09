// src/components/landing/PriceEstimator.jsx
import { useState, useEffect } from "react";
import { Truck, MapPin, Loader2, AlertCircle, Phone } from "lucide-react";
import { calculatePrice } from "../../api/pricing.api";
import { fetchCommunes } from "../../api/commune.api";
import toast from "react-hot-toast";

export default function PriceEstimator() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [communes, setCommunes] = useState([]);
  const [noRouteFound, setNoRouteFound] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchCommunes();
        const data = response.data || response;
        setCommunes(data.filter(c => c.isActive));
      } catch (error) {
        setCommunes([
          { _id: "1", name: "Libreville" },
          { _id: "2", name: "Akanda" },
          { _id: "3", name: "Owendo" }
        ]);
      }
    };
    loadData();
  }, []);

  const handleEstimate = async () => {
    if (!origin || !destination) {
      toast.error("Choisissez un départ et une arrivée");
      return;
    }
    setLoading(true);
    setPrice(null);
    setNoRouteFound(false);
    try {
      const response = await calculatePrice(origin, destination);
      const estimatedPrice = response.data?.price || response.data?.totalPrice;
      if (estimatedPrice) setPrice(estimatedPrice);
      else setNoRouteFound(true);
    } catch (error) {
      setNoRouteFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-primary-light p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100 dark:border-white/5 w-full max-w-lg transition-all duration-500">
      <h3 className="text-2xl font-black text-primary dark:text-white mb-6 flex items-center gap-3">
        <Truck className="text-secondary" /> Estimer mon tarif
      </h3>

      <div className="space-y-4">
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 group-focus-within:text-secondary transition-colors" size={20} />
          <select 
            value={origin}
            className="w-full bg-slate-50 dark:bg-primary-dark border-2 border-transparent focus:border-secondary/10 dark:focus:border-secondary/20 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-primary dark:text-white transition-all appearance-none cursor-pointer"
            onChange={(e) => { setOrigin(e.target.value); setPrice(null); setNoRouteFound(false); }}
          >
            <option value="">Lieu de ramassage</option>
            {communes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 group-focus-within:text-secondary transition-colors" size={20} />
          <select 
            value={destination}
            className="w-full bg-slate-50 dark:bg-primary-dark border-2 border-transparent focus:border-secondary/10 dark:focus:border-secondary/20 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-primary dark:text-white transition-all appearance-none cursor-pointer"
            onChange={(e) => { setDestination(e.target.value); setPrice(null); setNoRouteFound(false); }}
          >
            <option value="">Lieu de livraison</option>
            {communes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <button 
          onClick={handleEstimate}
          disabled={loading}
          className="w-full bg-secondary text-white dark:text-primary-dark py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-secondary/40 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Calculer le prix"}
        </button>

        {price && (
          <div className="mt-6 p-6 bg-primary dark:bg-secondary rounded-[2rem] text-center animate-in zoom-in-95 duration-300 transition-colors">
            <p className="text-white dark:text-primary-dark text-[10px] font-black uppercase tracking-[0.3em]">Tarif Estimé</p>
            <p className="text-4xl font-black text-white dark:text-primary-dark mt-1">{price.toLocaleString()} <span className="text-sm italic opacity-50">CFA</span></p>
            <button 
              onClick={() => window.location.href = '/register'}
              className="mt-4 w-full py-4 bg-white/10 dark:bg-primary-dark/20 rounded-xl text-white dark:text-primary-dark text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
            >
              Commander maintenant
            </button>
          </div>
        )}

        {noRouteFound && (
          <div className="mt-6 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-[2rem] animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 mb-2">
              <AlertCircle size={20} />
              <p className="font-black text-[10px] uppercase tracking-widest">Zone non desservie</p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[13px] font-bold leading-tight">
              Ce trajet nécessite une étude logistique spécifique.
            </p>
            <a href="tel:+24101234567" className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-white/5 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-700 dark:text-amber-500 text-[10px] font-black uppercase transition-colors">
              <Phone size={14} /> Contacter le support
            </a>
          </div>
        )}
      </div>
    </div>
  );
}