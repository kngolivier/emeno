// src/components/landing/Footer.jsx

import { Link } from "react-router-dom";
import { Send, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#050810] border-t border-slate-100 dark:border-white/5 pt-20 pb-12 px-6 lg:px-8 overflow-hidden relative transition-colors duration-500">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -z-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20">
          
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-primary dark:text-white italic tracking-tighter leading-none">
              EMENO<span className="text-secondary"></span>
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest leading-loose max-w-[200px]">
              L'excellence logistique gabonaise au service de vos ambitions quotidiennes.
            </p>
            <div className="flex gap-4 items-center">
               <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white border border-slate-100 dark:border-white/10">
                  <Phone size={16} />
               </div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contact Direct</p>
                  <p className="text-xs font-bold text-primary dark:text-white">+241 07 00 00 00</p>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-[0.4em] border-l-2 border-secondary pl-4">Services</p>
            <ul className="space-y-4">
              <FooterLink to="/tarifs">Grille Tarifaire</FooterLink>
              {/* <FooterLink to="/express">Livraison Express</FooterLink>
              <FooterLink to="/pro">E-commerce B2B</FooterLink> */}
              <FooterLink to="/tracking">Suivi de colis</FooterLink>
            </ul>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-[0.4em] border-l-2 border-secondary pl-4">Support</p>
            <ul className="space-y-4">
              <FooterLink to="/help">Centre d'aide</FooterLink>
              {/* <FooterLink to="/whatsapp">Contact WhatsApp</FooterLink> */}
              <FooterLink to="/legal/cgu">Conditions Générales</FooterLink>
              <FooterLink to="/legal/confidentialite">Politique de Confidentialité</FooterLink>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10 space-y-3">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                    <MapPin size={16} />
                  </div>
                  <p className="text-[9px] font-black text-primary dark:text-white uppercase tracking-widest">Siège Social</p>
               </div>
               <p className="text-[11px] font-bold text-slate-400 uppercase italic">
                 Libreville, Gabon <br /> Quartier Alibandeng
               </p>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] text-center">
            © {currentYear} EMENO Livraison • GABON
          </p>
          <div className="flex gap-8">
            {["Instagram", "Facebook", "LinkedIn"].map(social => (
              <a key={social} href={`#${social}`} className="text-[9px] font-black text-slate-400 dark:text-slate-600 hover:text-secondary transition-colors uppercase tracking-[0.2em] italic">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-slate-400 dark:text-slate-500 text-xs font-bold hover:text-secondary transition-all uppercase italic tracking-tight flex items-center gap-2 group">
        <span className="w-0 h-px bg-secondary transition-all group-hover:w-3" />
        {children}
      </Link>
    </li>
  );
}