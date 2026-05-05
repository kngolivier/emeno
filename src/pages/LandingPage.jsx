// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import PriceEstimator from "../components/landing/PriceEstimator";
import { ShieldCheck, Zap, BellRing, Star, CheckCircle2, ArrowRight } from "lucide-react";

// Variantes d'animation pour les éléments qui apparaissent au scroll
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
        <section className="max-w-7xl mx-auto pt-32 lg:pt-48 pb-20 px-8 flex flex-col lg:flex-row items-center gap-16">
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
                Disponible à Libreville, Akanda & Owendo
              </span>
            </div>
            
            <h1 className="text-6xl lg:text-[100px] font-black text-primary leading-[0.85] tracking-tighter">
              VOS COLIS <br />
              <span className="text-secondary italic underline decoration-8 decoration-secondary/20">SANS EFFORT.</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
              La solution logistique de <span className="text-primary font-bold">EMENO</span> qui redéfinit la rapidité au Gabon.
            </p>

            <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-200">
              <StatItem value="500+" label="Colis/Mois" />
              <StatItem value="15min" label="Ramassage" />
              <div className="flex flex-col">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-secondary text-secondary" />)}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Note moyenne</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 flex justify-center w-full relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge flottant décoratif */}
            <div className="absolute -top-6 -right-6 bg-primary text-white p-6 rounded-3xl shadow-2xl z-20 hidden lg:block animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <PriceEstimator />
          </motion.div>
        </section>

        {/* FEATURES SECTION AVEC HOVER EFFETS */}
        <section className="max-w-7xl mx-auto py-20 px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap size={32} />} 
              title="Ultra Rapide" 
              desc="Un livreur est à votre porte en moins de 15 minutes pour le retrait."
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldCheck size={32} />} 
              title="Code Sécurisé" 
              desc="Validation par code unique reçu par SMS à la réception."
              delay={0.2}
            />
            <FeatureCard 
              icon={<BellRing size={32} />} 
              title="Suivi Live" 
              desc="Visualisez le trajet exact de votre colis sur la carte."
              delay={0.3}
            />
          </div>
        </section>

        {/* NOUVELLE SECTION : CTA FINAL */}
        <section className="max-w-7xl mx-auto py-20 px-8">
          <div className="bg-primary rounded-[4rem] p-12 lg:p-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-colors" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
                  PRÊT À ENVOYER <br />VOTRE PREMIER COLIS ?
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Inscription gratuite en moins de 2 minutes</p>
              </div>
              
              <button 
                onClick={() => window.location.href = '/register'}
                className="group/btn relative px-12 py-6 bg-secondary text-white font-black uppercase tracking-[0.2em] rounded-[2rem] hover:shadow-2xl hover:shadow-secondary/50 transition-all flex items-center gap-4"
              >
                Commencer l'expérience
                <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER SIMPLE & CHIC */}
      <footer className="py-12 border-t border-slate-100 bg-white px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-6">
          <p className="font-black text-primary tracking-tighter">EMENO © 2026</p>
          <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Conditions</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="/tarifs" className="hover:text-primary transition-colors">Tarifs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="text-center lg:text-left">
      <p className="text-3xl font-black text-primary tracking-tighter">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
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
      className="p-12 bg-white rounded-[3rem] border border-slate-50 hover:border-secondary/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all group"
    >
      <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-[10deg]">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-primary mb-4 italic uppercase tracking-tighter group-hover:text-secondary transition-colors italic leading-none">{title}</h4>
      <p className="text-slate-400 text-sm font-bold leading-relaxed">{desc}</p>
    </motion.div>
  );
}