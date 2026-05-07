// src/pages/PricingPage.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import { 
  HelpCircle, Phone, Info, MapPin, 
  LucideArrowRightLeft, Wallet // Utilisation de ArrowsLeftRight pour la bidirectionnalité
} from "lucide-react";
import { fetchPricing } from "../api/pricing.api";

export default function PricingPage() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPrices = async () => {
      try {
        const response = await fetchPricing({ page: 1, limit: 100, status: 'true' });
        const allData = response.data?.data || response.data || [];
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
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-secondary selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="pt-32 pb-20 px-6 lg:px-8 relative z-10">
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full -z-10" />

        {/* HEADER SECTION */}
        <section className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-8xl font-black text-primary tracking-tighter mb-6 uppercase"
          >
            NOS <span className="text-secondary italic font-black">TARIFS</span>
          </motion.h1>
          <p className="text-slate-500 font-bold text-sm lg:text-lg italic uppercase tracking-widest opacity-70 px-4">
            Zones actives et tarifs de base • Trajets aller-retour identiques.
          </p>
        </section>

        {/* SECTION DES TARIFS */}
        <section className="max-w-6xl mx-auto mb-32">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-white border border-slate-100 rounded-[2.5rem]" />
                ))}
             </div>
          ) : pricingData.length > 0 ? (
            <>
              {/* VUE MOBILE : Cartes empilées */}
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {pricingData.map((zone) => (
                  <div key={zone._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm active:scale-95 transition-transform">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-slate-50 rounded-2xl text-primary">
                        <MapPin size={20} />
                      </div>
                      <span className="px-4 py-1.5 bg-secondary/10 text-[9px] font-black rounded-full text-secondary uppercase tracking-widest">
                        {zone.pricingType === 'COMMUNE' ? 'Forfait Commune' : 'Par Distance'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1 mb-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trajet (Bidirectionnel)</p>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-primary italic uppercase tracking-tighter">{zone.from}</h3>
                        <LucideArrowRightLeft size={18} className="text-secondary shrink-0" />
                        <h3 className="text-xl font-black text-primary italic uppercase tracking-tighter">{zone.to}</h3>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix de base</p>
                      <p className="text-2xl font-black text-secondary">
                        {zone.basePrice?.toLocaleString('fr-FR')} <span className="text-xs font-bold text-slate-300 ml-1 italic">FCFA</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* VUE DESKTOP : Tableau optimisé */}
              <div className="hidden lg:block bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-10 font-black uppercase tracking-[0.2em] text-[10px] w-1/2">Zones Desservies (Aller-Retour)</th>
                      <th className="p-10 font-black uppercase tracking-[0.2em] text-[10px]">Méthode</th>
                      <th className="p-10 font-black uppercase tracking-[0.2em] text-[10px] text-right">Prix de Base</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingData.map((zone) => (
                      <tr key={zone._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                        <td className="p-10">
                          <div className="flex items-center gap-6">
                             <span className="font-black text-primary italic uppercase tracking-tighter text-2xl">{zone.from}</span>
                             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-secondary group-hover:scale-110 transition-transform">
                                <LucideArrowRightLeft size={20} />
                             </div>
                             <span className="font-black text-primary italic uppercase tracking-tighter text-2xl">{zone.to}</span>
                          </div>
                        </td>
                        <td className="p-10">
                          <span className="px-5 py-2 bg-slate-100 text-[10px] font-black rounded-full text-slate-500 uppercase tracking-widest">
                            {zone.pricingType === 'COMMUNE' ? 'Forfait' : 'Distance'}
                          </span>
                        </td>
                        <td className="p-10 text-right">
                          <span className="text-3xl font-black text-secondary">
                            {zone.basePrice?.toLocaleString('fr-FR')}
                          </span>
                          <span className="text-xs font-black text-slate-300 ml-3 uppercase italic">FCFA</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
               <Info size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="font-black italic uppercase tracking-widest text-slate-400">Aucun tarif actif actuellement</p>
            </div>
          )}
          
          <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 text-[10px] font-bold italic uppercase tracking-[0.15em] px-6 text-center">
            <Info size={14} className="text-secondary shrink-0" />
            Note : Les tarifs A vers B sont identiques aux trajets B vers A.
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-5xl mx-auto mb-20">
          <div className="flex flex-col items-center mb-12 text-center">
             <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-secondary mb-6 border border-slate-50">
               <HelpCircle size={32} />
             </div>
             <h2 className="text-3xl lg:text-4xl font-black text-primary tracking-tighter uppercase italic">Questions fréquentes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FAQItem 
              question="Le prix change-t-il selon l'heure ?"
              answer="Nos tarifs sont fixes de 7h à 20h. Une majoration de nuit de 15% s'applique après 20h pour assurer la sécurité de nos coursiers."
            />
            <FAQItem 
              question="Quels sont les modes de paiement ?"
              answer="Nous acceptons le paiement en espèces à la livraison, ainsi que Airtel Money et Moov Money pour plus de simplicité."
            />
          </div>
        </section>

        {/* WHATSAPP CTA */}
        <section className="max-w-6xl mx-auto px-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-primary rounded-[3.5rem] p-10 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10 text-center md:text-left">
                <h3 className="text-3xl lg:text-5xl font-black text-white italic tracking-tighter leading-none uppercase mb-4">
                  Transport <br/> sur-mesure ?
                </h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Disponible 7j/7 pour vos demandes spécifiques</p>
             </div>
             
             <button className="group relative z-10 whitespace-nowrap px-10 py-5 bg-secondary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:shadow-2xl hover:shadow-secondary/40 transition-all flex items-center gap-3 active:scale-95">
                <Phone size={18} /> Discuter sur WhatsApp
             </button>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-12 mb-16">
            <div className="flex flex-col items-center md:items-start">
              <p className="font-black text-primary tracking-tighter text-3xl italic mb-3">EMENO</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center md:text-left leading-relaxed">
                Logistique nouvelle génération <br/> au cœur du Gabon.
              </p>
            </div>

            <div className="flex justify-center gap-10">
              <div className="flex flex-col gap-4 text-center md:text-left">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Navigation</p>
                <Link to="/" className="text-[10px] font-bold text-slate-400 uppercase hover:text-secondary transition-colors">Accueil</Link>
                <Link to="/tarifs" className="text-[10px] font-bold text-primary uppercase border-b border-secondary w-fit mx-auto md:mx-0">Tarifs</Link>
              </div>
              <div className="flex flex-col gap-4 text-center md:text-left">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Légal</p>
                <Link to="#" className="text-[10px] font-bold text-slate-400 uppercase hover:text-secondary transition-colors">CGU</Link>
                <Link to="#" className="text-[10px] font-bold text-slate-400 uppercase hover:text-secondary transition-colors">Confidentialité</Link>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Libreville • Gabon</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-50 flex flex-col md:row items-center justify-between gap-4 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2026 EMENO DELIVERY SERVICE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 lg:p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-soft transition-all"
    >
      <h4 className="font-black text-primary text-[11px] uppercase tracking-widest mb-4 flex items-center gap-3 italic">
        <div className="w-1.5 h-1.5 bg-secondary rounded-full" /> {question}
      </h4>
      <p className="text-slate-400 text-xs lg:text-sm font-medium leading-relaxed">{answer}</p>
    </motion.div>
  );
}