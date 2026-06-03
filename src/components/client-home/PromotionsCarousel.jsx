// FILE: src/components/client-home/PromotionsCarousel.jsx

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { fetchActivePromotionsList } from "../../api/promotions.api";
import { PROMOTION_ICONS } from "../../utils/promotionIcons";

const unwrapPromotions = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.promotions)) return response.data.promotions;
  return [];
};

export default function PromotionsCarousel() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

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

  const handleClick = (promo) => {
    navigate(`/promotions/detail/${promo._id}`);
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
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            Promotions
          </p>
          <h2 className="text-2xl md:text-4xl font-black italic text-primary dark:text-white">
            Offres exclusives
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 px-4"
      >
        {promotions.map((promo, index) => {
          const Icon = PROMOTION_ICONS[promo.icon] || Gift;
          const gradient =
            promo.gradient || "from-emerald-500 to-green-600";

          return (
            <div
              key={promo._id || index}
              className="snap-center shrink-0 w-[85vw] md:w-[360px]"
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClick(promo)}
                className={`relative h-full min-h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br ${gradient} p-6 shadow-xl text-white cursor-pointer`}
              >
                <div className="absolute top-[-40px] right-[-40px] w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 rounded-full bg-black/10" />

                <div className="relative z-10 h-full flex flex-col">
                  <span className="inline-flex w-fit px-3 py-1 rounded-full bg-white/20 text-[9px] font-black uppercase">
                    {promo.badge || "Offre spéciale"}
                  </span>

                  <div className="mt-5 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-2xl font-black italic">
                    {promo.title}
                  </h3>

                  <p className="mt-3 text-sm text-white/80 line-clamp-3">
                    {promo.description}
                  </p>

                  <button className="mt-auto flex items-center justify-center gap-2 px-5 h-11 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-bold">
                    Voir l’offre <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}