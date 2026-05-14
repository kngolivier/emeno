// src/pages/LandingPage.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import FeatureCard from "../components/landing/Feature";
import Footer from "../components/landing/Footer";
import { Zap, ShieldCheck, BellRing, ArrowRight, Wallet, MapPin, Star } from "lucide-react";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-200 selection:bg-secondary/30 selection:text-white transition-colors duration-500 overflow-x-hidden">
      
      {/* --- BACKGROUND GLOWS (Immobiles pour performance) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 dark:bg-secondary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10">
        
        {/* --- SECTION HERO --- */}
        <section className="relative min-h-[90vh] flex items-center">
            {/* Filigrane Moto Animé */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
                <motion.div 
                    initial={{ x: "-20%", opacity: 0 }}
                    animate={{ x: "120%", opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 -translate-y-1/2"
                >
                    <svg width="600" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-primary dark:text-white">
                        <path d="M10 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM21 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM10 18H7a3 3 0 0 1-3-3l1-8c0-1.1.9-2 2-2h3l2 3h4l2 3m-1 4h-1.2" />
                    </svg>
                </motion.div>
            </div>
            <Hero />
            
            {/* Indicateur de Scroll */}
            <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-secondary to-transparent" />
            </motion.div>
        </section>

        {/* --- SECTION FEATURES --- */}
        <section className="max-w-7xl mx-auto py-20 lg:py-32 px-6">
          <div className="text-center mb-16 lg:mb-24 space-y-4">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-white/5 rounded-full border border-primary/10 dark:border-white/10"
            >
                <Star size={12} className="text-secondary fill-secondary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary dark:text-white">Services de Luxe</span>
            </motion.div>
            <h2 className="text-5xl lg:text-huge font-black text-primary dark:text-white italic tracking-tighter leading-none">
              L'EXPÉRIENCE <span className="text-secondary">PREMIUM.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap size={32} strokeWidth={1.5} />} 
              title="Vitesse Éclair" 
              desc="Ramassage en moins de 15 min partout à Libreville et ses environs."
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldCheck size={32} strokeWidth={1.5} />} 
              title="Sécurité Totale" 
              desc="Suivi sécurisé par code unique (OTP) à chaque étape de la livraison."
              delay={0.2}
            />
            <FeatureCard 
              icon={<BellRing size={32} strokeWidth={1.5} />} 
              title="Alertes Live" 
              desc="Notifications SMS et Push en temps réel pour une visibilité totale."
              delay={0.3}
            />
          </div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section className="max-w-7xl mx-auto py-16 lg:py-24 px-4 lg:px-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-[3.5rem] p-8 lg:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-2xl transition-all">
            
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-secondary/10 rounded-2xl text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
                <Wallet size={16} /> Tarification Transparente
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-primary dark:text-white leading-[0.9] tracking-tighter uppercase italic">
                PAYEZ <br className="hidden lg:block" /> <span className="text-secondary">LE JUSTE PRIX.</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-lg max-w-sm mx-auto lg:mx-0 leading-relaxed">
                Pas de surprises à la livraison. Nos tarifs sont fixes et consultables en un clic selon votre zone.
              </p>
              <Link 
                to="/tarifs"
                className="inline-flex items-center gap-5 text-primary dark:text-white font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs group"
              >
                Consulter la grille
                <div className="w-12 h-12 bg-primary dark:bg-secondary text-white dark:text-primary-dark rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-primary-dark group-hover:translate-x-2 transition-all shadow-xl">
                  <ArrowRight size={20} strokeWidth={3} />
                </div>
              </Link>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              <MiniPriceCard zone="Libreville" prix="1 500" />
              <MiniPriceCard zone="Akanda" prix="2 500" />
              <MiniPriceCard zone="Owendo" prix="2 000" />
              <div className="bg-white/40 dark:bg-white/5 rounded-3xl p-6 lg:p-10 flex flex-col justify-center border-2 border-dashed border-slate-200 dark:border-white/10 group hover:border-secondary/50 transition-colors">
                <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bientôt</p>
                <p className="text-sm lg:text-xl font-bold text-secondary italic opacity-40 group-hover:opacity-100 transition-opacity">Ntoum & Franceville</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION FINALE --- */}
        <section className="max-w-7xl mx-auto py-20 lg:py-40 px-6">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-primary via-[#002D15] to-primary dark:from-secondary dark:via-emerald-500 dark:to-secondary rounded-[4rem] p-12 lg:p-32 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,68,31,0.3)]"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
             
             <div className="relative z-10 space-y-10 lg:space-y-14">
                <h2 className="text-5xl lg:text-9xl font-black text-white tracking-tighter leading-none uppercase italic">
                  REJOIGNEZ <br/> LA RÉVOLUTION.
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link to="/register" className="w-full sm:w-auto px-12 py-6 bg-white text-primary font-black uppercase tracking-[0.2em] text-xs lg:text-sm rounded-[2rem] hover:bg-secondary hover:text-white transition-all shadow-2xl active:scale-95">
                       Démarrer maintenant
                    </Link>
                    <Link to="/contact" className="w-full sm:w-auto px-12 py-6 bg-transparent border-2 border-white/20 text-white font-black uppercase tracking-[0.2em] text-xs lg:text-sm rounded-[2rem] hover:bg-white/10 transition-all active:scale-95">
                       Nous contacter
                    </Link>
                </div>
             </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function MiniPriceCard({ zone, prix }) {
  return (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-slate-800/40 backdrop-blur-md rounded-[2rem] p-6 lg:p-10 border border-slate-100 dark:border-white/5 hover:border-secondary/40 transition-all group shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <MapPin size={18} />
        </div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{zone}</p>
      </div>
      <p className="text-3xl lg:text-4xl font-black text-primary dark:text-white italic tracking-tighter">
        {prix} <span className="text-xs not-italic text-secondary font-bold ml-1 uppercase">FCFA</span>
      </p>
    </motion.div>
  );
}