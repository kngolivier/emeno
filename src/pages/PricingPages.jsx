// src/pages/PricingPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import { HelpCircle, Phone, Info, Loader2 } from "lucide-react";
import { fetchPricing } from "../api/pricing.api";

export default function PricingPage() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPrices = async () => {
      try {
        // On récupère une large plage de données pour s'assurer d'avoir tous les tarifs
        const response = await fetchPricing(1, 100);
        
        // Extraction des données selon la structure habituelle de ton API
        const allData = response.data?.data || response.data || [];

        // FILTRAGE : On ne garde que les tarifs où isActive est strictement true
        const activePrices = allData.filter(zone => zone.isActive === true);
        
        setPricingData(activePrices);
      } catch (error) {
        console.error("Erreur lors de la récupération des tarifs:", error);
      } finally {
        setLoading(false);
      }
    };
    getPrices();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-secondary selection:text-white">
      <Navbar />

      <main className="pt-32 pb-20 px-8 relative z-10">
        {/* EFFETS DE FOND */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full -z-10" />

        {/* HEADER SECTION */}
        <section className="max-w-4xl mx-auto text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black text-primary tracking-tighter mb-6"
          >
            NOS <span className="text-secondary italic">TARIFS</span>
          </motion.h1>
          <p className="text-slate-500 font-medium text-lg italic">
            Consultez nos zones de livraison actives et nos tarifs de base en temps réel.
          </p>
        </section>

        {/* TABLEAU DES TARIFS */}
        <section className="max-w-5xl mx-auto mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-8 font-black uppercase tracking-widest text-[10px]">Zone de Départ</th>
                    <th className="p-8 font-black uppercase tracking-widest text-[10px]">Zone d'Arrivée</th>
                    <th className="p-8 font-black uppercase tracking-widest text-[10px]">Type de Calcul</th>
                    <th className="p-8 font-black uppercase tracking-widest text-[10px] text-right">Prix de Base</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Skeleton Loading pendant le fetch
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse border-b border-slate-50">
                        <td colSpan="4" className="p-8">
                          <div className="h-8 bg-slate-100 rounded-2xl w-full" />
                        </td>
                      </tr>
                    ))
                  ) : pricingData.length > 0 ? (
                    pricingData.map((zone) => (
                      <tr key={zone._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                        <td className="p-8 font-bold text-primary italic uppercase tracking-tighter">{zone.from}</td>
                        <td className="p-8 font-bold text-primary italic uppercase tracking-tighter">{zone.to}</td>
                        <td className="p-8">
                          <span className="px-4 py-1.5 bg-slate-100 text-[10px] font-black rounded-full text-slate-500 uppercase tracking-[0.1em]">
                            {zone.pricingType === 'COMMUNE' ? 'Forfait Commune' : 'Par Distance'}
                          </span>
                        </td>
                        <td className="p-8 text-right">
                          <span className="text-2xl font-black text-secondary">
                            {zone.basePrice?.toLocaleString('fr-FR')}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase">FCFA</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300">
                          <Info size={48} />
                          <p className="font-bold italic uppercase tracking-widest text-sm">Aucun tarif actif pour le moment</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-slate-50/50 flex items-center gap-4 text-slate-500 text-[11px] font-bold italic uppercase tracking-wider">
              <Info size={16} className="text-secondary shrink-0" />
              Note : Ces tarifs concernent les colis standards. Les livraisons hors-format peuvent faire l'objet d'un supplément.
            </div>
          </motion.div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
             <HelpCircle className="text-secondary mb-4" size={40} />
             <h2 className="text-3xl font-black text-primary tracking-tighter uppercase italic">Des questions sur nos prix ?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FAQItem 
              question="Le prix change-t-il selon l'heure ?"
              answer="Nos tarifs de base sont fixes. Toutefois, une majoration de 15% s'applique pour les livraisons de nuit (après 20h) ou les jours fériés."
            />
            <FAQItem 
              question="Comment payer ma course ?"
              answer="Nous acceptons les paiements en espèces à la livraison, ainsi que les solutions Mobile Money (Airtel Money, Moov Money)."
            />
            <FAQItem 
              question="Proposez-vous des tarifs entreprises ?"
              answer="Oui ! Pour les e-commerçants et les entreprises avec un volume régulier, nous avons des contrats avec facturation mensuelle."
            />
            <FAQItem 
              question="Et si le destinataire est absent ?"
              answer="En cas d'absence, le colis est retourné à notre centre de tri. Une seconde tentative peut être programmée avec des frais de livraison réduits."
            />
          </div>
        </section>

        {/* WHATSAPP CTA */}
        <section className="max-w-5xl mx-auto mt-32">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-primary rounded-[4rem] p-12 lg:p-20 relative overflow-hidden text-center md:text-left"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div>
                   <h3 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter leading-tight uppercase mb-4">
                     Besoin d'un <br/> transport spécial ?
                   </h3>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Réponse instantanée par nos conseillers</p>
                </div>
                <button className="px-12 py-6 bg-secondary text-white font-black uppercase tracking-widest rounded-3xl hover:shadow-[0_20px_40px_rgba(244,195,11,0.3)] transition-all flex items-center gap-4">
                  <Phone size={20} /> WhatsApp Business
                </button>
             </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-10 bg-white rounded-[2.5rem] border border-slate-50 hover:shadow-xl transition-all group"
    >
      <h4 className="font-black text-primary text-xs uppercase tracking-widest mb-4 flex items-center gap-3">
        <span className="w-2 h-2 bg-secondary rounded-full" /> {question}
      </h4>
      <p className="text-slate-400 text-sm font-medium leading-relaxed">{answer}</p>
    </motion.div>
  );
}