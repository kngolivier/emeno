import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, ChevronLeft, ChevronRight, MapPin, Info, ShoppingBag } from "lucide-react";

export default function PartnerModal({ partner, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("products"); // 'info' ou 'products'

  if (!partner) return null;
  const products = partner.products || [];

  const nextProduct = () => setActiveIdx((prev) => (prev + 1) % products.length);
  const prevProduct = () => setActiveIdx((prev) => (prev - 1 + products.length) % products.length);

  const handleCall = (phoneNumber) => window.location.href = `tel:${phoneNumber}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-5xl bg-white dark:bg-[#071120] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden max-h-[95vh] flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur"><X size={20} /></button>

        {/* --- TABS MOBILE --- */}
        <div className="flex md:hidden border-b border-slate-200 dark:border-white/10">
          <button 
            onClick={() => setActiveTab("info")} 
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 ${activeTab === "info" ? "text-secondary border-b-2 border-secondary" : "text-slate-400"}`}
          >
            <Info size={14} /> Infos
          </button>
          <button 
            onClick={() => setActiveTab("products")} 
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 ${activeTab === "products" ? "text-secondary border-b-2 border-secondary" : "text-slate-400"}`}
          >
            <ShoppingBag size={14} /> Produits
          </button>
        </div>

        {/* CÔTÉ GAUCHE : Infos Partenaire */}
<div className={`${activeTab === "info" ? "flex" : "hidden"} md:flex md:w-1/3 flex-col border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5 overflow-y-auto relative`}>
  
  {/* BACKGROUND IMAGE - Opacité faible */}
  <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
    <img src={partner.image} className="w-full h-full object-cover" alt="" />
  </div>

          {/* CONTENU (Z-INDEX 10 pour passer au-dessus de l'image) */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                <img src={partner.image} className="w-full h-full object-cover rounded-2xl" alt={partner.name} />
              </div>
              <h3 className="text-2xl font-black italic uppercase text-primary dark:text-white mb-2">{partner.name}</h3>
              <span className="text-secondary font-bold text-xs uppercase tracking-widest">{partner.category}</span>
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{partner.description}</p>
              <div className="flex items-center gap-2 mt-4 text-slate-400 text-xs">
                <MapPin size={14} /> {partner.address || "Localisation non définie"}
              </div>
            </div>
            
            <div className="p-6 mt-auto border-t border-slate-100 dark:border-white/5 bg-white/50 dark:bg-[#071120]/50 backdrop-blur-sm">
              <button onClick={() => handleCall(partner.phone)} className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2">
                <Phone size={14} /> Appeler le partenaire
              </button>
            </div>
          </div>
        </div>

        {/* CÔTÉ DROIT : Carousel Produits */}
        <div className={`${activeTab === "products" ? "flex" : "hidden"} md:flex md:w-2/3 flex-col bg-slate-100 dark:bg-black/20 overflow-y-auto`}>
          {products.length > 0 ? (
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeIdx}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  <div className="relative h-64 md:h-80 w-full shrink-0">
                    <img src={products[activeIdx].image} className="w-full h-full object-cover" alt="product" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                      <button onClick={prevProduct} className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40"><ChevronLeft size={24} /></button>
                    </div>
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                      <button onClick={nextProduct} className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40"><ChevronRight size={24} /></button>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-2xl md:text-3xl font-black italic uppercase text-primary dark:text-white">{products[activeIdx].name}</h4>
                      <span className="px-4 py-1.5 bg-secondary text-white font-black text-lg shadow-lg">
                        {products[activeIdx].price}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed mb-8">{products[activeIdx].description}</p>
                    
                    <button onClick={() => handleCall(partner.phone)} className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2">
                      <Phone size={14} /> Commander maintenant
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">Aucun produit disponible</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}