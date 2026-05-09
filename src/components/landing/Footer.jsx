// src/components/landing/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-8 overflow-hidden relative">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h2 className="text-4xl font-black text-primary italic tracking-tighter">EMENO</h2>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest leading-loose">
              L'excellence logistique gabonaise <br />
              au service de vos ambitions.
            </p>
          </div>

          {/* Links Group 1 */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Services</p>
            <ul className="space-y-4">
              <li><Link to="/tarifs" className="text-slate-400 text-xs font-bold hover:text-secondary transition-colors uppercase italic">Grille Tarifaire</Link></li>
              <li><a href="#" className="text-slate-400 text-xs font-bold hover:text-secondary transition-colors uppercase italic">Livraison Express</a></li>
              <li><a href="#" className="text-slate-400 text-xs font-bold hover:text-secondary transition-colors uppercase italic">E-commerce B2B</a></li>
            </ul>
          </div>

          {/* Links Group 2 */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Support</p>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 text-xs font-bold hover:text-secondary transition-colors uppercase italic">Centre d'aide</a></li>
              <li><a href="#" className="text-slate-400 text-xs font-bold hover:text-secondary transition-colors uppercase italic">Contact WhatsApp</a></li>
              <li><a href="#" className="text-slate-400 text-xs font-bold hover:text-secondary transition-colors uppercase italic">Conditions</a></li>
            </ul>
          </div>

          {/* Location Badge */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-black text-primary uppercase tracking-widest">Siège Social</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Libreville, Gabon</p>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
            © {currentYear} EMENO DELIVERY • TOUS DROITS RÉSERVÉS
          </p>
          <div className="flex gap-8">
            {["Instagram", "Facebook", "LinkedIn"].map(social => (
              <a key={social} href="#" className="text-[9px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest italic">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}