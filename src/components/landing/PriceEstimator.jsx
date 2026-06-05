// src/components/landing/PriceEstimator.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, Loader2, AlertCircle, Phone, ChevronDown, ArrowRight } from "lucide-react";
import { calculatePrice } from "../../api/pricing.api";
import { fetchCommunes } from "../../api/commune.api";
import toast from "react-hot-toast";
import { useSettings } from "../../context/Settings/SettingsContext";

export default function PriceEstimator() {
  const { settings } = useSettings();
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
        const data = response.data?.data || response.data || response;
        setCommunes(Array.isArray(data) ? data.filter(c => c.isActive) : []);
      } catch (error) {
        setCommunes([{ _id: "1", name: "Libreville" }, { _id: "2", name: "Akanda" }]);
      }
    };
    loadData();
  }, []);

  const handleEstimate = async () => {
    if (!origin || !destination) {
      toast.error("Veuillez sélectionner les deux zones", { 
        style: { borderRadius: '15px', background: '#0F172A', color: '#fff', fontSize: '12px' } 
      });
      return;
    }
    
    setLoading(true); 
    setPrice(null); 
    setNoRouteFound(false);
    
    try {
      const response = await calculatePrice(origin, destination);
      const est = response.data?.price || response.data?.totalPrice;
      
      if (est) {
        setPrice(est);
      } else {
        setNoRouteFound(true);
      }
    } catch (error) {
      setNoRouteFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0B1120] p-6 lg:p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 w-full max-w-md relative">
        <h3 className="text-lg font-black text-primary dark:text-white uppercase italic tracking-tighter mb-6 flex items-center gap-3">
           <Truck size={20} className="text-secondary" /> Estimer mon tarif.
        </h3>

        <div className="space-y-4">
          <SelectGroup label="Départ" value={origin} onChange={(e) => { setOrigin(e.target.value); setPrice(null); setNoRouteFound(false); }} options={communes} />
          
          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                <ChevronDown size={14} />
            </div>
          </div>
          
          <SelectGroup label="Arrivée" value={destination} onChange={(e) => { setDestination(e.target.value); setPrice(null); setNoRouteFound(false); }} options={communes} />

          <button 
            onClick={handleEstimate} 
            disabled={loading} 
            className="w-full mt-4 bg-primary dark:bg-secondary text-white dark:text-primary-dark py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Calculer"}
          </button>

          <AnimatePresence mode="wait">
            {/* Cas : Prix trouvé */}
            {price && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 p-6 bg-secondary text-primary-dark rounded-2xl text-center shadow-lg">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80">Forfait estimé</p>
                <p className="text-4xl font-black tracking-tighter italic">{price.toLocaleString()} <span className="text-xs">FCFA</span></p>
                <button onClick={() => window.location.href = '/register'} className="mt-4 w-full py-3 bg-primary-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Commander
                </button>
              </motion.div>
            )}

            {/* Cas : Aucune route */}
            {noRouteFound && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl">
                <div className="flex items-center gap-3 text-rose-600 dark:text-rose-500 mb-2">
                    <AlertCircle size={18} />
                    <p className="font-black text-[10px] uppercase tracking-widest italic">Analyse requise</p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mb-4">
                  Ce trajet n'est pas standard. Contactez notre centrale pour un devis personnalisé.
                </p>
                <a href={`tel:${settings.contact?.phone}`} className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-white/5 border border-rose-200 dark:border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-rose-600 hover:text-white">
                    <Phone size={14} /> Appeler le support
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
}

function SelectGroup({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-4 mb-1 block">{label}</label>
      <select 
        value={value} 
        onChange={onChange} 
        className="w-full bg-slate-50 dark:bg-white/5 rounded-2xl py-4 px-6 outline-none font-bold text-sm text-primary dark:text-white appearance-none cursor-pointer border border-transparent focus:border-secondary transition-colors"
      >
        <option value="">Sélectionner...</option>
        {options.map(c => <option key={c._id} value={c._id} className="dark:bg-slate-900">{c.name}</option>)}
      </select>
    </div>
  );
}