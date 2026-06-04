// src/pages/PricingPage.jsx
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import { Pagination } from "../components/Pagination";
import { usePaginatedFetch } from "../hooks/usePaginatedFetch";
import { fetchPricing } from "../api/pricing.api";
import { MapPin, HelpCircle, ArrowUpDown, Info, LayoutGrid, Search, X } from "lucide-react";

export default function PricingPage() {
  // Hook de pagination et recherche côté serveur
  const { 
    data: pricingData, 
    meta, 
    loading, 
    search, 
    setSearch, 
    setPage 
  } = usePaginatedFetch(fetchPricing);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 blur-[150px] rounded-full animate-pulse" />
      </div>

      <main className="pt-32 lg:pt-48 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="text-center mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 mb-4"
          >
            <LayoutGrid size={14} className="text-secondary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Grille Tarifaire 2026</span>
          </motion.div>
          
          <h1 className="text-3xl lg:text-7xl font-black text-primary dark:text-white italic tracking-tighter leading-none">
            NOS <span className="text-secondary">TARIFS.</span>
          </h1>
          
          {/* Barre de recherche (interagit avec l'URL via le hook) */}
          <div className="relative max-w-md mx-auto mt-8">
            <input 
              type="text" 
              placeholder="Rechercher une zone (ex: Akanda...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-secondary/20 rounded-full py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-400 outline-none transition-all"
            />
            <Search className="absolute left-4 top-4 text-slate-400" size={18} />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-4 top-4 text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </header>

        {/* --- GRID TARIFS --- */}
        <section className="mb-20">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <PricingSkeleton key={i} />)}
            </div>
          ) : pricingData.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {pricingData.map((p, index) => (
                  <PricingCard key={p._id || index} p={p} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyPricing />
          )}
        </section>

        {/* --- PAGINATION --- */}
        <Pagination meta={meta} setPage={setPage} />

        {/* --- FAQ SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 py-20 border-t border-slate-100 dark:border-white/5 mt-20">
           <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-4xl lg:text-7xl font-black text-primary dark:text-white leading-[0.9] italic uppercase tracking-tighter">
                    QUESTIONS <br/> <span className="text-secondary">FRÉQUENTES.</span>
                </h3>
                <div className="w-24 h-2 bg-secondary rounded-full" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-lg">
                Tout ce que vous devez savoir sur la tarification EMENO au Gabon.
              </p>
           </div>

           <div className="space-y-10 lg:space-y-12">
              <FAQItem 
                question="Comment est calculé le prix ?" 
                answer="Chez EMENO, nous fonctionnons par forfait de zone (Communes). Un trajet Libreville vers Akanda a un prix fixe, peu importe l'heure ou le trafic." 
              />
              <FAQItem 
                question="Y a-t-il des frais d'attente ?" 
                answer="Les 10 premières minutes d'attente lors du ramassage sont gratuites. Au-delà, une majoration de 500 CFA par tranche de 15 min s'applique." 
              />
              <FAQItem 
                question="Paiement à la livraison ?" 
                answer="Oui, nous acceptons le cash à la livraison, ainsi que les paiements via Mobile Money (Airtel Money & Moov Money)." 
              />
           </div>
        </section>

        {/* --- INFO BANNER --- */}
        <div className="mt-20 p-8 lg:p-12 bg-primary dark:bg-secondary rounded-[3rem] text-white dark:text-primary-dark flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="flex items-center gap-6 text-center lg:text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Info size={32} />
                </div>
                <div>
                    <h4 className="text-xl lg:text-2xl font-black italic uppercase tracking-tight">Besoin d'un contrat pro ?</h4>
                    <p className="opacity-80 text-xs lg:text-sm font-bold uppercase tracking-widest mt-1">Tarifs dégressifs pour les entreprises et e-commerçants.</p>
                </div>
            </div>
            <button className="px-10 py-5 bg-white dark:bg-primary-dark text-primary dark:text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:scale-105 transition-transform active:scale-95 shadow-xl">
                Contacter le service commercial
            </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function PricingCard({ p, index }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 p-8 rounded-[2rem] flex flex-col justify-between transition-all shadow-sm hover:shadow-lg hover:border-secondary/30"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
          <MapPin size={24} />
        </div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg">
            {p.pricingType || 'Coursier'}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="font-black text-lg text-primary dark:text-white italic tracking-tighter">
            {p.from?.name || 'Zone A'}
        </div>
        <div className="flex items-center gap-2 text-secondary">
            <ArrowUpDown size={16} />
            <div className="h-px flex-1 bg-slate-100 dark:bg-white/10" />
        </div>
        <div className="font-black text-lg text-primary dark:text-white italic tracking-tighter">
            {p.to?.name || 'Zone B'}
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-white/5 pt-6 flex items-baseline justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</span>
        <p className="text-2xl font-black text-primary dark:text-white">
          {p.basePrice?.toLocaleString()} <span className="text-[10px] text-secondary font-bold uppercase">CFA</span>
        </p>
      </div>
    </motion.div>
  );
}

function PricingSkeleton() {
  return (
    <div className="h-[300px] bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] animate-pulse border border-slate-100 dark:border-white/5" />
  );
}

function EmptyPricing() {
  return (
    <div className="py-20 text-center space-y-4 col-span-full">
      <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-300">
        <Info size={32} />
      </div>
      <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Aucun résultat trouvé.</p>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="group space-y-4"
    >
      <h4 className="text-secondary font-black uppercase text-xs lg:text-sm tracking-[0.2em] italic flex items-center gap-3">
        <HelpCircle size={18} className="text-secondary/30 group-hover:text-secondary transition-colors" /> {question}
      </h4>
      <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-lg font-medium leading-relaxed pl-8 border-l-2 border-slate-100 dark:border-white/5 group-hover:border-secondary/40 transition-all">
        {answer}
      </p>
    </motion.div>
  );
}