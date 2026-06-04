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
    // Suppression des classes bg-*, border-*, et py-* pour enlever la "bande"
    <div className="w-full overflow-hidden py-10">
      <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
        Ils nous font confiance
      </p>
      
      {/* Container qui force la largeur totale pour éviter le démarrage au milieu */}
      <div className="flex w-full overflow-hidden">
        <motion.div
          className="flex gap-16 md:gap-24 items-center px-8"
          // Animation de déplacement horizontal
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            duration: 30, // Légèrement plus lent pour plus d'élégance
            ease: "linear" 
          }}
        >
          {/* Doublage de la liste pour l'effet de boucle infinie */}
          {[...partners, ...partners].map((partner, index) => (
            <div 
              key={`${partner._id}-${index}`} 
              className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <img 
                src={partner.logo?.url} 
                alt={partner.name} 
                className="h-10 md:h-14 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}