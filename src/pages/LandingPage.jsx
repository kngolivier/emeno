// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import nécessaire pour la navigation
import Navbar from "../components/landing/Navbar";
import PriceEstimator from "../components/landing/PriceEstimator";
import { 
  ShieldCheck, Zap, BellRing, 
  CheckCircle2, ArrowRight, Wallet, Map 
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-secondary selection:text-white overflow-x-hidden">
      {/* EFFET DE FOND (Glow) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full z-0" />

      <Navbar />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto pt-32 lg:pt-48 pb-20 px-8 flex flex-col lg:row items-center gap-16">
          <motion.div 
            className="flex-1 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-slate-100 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                Libreville • Akanda • Owendo
              </span>
            </div>
            
            <h1 className="text-6xl lg:text-[90px] font-black text-primary leading-[0.85] tracking-tighter">
              VOS COLIS <br />
              <span className="text-secondary italic underline decoration-8 decoration-secondary/20">SANS EFFORT.</span>
            </h1>
            
            <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
              La solution logistique de <span className="text-primary font-bold">EMENO</span> qui redéfinit la rapidité au Gabon.
            </p>
          </motion.div>

          <motion.div 
            className="flex-1 flex justify-center w-full relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -top-6 -right-6 bg-primary text-white p-5 rounded-3xl shadow-2xl z-20 hidden lg:block animate-bounce">
              <CheckCircle2 size={28} />
            </div>
            <PriceEstimator />
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className="max-w-7xl mx-auto py-16 px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap size={28} />} 
              title="Ultra Rapide" 
              desc="Un livreur est à votre porte en moins de 15 minutes pour le retrait."
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldCheck size={28} />} 
              title="Code Sécurisé" 
              desc="Validation par code unique reçu par SMS à la réception."
              delay={0.2}
            />
            <FeatureCard 
              icon={<BellRing size={28} />} 
              title="Suivi Live" 
              desc="Visualisez le trajet exact de votre colis sur la carte."
              delay={0.3}
            />
          </div>
        </section>

        {/* SECTION TARIFS - TAILLES AJUSTÉES */}
        <section className="max-w-7xl mx-auto py-10 px-8">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 lg:p-14 flex flex-col lg:flex-row items-center gap-12 shadow-soft">
            <div className="flex-1 space-y-5 text-center lg:text-left">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mx-auto lg:mx-0">
                <Wallet size={28} />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-primary leading-tight tracking-tighter">
                DES TARIFS <br/> <span className="text-secondary italic font-black">SANS SURPRISE.</span>
              </h2>
              <p className="text-slate-500 font-medium text-base leading-relaxed max-w-sm">
                Une tarification juste basée sur la distance réelle parcourue.
              </p>
              <Link 
                to="/tarifs"
                className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-widest text-[10px] group"
              >
                Consulter la grille complète 
                <div className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  <ArrowRight size={12} />
                </div>
              </Link>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
              <PriceCard zone="Libreville" prix="1 500" />
              <PriceCard zone="Akanda" prix="2 500" />
              <PriceCard zone="Owendo" prix="2 000" />
              <div className="bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-center border border-dashed border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Plus de zones</p>
                <p className="text-xs font-bold text-primary italic opacity-50">Bientôt...</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL - BOUTON ET TEXTE OPTIMISÉS */}
        <section className="max-w-7xl mx-auto py-20 px-8">
          <div className="bg-primary rounded-[3.5rem] p-10 lg:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left space-y-3">
                <h2 className="text-3xl lg:text-5xl font-black text-white leading-none tracking-tighter">
                  PRÊT À ENVOYER <br />VOTRE COLIS ?
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px]">Inscription gratuite • Moins de 2 minutes</p>
              </div>
              
              <Link 
                to="/register"
                className="group/btn flex-shrink-0 relative whitespace-nowrap px-8 py-5 bg-secondary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:shadow-xl hover:shadow-secondary/30 transition-all flex items-center gap-3"
              >
                Créer un compte
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER - NAVIGATION FIXÉE */}
      <footer className="py-14 border-t border-slate-100 bg-white px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="font-black text-primary tracking-tighter text-2xl italic">EMENO</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Logistique • Libreville, Gabon</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            <a href="#" className="hover:text-secondary transition-colors">Conditions</a>
            <a href="#" className="hover:text-secondary transition-colors">Support</a>
            <Link to="/tarifs" className="text-primary border-b-2 border-secondary/40 hover:border-secondary transition-all pb-1">
              Grille Tarifaire
            </Link>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[9px] font-black text-primary uppercase tracking-widest italic opacity-40">EMENO © 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// COMPOSANTS INTERNES
function PriceCard({ zone, prix }) {
  return (
    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-lg transition-all group cursor-default">
      <div className="flex items-center gap-2 mb-1">
        <Map size={10} className="text-secondary" />
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{zone}</p>
      </div>
      <p className="text-base font-black text-primary italic tracking-tighter group-hover:text-secondary transition-colors">
        {prix} <span className="text-[8px] not-italic text-slate-400 uppercase">FCFA</span>
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-10 bg-white rounded-[2.5rem] border border-slate-50 hover:border-secondary/10 hover:shadow-soft transition-all group"
    >
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h4 className="text-xl font-black text-primary mb-3 italic uppercase tracking-tighter group-hover:text-secondary transition-colors italic leading-none">{title}</h4>
      <p className="text-slate-400 text-[13px] font-bold leading-relaxed">{desc}</p>
    </motion.div>
  );
}