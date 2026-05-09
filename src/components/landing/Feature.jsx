// src/components/landing/Feature.jsx
import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group p-10 bg-white rounded-[3rem] border border-slate-100 hover:border-transparent hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 relative overflow-hidden"
    >
      {/* Effet au survol : un cercle discret en fond */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 -z-0" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white group-hover:rotate-[10deg] transition-all duration-500">
          {icon}
        </div>
        
        <h4 className="text-2xl font-black text-primary mb-4 italic uppercase tracking-tighter leading-none">
          {title}
        </h4>
        
        <p className="text-slate-400 text-sm font-bold leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}