// src/pages/PricingPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { fetchPricing } from "../api/pricing.api";
import { MapPin, ArrowLeftRight, HelpCircle, ArrowDown } from "lucide-react";

export default function PricingPage() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const response = await fetchPricing();
        const data = response.data?.data || response.data || [];
        setPricingData(data.filter(p => p.isActive));
      } catch (err) {
        console.error("Erreur chargement tarifs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPrices();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-primary-dark text-slate-600 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      <main className="pt-28 lg:pt-40 pb-20 px-4 lg:px-6 max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-12 lg:mb-20 space-y-2 lg:space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-huge text-primary dark:text-white"
          >
            NOS <span className="text-secondary">TARIFS</span>
          </motion.h1>
          <p className="text-slate-400 font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] lg:tracking-[0.4em]">
            Libreville • Akanda • Owendo
          </p>
        </header>

        <section className="mb-20 lg:mb-32">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-48 lg:h-64 bg-slate-50 dark:bg-surface rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            /* Grille 2 colonnes sur mobile */
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
              {pricingData.map((p) => (
                <motion.div 
                  key={p._id}
                  whileHover={{ y: -5 }}
                  className="bg-slate-50 dark:bg-surface backdrop-blur-xl border border-slate-200 dark:border-border-glass p-5 lg:p-10 rounded-3xl lg:rounded-4xl flex flex-col justify-between group hover:border-secondary/50 transition-all shadow-lg dark:shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-6 lg:mb-10">
                    <div className="w-10 h-10 lg:w-14 lg:h-14 bg-secondary/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-secondary">
                      <MapPin size={20} className="lg:hidden" />
                      <MapPin size={28} className="hidden lg:block" />
                    </div>
                    <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/50 dark:bg-white/5 px-2 py-1 rounded-full">
                        {p.pricingType || 'Standard'}
                    </span>
                  </div>

                  {/* Zones de trajet : Colonne sur mobile, Ligne sur Desktop */}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-6 lg:mb-10">
                    <span className="text-sm lg:text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter truncate">
                        {p.from?.name || 'Départ'}
                    </span>
                    <ArrowLeftRight size={16} className="text-secondary shrink-0 hidden lg:block" />
                    <ArrowDown size={14} className="text-secondary shrink-0 lg:hidden" />
                    <span className="text-sm lg:text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter truncate">
                        {p.to?.name || 'Arrivée'}
                    </span>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-end justify-between border-t border-slate-200 dark:border-white/10 pt-4 lg:pt-8 gap-1">
                    <span className="text-[8px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Forfait</span>
                    <p className="text-xl lg:text-4xl font-black text-primary dark:text-white tracking-tighter">
                      {p.basePrice?.toLocaleString()} <span className="text-[10px] lg:text-xs text-secondary font-bold ml-1">XAF</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* FAQ - Ajustement des marges */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20 border-t border-slate-100 dark:border-white/5 pt-12 lg:pt-20">
           <div className="space-y-4 lg:space-y-6">
              <h3 className="text-3xl lg:text-6xl text-primary dark:text-white leading-none">QUESTIONS <br className="hidden lg:block"/> FRÉQUENTES</h3>
              <div className="w-16 lg:w-24 h-1.5 lg:h-2 bg-secondary rounded-full" />
           </div>
           <div className="space-y-6 lg:space-y-8">
              <FAQItem question="Comment est calculé le prix ?" answer="Le tarif de base est fixé par zone (commune). Pour les trajets hors-zone, nous appliquons un tarif au kilomètre." />
              <FAQItem question="Délais de livraison ?" answer="Pour Libreville, nous garantissons une livraison sous 45 à 90 minutes après le ramassage." />
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="group space-y-2 lg:space-y-4">
      <h4 className="text-secondary font-black uppercase text-[10px] lg:text-sm tracking-widest italic flex items-center gap-2 lg:gap-3">
        <HelpCircle size={16} className="text-secondary/50" /> {question}
      </h4>
      <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-base font-medium leading-relaxed pl-6 lg:pl-8 border-l border-slate-200 dark:border-white/10 group-hover:border-secondary transition-colors">
        {answer}
      </p>
    </div>
  );
}