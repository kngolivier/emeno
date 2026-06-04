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
    <div className="min-h-screen bg-slate-50 dark:bg-[#050810] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <SupportNav />
        <h1 className="text-4xl font-black italic text-primary dark:text-white mb-8">FAQ</h1>
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <FAQItem key={index} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-center text-left"
      >
        <span className="font-bold text-primary dark:text-white">{question}</span>
        <ChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}