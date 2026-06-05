// FILE: EMENO/src/pages/SupportPage.jsx

import { Mail, MessageCircle, HelpCircle, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/Settings/SettingsContext";
import Navbar from "../components/landing/Navbar";

export default function SupportPage() {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050810] py-16 px-6 transition-colors duration-500">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black italic text-primary dark:text-white mb-6">Besoin d'aide ?</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Notre équipe est là pour vous accompagner. Consultez notre FAQ ou contactez-nous directement.
          </p>
        </div>

        {/* Grille de catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link to="/faq">
            <SupportCard icon={HelpCircle} title="FAQ & Aide" desc="Consultez nos questions fréquentes." />
          </Link>
          <Link to="/guides">
            <SupportCard icon={FileText} title="Guides d'utilisation" desc="Apprenez à utiliser EMENO." />
          </Link>
          <a href={`https://wa.me/${settings.contact?.whatsapp}`} target="_blank" rel="noopener noreferrer">
            <SupportCard icon={MessageCircle} title="Support WhatsApp" desc="Discutez en direct avec un agent." />
          </a>
          <a href={`mailto:${settings.contact?.email}`} target="_blank" rel="noopener noreferrer">
            <SupportCard icon={Mail} title="Email" desc="Envoyez-nous un message détaillé." />
          </a>
        </div>

        {/* Contact direct section */}
        <div className="bg-white dark:bg-[#0B1120] rounded-[2rem] p-8 md:p-12 border border-slate-100 dark:border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-black italic text-primary dark:text-white mb-2">Besoin d'une réponse rapide ?</h3>
            <p className="text-sm text-slate-500">Nos agents répondent du Lundi au Samedi, de 8h à 18h.</p>
          </div>
          <a 
            href={`https://wa.me/${settings.contact?.whatsapp}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-secondary text-white font-black rounded-2xl hover:bg-secondary/90 transition-all active:scale-95"
          >
            Contacter WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function SupportCard({ icon: Icon, title, desc }) {
  return (
    <div className="group p-6 bg-white dark:bg-[#0B1120] rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-secondary transition-all cursor-pointer flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-black text-primary dark:text-white">{title}</h3>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-300 group-hover:text-secondary transition-colors" />
    </div>
  );
}