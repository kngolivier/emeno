import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { fetchClientDeliveries } from "../../api/deliveries.api";
import { fetchMyStats } from "../../api/stats.api";
import { fetchPartners } from "../../api/partners.api"; // Import ajoutée
import HeroSection from "../../components/client-home/HeroSection";
import StatsCards from "../../components/client-home/StatsCards";
import ActiveDeliveryCard from "../../components/client-home/ActiveDeliveryCard";
import QuickActions from "../../components/client-home/QuickActions";
import PromotionsCarousel from "../../components/client-home/PromotionsCarousel";
import ServiceCard from "../../components/client-home/ServiceCard";
import PartnerCard from "../../components/client-home/PartnerCard";
import PartnerModal from "../../components/client-home/PartnerModal";
import SectionHeader from "../../components/client-home/SectionHeader";
import { ShieldCheck, Globe, Zap, MapPin, CreditCard, Headset, ArrowRight } from "lucide-react";
import { normalizePartner } from "../../utils/dataMapper"; // Import

const ACTIVE_STATUS = ["PENDING", "ASSIGNED", "PICKED_UP", "IN_PROGRESS"];

export default function ClientHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partners, setPartners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsRes, deliveriesRes, partnersRes] = await Promise.all([
        fetchMyStats("MONTH"), 
        fetchClientDeliveries(),
        fetchPartners()
      ]);

      setStats(statsRes?.data || statsRes);
      const rawPartners = partnersRes.data?.data || partnersRes.data || [];
      setPartners(rawPartners.map(normalizePartner).slice(0, 4));

      const deliveries = deliveriesRes?.data?.data || deliveriesRes?.data || [];
      const active = deliveries.find((d) => ACTIVE_STATUS.includes(d.status));
      setActiveDelivery(active);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32 space-y-8">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {partners.map((partner) => (
              <PartnerCard key={partner._id} {...partner} onClick={() => setSelectedPartner(partner)} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => navigate("/partenaires")}
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