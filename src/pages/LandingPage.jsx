// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FeatureCard from "../components/landing/Feature";
import Footer from "../components/landing/Footer";
import { Zap, ShieldCheck, BellRing, ArrowRight, Wallet, MapPin, Star } from "lucide-react";
import ServicesCarousel from "../components/services/ServicesCarousel";
import PartnersCarousel from "../components/landing/PartnersCarousel";
import CTASection from "../components/landing/CTASection";
import { fetchRandomPricing } from "../api/pricing.api"; // Créez cette fonction dans votre fichier API
import { useEffect, useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();

  const [randomPrices, setRandomPrices] = useState([]);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const response = await fetchRandomPricing();
        setRandomPrices(response?.data?.data || response?.data || response);
      } catch (err) {
        console.error("Erreur chargement tarifs", err);
      }
    };
    loadPrices();
  }, []);
  // Animation de groupe pour les éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden">
      
      {/* Background subtil - Optimisé */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <section className="min-h-[85vh] flex items-center pt-20">
            <Hero />
        </section>

        <section className="max-w-7xl mx-auto py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-4xl font-black text-primary dark:text-white italic">
              Nos Services
            </h2>
          </motion.div>

          <ServicesCarousel />
        </section>

        {/* SECTION FEATURES */}
        <section className="max-w-7xl mx-auto py-24 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 dark:bg-white/5 rounded-full border border-primary/10 dark:border-white/10 mb-4">
                <Star size={12} className="text-secondary fill-secondary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-white">Services Premium</span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-black text-primary dark:text-white italic tracking-tighter">
              L'EXPÉRIENCE <span className="text-secondary">EMENO.</span>
            </h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard icon={<Zap size={32} strokeWidth={1.5} />} title="Vitesse Éclair" desc="Ramassage rapide partout à Libreville." delay={0.1} />
            <FeatureCard icon={<ShieldCheck size={32} strokeWidth={1.5} />} title="Sécurité Totale" desc="Suivi sécurisé par code unique (OTP)." delay={0.2} />
            <FeatureCard icon={<BellRing size={32} strokeWidth={1.5} />} title="Alertes Live" desc="Notifications en temps réel." delay={0.3} />
          </motion.div>
        </section>

        <PartnersCarousel />
        <div className="mt-8 flex justify-center">
            <button 
              onClick={() => navigate("/partenaires")}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#071120] border border-slate-200 dark:border-white/10 rounded-full text-sm font-bold text-slate-600 dark:text-white hover:border-secondary hover:text-secondary transition-all"
            >
              Voir tous les partenaires <ArrowRight size={16} />
            </button>
          </div>

        {/* SECTION PRICING TEASER */}
        <section className="max-w-7xl mx-auto py-12 px-6">
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-[3rem] p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="text-secondary font-black text-[10px] uppercase tracking-[0.2em]">Tarification</span>
              <h2 className="text-4xl lg:text-6xl font-black text-primary dark:text-white italic tracking-tighter">PAYEZ JUSTE.</h2>
              <p className="text-slate-500 max-w-sm">Consultez nos tarifs par zone en toute transparence.</p>
              <Link to="/tarifs" className="inline-flex items-center gap-3 text-primary dark:text-white font-bold hover:gap-5 transition-all">
                Voir la grille complète <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {randomPrices.length > 0 ? (
                randomPrices.map((p) => (
                  <MiniPriceCard 
                    key={p._id} 
                    zone={`${p.from.name} ➔ ${p.to.name}`} 
                    prix={p.basePrice?.toLocaleString()} 
                  />
                ))
              ) : (
                // Skeleton ou fallback si chargement
                <>
                  <div className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl h-24" />
                  <div className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl h-24" />
                </>
              )}
            </div>
          </div>
        </section>
        {/* NOUVEAU CTA AJOUTÉ ICI */}
        <CTASection onNavigate={() => navigate("/login")} />

        <Footer />
      </main>
    </div>
  );
}

function MiniPriceCard({ zone, prix }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{zone}</p>
      <p className="text-xl font-black text-primary dark:text-white">{prix} <span className="text-[10px] text-secondary">FCFA</span></p>
    </div>
  );
}