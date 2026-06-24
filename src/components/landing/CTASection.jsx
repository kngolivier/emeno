import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";

export default function CTASection({ onNavigate }) {
  return (
    <section className="px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-[#1e2a44] dark:from-secondary dark:to-primary rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
      >
        {/* Effet décoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl lg:text-6xl font-black text-white italic tracking-tighter">
            PRÊT À LANCER VOTRE PREMIÈRE COURSE ?
          </h2>
          <p className="text-white/70 font-medium">
            Rejoignez le réseau d'utilisateurs satisfaits et simplifiez vos livraisons dès aujourd'hui.
          </p>
          
          <button 
            onClick={onNavigate}
            className="group inline-flex items-center gap-3 px-8 py-5 bg-white text-primary rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] hover:scale-105 transition-all active:scale-95 shadow-2xl"
          >
            <User size={16} />
            Accéder à mon espace
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}