// src/components/landing/PriceEstimator.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, Loader2, AlertCircle, Phone, ArrowRight, ChevronDown } from "lucide-react";
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
        const data = response.data?.data || response.data || response;
        // On s'assure de n'afficher que les communes actives au Gabon
        setCommunes(Array.isArray(data) ? data.filter(c => c.isActive) : []);
      } catch (error) {
        console.error("Erreur communes:", error);
        // Fallback local pour éviter un composant vide en dev
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
      toast.error("Veuillez sélectionner les deux zones", {
        style: { borderRadius: '15px', background: '#00441F', color: '#fff', fontSize: '12px', fontWeight: '900' }
      });
      return;
    }
    
    if (origin === destination) {
        toast.error("Le départ et l'arrivée doivent être différents");
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
      setNoRouteFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#0B1120] p-8 lg:p-10 rounded-[3.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-100 dark:border-white/5 w-full max-w-lg relative overflow-hidden group transition-all duration-500"
    >
      {/* Glow décoratif interne */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl lg:text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/5 dark:bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                    <Truck size={20} strokeWidth={2.5} />
                </div>
                Estimer <span className="text-secondary">mon tarif.</span>
            </h3>
        </div>

        <div className="space-y-4">
          <SelectGroup 
            icon={<MapPin size={18} />}
            label="Départ (Ramassage)"
            value={origin}
            onChange={(e) => { setOrigin(e.target.value); setPrice(null); setNoRouteFound(false); }}
            options={communes}
            placeholder="Sélectionner la commune"
          />

          <div className="flex justify-center -my-2 relative z-20">
             <div className="w-8 h-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-full flex items-center justify-center text-slate-300">
                <ChevronDown size={14} />
             </div>
          </div>

          <SelectGroup 
            icon={<MapPin size={18} />}
            label="Arrivée (Livraison)"
            value={destination}
            onChange={(e) => { setDestination(e.target.value); setPrice(null); setNoRouteFound(false); }}
            options={communes}
            placeholder="Sélectionner la commune"
          />

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleEstimate}
            disabled={loading}
            className="w-full mt-6 bg-primary dark:bg-secondary text-white dark:text-primary-dark py-6 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-secondary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Calculer le montant"}
          </motion.button>

          <AnimatePresence mode="wait">
            {price && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="mt-8 p-8 bg-secondary dark:bg-secondary rounded-[2.5rem] text-center shadow-xl shadow-secondary/20 relative overflow-hidden"
              >
                <div className="relative z-10">
                    <p className="text-primary-dark/60 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Forfait Garanti</p>
                    <p className="text-5xl font-black text-primary-dark tracking-tighter italic">
                        {price.toLocaleString()} <span className="text-xs not-italic font-bold opacity-50 ml-1 uppercase">FCFA</span>
                    </p>
                    <button 
                    onClick={() => window.location.href = '/register'}
                    className="mt-6 w-full py-4 bg-primary-dark text-secondary rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:gap-4 transition-all"
                    >
                    Commander un livreur <ArrowRight size={14} />
                    </button>
                </div>
              </motion.div>
            )}

            {noRouteFound && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-[2rem]"
              >
                <div className="flex items-center gap-3 text-rose-600 dark:text-rose-500 mb-2">
                  <AlertCircle size={18} />
                  <p className="font-black text-[10px] uppercase tracking-widest italic">Analyse requise</p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[12px] font-bold leading-relaxed mb-4">
                  Ce trajet n'est pas standard. Contactez notre centrale pour un devis personnalisé.
                </p>
                <a href="tel:+24107000000" className="flex items-center justify-center gap-3 w-full py-4 bg-white dark:bg-white/5 border border-rose-200 dark:border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-rose-600 hover:text-white">
                  <Phone size={14} /> Appeler le support
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function SelectGroup({ icon, label, value, onChange, options, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4 italic">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
          {icon}
        </div>
        <select 
          value={value}
          onChange={onChange}
          className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-secondary/20 rounded-[1.5rem] py-5 pl-16 pr-12 outline-none font-bold text-sm text-primary dark:text-white transition-all appearance-none cursor-pointer shadow-inner"
        >
          <option value="" className="dark:bg-slate-900">{placeholder}</option>
          {options.map(c => (
            <option key={c._id} value={c._id} className="dark:bg-slate-900 font-bold">
                {c.name}
            </option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
            <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}