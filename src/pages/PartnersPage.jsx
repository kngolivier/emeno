import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, Sun, Moon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/Theme/ThemeContext";
import { fetchPartners } from "../api/partners.api";
import PartnerCard from "../components/client-home/PartnerCard";
import PartnerModal from "../components/client-home/PartnerModal";
import { normalizePartner } from "../utils/dataMapper";
import { 
  Utensils, ShoppingBasket, Pill, Shirt, Sparkles, Briefcase, Grid, HelpCircle 
} from "lucide-react";

const CATEGORY_ICONS = {
  'Tout': Grid,
  'RESTAURANT': Utensils,
  'EPICERIE': ShoppingBasket,
  'PHARMACIE': Pill,
  'MODE': Shirt,
  'BEAUTE': Sparkles,
  'SERVICES': Briefcase,
  'AUTRE': HelpCircle
};

const CATEGORY_ORDER = ['Tout', 'RESTAURANT', 'EPICERIE', 'PHARMACIE', 'MODE', 'BEAUTE', 'SERVICES', 'AUTRE'];

export default function PartnersPage() {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoading(true);
        const res = await fetchPartners();
        const rawPartners = res.data?.data || res.data || [];

        // Filtrage ici : on ne garde que les partenaires avec status: 'ACTIVE'
        const activePartners = rawPartners.filter(p => p.status === 'ACTIVE');
        setPartners(activePartners.map(normalizePartner));
      } catch (err) {
        console.error("Erreur chargement partenaires", err);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

  const handleGoBack = () => {
    if (!user) navigate("/");
    else if (user.role === "CLIENT") navigate("/client", { replace: true });
    else navigate("/");
  };

  const categories = useMemo(() => {
    const uniqueCats = [...new Set(partners.map((p) => p.category || "AUTRE"))];
    
    // Tri selon CATEGORY_ORDER pour une expérience utilisateur cohérente
    return CATEGORY_ORDER.filter(c => c === 'Tout' || uniqueCats.includes(c));
  }, [partners]);

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch = partner.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "Tout" || partner.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, partners]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 pt-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-secondary dark:text-slate-400 dark:hover:text-secondary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Retour</span>
        </button>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Nos Partenaires</h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">Découvrez tout notre écosystème de services et boutiques.</p>
      </div>

      {/* FILTRES & RECHERCHE */}
      <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-[#0B1120]/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-slate-200 dark:border-white/10 mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-secondary/50 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || CATEGORY_ICONS['AUTRE'];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat 
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-secondary"
                  }`}
                >
                  <Icon size={14} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* GRILLE */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-secondary" size={40} />
        </div>
      ) : filteredPartners.length > 0 ? (
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPartners.map((partner) => (
              <motion.div key={partner._id} layout exit={{ opacity: 0, scale: 0.9 }}>
                <PartnerCard {...partner} onClick={() => setSelectedPartner(partner)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        // Empty State
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/[0.03] flex items-center justify-center mb-6">
            <Search size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aucun partenaire trouvé</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            {searchTerm 
              ? `Nous n'avons trouvé aucun résultat pour "${searchTerm}". Essayez une autre recherche.` 
              : "Il n'y a pas encore de partenaires disponibles dans cette catégorie."}
          </p>
          <button 
            onClick={() => { setSearchTerm(""); setActiveCategory("Tout"); }}
            className="mt-6 px-6 py-2 bg-secondary text-white rounded-full font-bold hover:bg-secondary/90 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </motion.div>
      )}

      <PartnerModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
    </motion.div>
  );
}