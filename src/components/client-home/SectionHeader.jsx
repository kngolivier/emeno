export default function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-secondary" />}
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-white/30">
          {subtitle}
        </span>
      </div>
      <h2 className="mt-1 text-2xl md:text-3xl font-black italic uppercase text-primary dark:text-white leading-none">
        {title}
      </h2>
    </div>
  );
}