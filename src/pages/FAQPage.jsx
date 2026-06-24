import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SupportNav } from "../components/SupportNav"; // Si vous avez créé ce composant

export default function FAQPage() {
  const faqs = [
    {
      q: "Comment suivre mon colis en temps réel ?",
      a: "Accédez à votre tableau de bord ou utilisez la barre de recherche sur la page d'accueil avec votre numéro de suivi. Chaque étape, de la prise en charge à la livraison, y est notifiée."
    },
    {
      q: "Quels sont les délais de livraison à Libreville ?",
      a: "Pour le service express, la livraison est effectuée en moins de 2 heures. Pour les livraisons standard, comptez entre 4 à 24 heures selon la zone géographique."
    },
    {
      q: "Comment modifier l'adresse de livraison ?",
      a: "Contactez immédiatement notre support via WhatsApp avec votre numéro de commande. Une fois que le livreur a récupéré le colis, les modifications sont plus complexes à effectuer."
    },
    {
      q: "Que faire si mon colis est endommagé ?",
      a: "Veuillez refuser la livraison et prendre une photo du colis. Contactez ensuite notre service client sous 24h pour ouvrir un dossier de réclamation."
    },
    {
      q: "Quels modes de paiement sont acceptés ?",
      a: "Nous acceptons les paiements en espèces à la livraison, ainsi que via les services de Mobile Money (Airtel Money / Moov Money)."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-200 transition-colors duration-500 py-32 px-6">
      <main className="max-w-3xl mx-auto">
        <SupportNav />
        {/* Header style pricing */}
        <header className="text-center mb-20 space-y-6">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 mb-4">
            <HelpCircle size={14} className="text-secondary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Centre d'aide</span>
          </motion.div>
          <h1 className="text-4xl lg:text-7xl font-black text-primary dark:text-white italic tracking-tighter leading-none">
            QUESTIONS <span className="text-secondary">FRÉQUENTES.</span>
          </h1>
        </header>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <FAQAccordionItem key={index} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}

function FAQAccordionItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={false}
      className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden hover:border-secondary/30 transition-colors"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex justify-between items-center text-left"
      >
        <span className="font-black text-primary dark:text-white italic tracking-tight text-lg">
          {item.q}
        </span>
        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-secondary text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
           <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-white/5 pt-6">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}