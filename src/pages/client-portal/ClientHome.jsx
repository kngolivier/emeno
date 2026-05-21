import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import { fetchMyStats } from "../../api/stats.api";
import HeroSection from "../../components/client-home/HeroSection";
import WelcomeBanner from "../../components/client-home/WelcomeBanner";
import StatsCards from "../../components/client-home/StatsCards";
import ActiveDeliveryCard from "../../components/client-home/ActiveDeliveryCard";
import QuickActions from "../../components/client-home/QuickActions";
import PromotionsCarousel from "../../components/client-home/PromotionsCarousel";
import ServiceCard from "../../components/client-home/ServiceCard";
import PartnerCard from "../../components/client-home/PartnerCard";
import PartnerModal from "../../components/client-home/PartnerModal";
import SectionHeader from "../../components/client-home/SectionHeader";
import { ShieldCheck, Globe, Zap, MapPin, CreditCard, Headset, ArrowRight } from "lucide-react";

const ACTIVE_STATUS = ["PENDING", "ASSIGNED", "PICKED_UP", "IN_PROGRESS"];

const partners = [
  {
    name: "Nelia's Care",
    category: "Cosmétique & Beauté",
    description: "Expert en soins naturels et rituels de beauté pour une peau rayonnante au quotidien.",
    address: "Centre-ville, Libreville",
    phone: "+24106554433",
    image: "https://images.unsplash.com/photo-1556228720-1950672e3a04",
    products: [
      { name: "Crème Hydratante", price: "5500 F", description: "Hydratation intense 24h pour peau sensible.", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19" },
      { name: "Sérum Éclat", price: "8900 F", description: "Sérum à la vitamine C pour un teint uniforme.", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908" },
      { name: "Masque Argile", price: "4200 F", description: "Purifiant et détoxifiant pour le visage.", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796" }
    ],
  },
  {
    name: "Gabon Tech Store",
    category: "High-Tech",
    description: "Le meilleur de l'électronique et des accessoires connectés à portée de main.",
    address: "Akanda, Gabon",
    phone: "+24111223344",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03",
    products: [
      { name: "Écouteurs Pro", price: "15000 F", description: "Son cristallin avec réduction de bruit active.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
      { name: "Smart Watch X", price: "25000 F", description: "Suivi sportif et notifications en temps réel.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
      { name: "Chargeur Rapide", price: "7500 F", description: "Charge ultra-rapide compatible tout modèle.", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90" }
    ],
  },
  {
    name: "La Casa Gusto",
    category: "Restauration",
    description: "Authentique cuisine italienne préparée avec des produits frais locaux.",
    address: "Quartier Louis, Libreville",
    phone: "+24107070707",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    products: [
      { name: "Pizza Margherita", price: "6000 F", description: "Base tomate, mozzarella di bufala, basilic frais.", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3" },
      { name: "Pasta Carbonara", price: "5500 F", description: "Recette traditionnelle romaine avec guanciale.", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3" }
    ],
  },
  {
    name: "Urban Style",
    category: "Mode & Lifestyle",
    description: "Le style urbain et moderne pour ceux qui aiment se démarquer.",
    address: "Mbolo, Libreville",
    phone: "+24104040404",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    products: [
      { name: "Casquette Vintage", price: "3500 F", description: "Accessoire indémodable en coton bio.", image: "https://images.unsplash.com/photo-1588850561407-ed78c672e873" },
      { name: "T-Shirt Oversize", price: "4500 F", description: "Coupe décontractée, coton premium.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
      { name: "Sac à Dos", price: "12000 F", description: "Compartiment ordinateur et design robuste.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" }
    ],
  },
];

export default function ClientHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [displayedPartners, setDisplayedPartners] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    loadData();

    // Logique de randomisation : on mélange la liste et on prend les 4 premiers
    const shuffled = [...partners].sort(() => 0.5 - Math.random());
    setDisplayedPartners(shuffled.slice(0, 4));
  }, []);

  async function loadData() {
    try {
      const [statsRes, deliveriesRes] = await Promise.all([fetchMyStats("MONTH"), fetchClientDeliveries()]);

      setStats(statsRes?.data || statsRes);

      const deliveries = deliveriesRes?.data?.data || deliveriesRes?.data || [];
      const active = deliveries.find((d) => ACTIVE_STATUS.includes(d.status));

      setActiveDelivery(active);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 space-y-8">
      {/* <WelcomeBanner user={user} /> */}
      <HeroSection activeDelivery={activeDelivery} />

      <div className="px-4 space-y-10">
        <div>
          <SectionHeader title="Vos statistiques" subtitle="Analyse intelligente de vos livraisons" icon={ShieldCheck} />
          <StatsCards stats={stats} />
        </div>
        <div>
          <SectionHeader title="Suivi de votre livraison" subtitle="Restez informé en temps réel" icon={MapPin} />
          <ActiveDeliveryCard delivery={activeDelivery} />
        </div>
        <div>
          <SectionHeader title="Actions rapides" subtitle="Accédez rapidement aux fonctionnalités" icon={Zap} />
          <QuickActions />
        </div>

        <div>
          <SectionHeader title="Services" subtitle="EMENO" icon={ShieldCheck} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <ServiceCard title="Express" desc="Livraison rapide" icon={Zap} />
            <ServiceCard title="GPS" desc="Tracking temps réel" icon={MapPin} />
            <ServiceCard title="Paiement" desc="Transactions sécurisées" icon={CreditCard} />
            <ServiceCard title="Support" desc="Assistance rapide" icon={Headset} />
          </div>
        </div>

        <PromotionsCarousel />

        <div>
          <SectionHeader title="Partenaires" subtitle="EMENO Ecosystem" icon={Globe} />
        
          {/* Grille dynamique */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {displayedPartners.map((partner) => (
              <PartnerCard key={partner.name} {...partner} onClick={() => setSelectedPartner(partner)} />
            ))}
          </div>

          {/* Bouton Voir tout */}
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => {navigate("/partenaires", { replace: true }) }}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#071120] border border-slate-200 dark:border-white/10 rounded-full text-sm font-bold text-slate-600 dark:text-white hover:border-secondary hover:text-secondary transition-all"
            >
              Voir tous les partenaires <ArrowRight size={16} />
            </button>
          </div>
        </div>  
      </div>

      <PartnerModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
    </motion.div>
  );
}