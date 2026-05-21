import { motion } from "framer-motion";

export default function ServiceCard({ title, desc, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#071120] p-5 md:p-6">
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-secondary/10 via-transparent to-secondary/10" />
      <div className="relative z-10">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary/10 border border-secondary/10 flex items-center justify-center">
          <Icon size={22} className="text-secondary" />
        </div>
        <h3 className="mt-5 text-base md:text-lg font-black uppercase italic text-primary dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-white/40">{desc}</p>
      </div>
    </motion.div>
  );
}