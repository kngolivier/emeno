// src/components/landing/Footer.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0B1120] border-t border-slate-100 dark:border-white/5 pt-24 pb-12 px-8 overflow-hidden relative transition-colors duration-500">
      {/* Glow décoratif en arrière-plan */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -z-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Info & Vision */}
          <div className="col-span-1 md:col-span-1 space-y-8">
            <h2 className="text-5xl font-black text-primary dark:text-white italic tracking-tighter leading-none">
              EMENO<span className="text-secondary">.</span>
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-widest leading-loose max-w-[200px]">
              L'excellence logistique gabonaise au service de vos ambitions quotidiennes.
            </p>
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white border border-slate-100 dark:border-white/10">
                  <Phone size={16} />
               </div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contact Direct</p>
                  <p className="text-xs font-bold text-primary dark:text-white">+241 07 00 00 00</p>
               </div>
            </div>
          </div>

          {/* Navigation Services */}
          <div className="space-y-8">
            <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-[0.4em] border-l-2 border-secondary pl-4">Services</p>
            <ul className="space-y-5">
              <FooterLink to="/tarifs">Grille Tarifaire</FooterLink>
              <FooterLink to="/express">Livraison Express</FooterLink>
              <FooterLink to="/pro">E-commerce B2B</FooterLink>
              <FooterLink to="/tracking">Suivi de colis</FooterLink>
            </ul>
          </div>

          {/* Support & Légal */}
          <div className="space-y-8">
            <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-[0.4em] border-l-2 border-secondary pl-4">Support</p>
            <ul className="space-y-5">
              <FooterLink to="/help">Centre d'aide</FooterLink>
              <FooterLink to="/whatsapp">Contact WhatsApp</FooterLink>
              <FooterLink to="/terms">Conditions Générales</FooterLink>
              <FooterLink to="/privacy">Confidentialité</FooterLink>
            </ul>
          </div>

          {/* Localisation & Newsletter */}
          <div className="space-y-8 flex flex-col items-start md:items-end">
            <div className="w-full max-w-[280px] p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                    <MapPin size={16} />
                  </div>
                  <p className="text-[10px] font-black text-primary dark:text-white uppercase tracking-widest">Siège Social</p>
               </div>
               <p className="text-[11px] font-bold text-slate-400 uppercase italic">
                  Libreville, Gabon <br />
                  Quartier Louis, Imm. Emeno
               </p>
            </div>
            
            {/* Petit CTA Newsletter discret */}
            <div className="relative w-full max-w-[280px]">
              <input 
                type="text" 
                placeholder="VOTRE EMAIL" 
                className="w-full bg-transparent border-b-2 border-slate-100 dark:border-white/10 py-3 text-[10px] font-black uppercase tracking-widest focus:border-secondary outline-none transition-colors dark:text-white"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-secondary hover:scale-110 transition-transform">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Barre de Copyright Finale */}
        <div className="pt-12 border-t border-slate-50 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.5em] text-center md:text-left">
            © {currentYear} EMENO DELIVERY SYSTEM • DEVELOPED IN GABON
          </p>
          
          <div className="flex gap-10">
            {["Instagram", "Facebook", "LinkedIn"].map(social => (
              <a 
                key={social} 
                href={`#${social}`} 
                className="group relative text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-colors uppercase tracking-[0.2em] italic"
              >
                {social}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Composant interne pour les liens du footer afin d'éviter la répétition de classes
function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-slate-400 dark:text-slate-500 text-xs font-bold hover:text-secondary dark:hover:text-secondary transition-all uppercase italic tracking-tight flex items-center gap-2 group"
      >
        <span className="w-0 h-px bg-secondary transition-all group-hover:w-3" />
        {children}
      </Link>
    </li>
  );
}