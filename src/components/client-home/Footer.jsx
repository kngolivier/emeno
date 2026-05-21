// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="py-8 px-8 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#071120] transition-colors">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <p>© 2026 EMENO. Tous droits réservés.</p>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-secondary transition-colors">Support</a>
          <a href="#" className="hover:text-secondary transition-colors">Conditions</a>
          <a href="#" className="hover:text-secondary transition-colors">Confidentialité</a>
        </div>
      </div>
    </footer>
  );
}