// FILE: src/components/client-home/PromotionsCarousel.jsx

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Gift, TicketPercent } from "lucide-react";
import { fetchActivePromotionsList, generateWhatsAppLink } from "../../api/promotions.api";
import { PROMOTION_ICONS } from "../../utils/promotionIcons";

const unwrapPromotions = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.promotions)) return response.data.promotions;
  return [];
};

export default function PromotionsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadPromotions = async () => {
      try {
        const response = await fetchActivePromotionsList();
        if (mounted) setPromotions(unwrapPromotions(response));
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPromotions();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || promotions.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveIndex(Number(entry.target.dataset.index));
        });
      },
      { threshold: 0.6, root }
    );

    const cards = root.querySelectorAll(".promo-card");
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [promotions.length]);

  const handlePromoClick = async (promotion) => {
    try {
      const response = await generateWhatsAppLink({ promoId: promotion._id });
      const link = response?.data?.link || response?.data?.data?.link;
      if (link) window.open(link, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <section className="px-4">
        <div className="h-44 rounded-[2rem] bg-slate-100 dark:bg-white/5 animate-pulse" />
      </section>
    );
  }

  if (promotions.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-5 px-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Promotions</p>
          <h2 className="text-2xl md:text-4xl font-black italic text-primary dark:text-white">Offres exclusives</h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 px-4" style={{ scrollPaddingLeft: "1rem" }}>
        {promotions.map((promo, index) => {
          const Icon = PROMOTION_ICONS[promo.icon] || Gift;
          const gradient = promo.gradient || "from-emerald-500 to-green-600";

          return (
            <div key={promo._id || promo.id || index} data-index={index} className="promo-card snap-center shrink-0 w-[85vw] md:w-[360px]">
              <motion.div whileTap={{ scale: 0.98 }} className={`relative h-full min-h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br ${gradient} p-6 shadow-xl text-white`}>
                <div className="absolute top-[-40px] right-[-40px] w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 rounded-full bg-black/10" />

                <div className="relative z-10 h-full flex flex-col">
                  <span className="inline-flex w-fit px-3 py-1 rounded-full bg-white/20 backdrop-blur-xl text-[9px] font-black uppercase tracking-widest">
                    {promo.badge || "Offre spéciale"}
                  </span>
                  <div className="mt-5 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-2xl font-black italic leading-tight">{promo.title}</h3>
                  <p className="mt-3 text-sm text-white/80 leading-relaxed line-clamp-3">{promo.description}</p>
                  <button onClick={() => handlePromoClick(promo)} className="mt-auto flex items-center justify-center gap-2 px-5 h-11 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-sm font-bold">
                    Voir l'offre <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {promotions.map((promo, i) => (
          <div key={promo._id || promo.id || i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-secondary" : "w-1.5 bg-slate-300 dark:bg-slate-700"}`} />
        ))}
      </div>
    </section>
  );
}
