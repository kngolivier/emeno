// src/components/landing/Feature.jsx

import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group h-full p-8 md:p-10 bg-white dark:bg-[#0B1120] border border-slate-100 dark:border-white/5 rounded-[2.5rem] hover:border-secondary/20 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden"
    >
      {/* Effet au survol */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 -z-0" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center text-primary dark:text-secondary mb-8 group-hover:bg-primary dark:group-hover:bg-secondary group-hover:text-white dark:group-hover:text-primary-dark group-hover:rotate-[10deg] transition-all duration-500">
          {icon}
        </div>
        
        <h4 className="text-xl md:text-2xl font-black text-primary dark:text-white mb-4 italic uppercase tracking-tighter leading-none">
          {title}
        </h4>
        
        <p className="text-slate-400 dark:text-slate-500 text-sm font-bold leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}