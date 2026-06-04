// src/components/landing/PartnersCarousel.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchPartners } from "../../api/partners.api";

export default function PartnersCarousel() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const res = await fetchPartners({ status: 'ACTIVE', limit: 10 });
        setPartners(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Erreur chargement partenaires:", err);
      }
    };
    loadPartners();
  }, []);

  if (!partners.length) return null;

  return (
    <div className="w-full overflow-hidden py-10 bg-slate-50/50 dark:bg-white/5 border-y border-slate-100 dark:border-white/5">
      <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
        Ils nous font confiance
      </p>
      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {/* Doublage de la liste pour l'effet de boucle infinie */}
          {[...partners, ...partners].map((partner, index) => (
            <div key={`${partner._id}-${index}`} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500">
              <img 
                src={partner.logo?.url} 
                alt={partner.name} 
                className="h-12 md:h-16 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}