import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, ArrowRight, Coins, TicketPercent } from "lucide-react";

const promotions = [
  { id: 1, title: "1 course offerte", description: "Livraison gratuite après 5 commandes.", badge: "OFFRE", icon: Gift, gradient: "from-emerald-500 to-green-600" },
  { id: 2, title: "-10% Nelia's Care", description: "Code EMENO10 sur votre commande.", badge: "PARTENAIRE", icon: TicketPercent, gradient: "from-amber-500 to-orange-500" },
  { id: 3, title: "Programme fidélité", description: "Cumulez des points et débloquez des avantages.", badge: "FIDÉLITÉ", icon: Coins, gradient: "from-cyan-500 to-blue-600" },
];

export default function PromotionsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.6, root: scrollRef.current }
    );

    const cards = scrollRef.current?.querySelectorAll(".promo-card");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center mb-5 px-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">PROMOTIONS</p>
          <h2 className="text-2xl md:text-4xl font-black italic text-primary dark:text-white">Offres exclusives</h2>
        </div>
      </div>

      {/* Container avec scroll-snap amélioré */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 px-4"
        style={{ scrollPaddingLeft: '1rem' }}
      >
        {promotions.map((promo, index) => {
          const Icon = promo.icon;
          return (
            <div key={promo.id} data-index={index} className="promo-card snap-center shrink-0 w-[85vw] md:w-[360px]">
              <motion.div 
                whileTap={{ scale: 0.98 }} 
                className={`relative h-full rounded-[2rem] overflow-hidden bg-gradient-to-br ${promo.gradient} p-6 shadow-xl text-white`}
              >
                <div className="absolute top-[-40px] right-[-40px] w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 rounded-full bg-black/10" />
                
                <div className="relative z-10">
                  <span className="inline-flex px-3 py-1 rounded-full bg-white/20 backdrop-blur-xl text-[9px] font-black uppercase tracking-widest">{promo.badge}</span>
                  <div className="mt-5 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-2xl font-black italic leading-tight">{promo.title}</h3>
                  <p className="mt-3 text-sm text-white/80 leading-relaxed">{promo.description}</p>
                  <button className="mt-6 flex items-center gap-2 px-5 h-11 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-sm font-bold">
                    Voir l'offre <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Indicateurs dynamiques */}
      <div className="flex justify-center gap-2 mt-4">
        {promotions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 bg-secondary" : "w-1.5 bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </section>
  );
}