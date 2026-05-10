// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FeatureCard from "../components/landing/Feature";
import Footer from "../components/landing/Footer";
import { Zap, ShieldCheck, BellRing, ArrowRight, Wallet, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-primary-dark text-slate-600 dark:text-slate-200 selection:bg-secondary/30 selection:text-white transition-colors duration-500 overflow-x-hidden">
      {/* Background Glows Dynamiques */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 dark:bg-secondary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      <Navbar />

      <main className="relative z-10">
        {/* HERO SECTION avec filigrane moto */}
        <section className="relative">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
                <motion.div 
                    initial={{ x: "-20%", opacity: 0 }}
                    animate={{ x: "120%", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 -translate-y-1/2"
                >
                    <svg width="600" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-slate-400 dark:text-white">
                        <path d="M10 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM21 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM10 18H7a3 3 0 0 1-3-3l1-8c0-1.1.9-2 2-2h3l2 3h4l2 3m-1 4h-1.2" />
                    </svg>
                </motion.div>
            </div>
            <Hero />
        </section>

        {/* FEATURES SECTION */}
        <section className="max-w-7xl mx-auto py-16 lg:py-24 px-6 relative">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-5xl lg:text-huge text-primary dark:text-white">
              L'EXPÉRIENCE <span className="text-secondary">PREMIUM</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard 
              icon={<Zap size={32} />} 
              title="Vitesse Éclair" 
              desc="Ramassage en moins de 15 min partout à Libreville."
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldCheck size={32} />} 
              title="Sécurité Totale" 
              desc="Suivi sécurisé par code unique à chaque étape de livraison."
              delay={0.2}
            />
            <FeatureCard 
              icon={<BellRing size={32} />} 
              title="Notifications" 
              desc="Alertes SMS en temps réel pour l'expéditeur et le destinataire."
              delay={0.3}
            />
          </div>
        </section>

        {/* PRICING PREVIEW OPTIMISÉ MOBILE */}
        <section className="max-w-7xl mx-auto py-12 lg:py-16 px-4 lg:px-6">
          <div className="bg-slate-50 dark:bg-surface backdrop-blur-xl border border-slate-200 dark:border-border-glass rounded-[2.5rem] lg:rounded-4xl p-6 lg:p-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 shadow-xl dark:shadow-2xl transition-colors">
            
            <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary text-[10px] font-black uppercase tracking-widest">
                <Wallet size={14} /> Tarifs
              </div>
              <h2 className="text-4xl lg:text-7xl font-black text-primary dark:text-white leading-[0.9] tracking-tighter uppercase italic">
                PAYEZ <br className="hidden lg:block" /> <span className="text-secondary">LE JUSTE PRIX.</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-lg max-w-sm mx-auto lg:mx-0">
                Pas de frais cachés. Nos tarifs sont les plus compétitifs du marché gabonais.
              </p>
              <Link 
                to="/tarifs"
                className="inline-flex items-center gap-4 text-primary dark:text-white font-black uppercase tracking-widest text-[10px] lg:text-xs group"
              >
                Voir tous les tarifs 
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-secondary text-white dark:text-primary-dark rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg shadow-secondary/20">
                  <ArrowRight size={18} />
                </div>
              </Link>
            </div>
            
            {/* Grille 2 colonnes sur mobile pour gagner de la place */}
            <div className="flex-1 grid grid-cols-2 gap-3 lg:gap-4 w-full">
              <MiniPriceCard zone="Libreville" prix="1 500" />
              <MiniPriceCard zone="Akanda" prix="2 500" />
              <MiniPriceCard zone="Owendo" prix="2 000" />
              <div className="bg-white/40 dark:bg-white/5 rounded-2xl lg:rounded-3xl p-4 lg:p-8 flex flex-col justify-center border border-dashed border-slate-200 dark:border-white/10">
                <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bientôt</p>
                <p className="text-xs lg:text-lg font-bold text-secondary italic opacity-50">Ntoum</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-7xl mx-auto py-20 lg:py-32 px-6">
          <div className="bg-gradient-to-br from-secondary via-secondary to-emerald-600 rounded-[2.5rem] lg:rounded-4xl p-10 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-secondary/20">
             <div className="relative z-10 space-y-8 lg:space-y-10">
                <h2 className="text-4xl lg:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">
                  REJOIGNEZ <br/> LA RÉVOLUTION.
                </h2>
                <Link to="/register" className="inline-flex items-center gap-4 px-8 lg:px-12 py-5 lg:py-6 bg-white text-primary font-black uppercase tracking-widest text-xs lg:text-sm rounded-2xl hover:scale-105 transition-transform shadow-xl">
                   Démarrer maintenant
                   <ArrowRight size={18} />
                </Link>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function MiniPriceCard({ zone, prix }) {
  return (
    <div className="bg-white dark:bg-white/[0.03] backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 lg:p-8 border border-slate-100 dark:border-white/5 hover:border-secondary/30 transition-all group shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-4">
        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            <MapPin size={14} />
        </div>
        <p className="text-[8px] lg:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">{zone}</p>
      </div>
      <p className="text-xl lg:text-3xl font-black text-primary dark:text-white italic tracking-tighter">
        {prix} <span className="text-[10px] lg:text-[12px] not-italic text-secondary font-bold ml-1">CFA</span>
      </p>
    </div>
  );
}