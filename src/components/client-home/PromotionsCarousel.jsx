// FILE: src/components/client-home/PromotionsCarousel.jsx

import { useEffect, useState } from "react";
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
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetchActivePromotionsList();
        if (mounted) setPromotions(unwrapPromotions(res));
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, []);

  const openPromo = (promo) => {
    navigate(`/client/promotions/detail/${promo._id}`);
  };

  if (loading) {
    return (
      <section className="px-4">
        <div className="h-44 rounded-[2rem] bg-slate-100 dark:bg-white/5 animate-pulse" />
      </section>
    );
  }

  if (!promotions.length) return null;

  return (
    <section>
      <div className="flex justify-between items-center mb-5 px-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            Promotions
          </p>
          <h2 className="text-2xl font-black italic">
            Offres exclusives
          </h2>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 px-4">
        {promotions.map((promo, i) => {
          const Icon = PROMOTION_ICONS[promo.icon] || Gift;
          const gradient =
            promo.gradient || "from-emerald-500 to-green-600";

          return (
            <div
              key={promo._id || i}
              className="snap-center shrink-0 w-[85vw] md:w-[360px]"
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => openPromo(promo)}
                className={`relative h-[280px] rounded-[2rem] overflow-hidden bg-gradient-to-br ${gradient} p-6 text-white cursor-pointer`}
              >
                <div className="relative z-10 flex flex-col h-full">
                  <span className="w-fit px-3 py-1 rounded-full bg-white/20 text-[9px] font-black uppercase">
                    {promo.badge || "Offre"}
                  </span>

                  <div className="mt-5 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-2xl font-black">
                    {promo.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/80 line-clamp-3">
                    {promo.description}
                  </p>

                  <button className="mt-auto flex items-center gap-2 text-sm font-bold">
                    Voir détails <ArrowRight size={16} />
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