import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/Theme/ThemeContext"; // Import du contexte de thème
import PartnerCard from "../components/client-home/PartnerCard";
import PartnerModal from "../components/client-home/PartnerModal";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function PartnersPage() {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // Utilisation du hook de thème
  const navigate = useNavigate();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tout");

  useEffect(() => {
    if (user && (user.role === "DELIVERER" || user.role === "ADMIN")) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoBack = () => {
    if (!user) navigate("/");
    else if (user.role === "CLIENT") navigate("/client", { replace: true });
    else navigate("/");
  };

  // Remplacer "allPartners" par ton import ou ton tableau de données
  const allPartners = [
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
  const categories = ["Tout", ...new Set(allPartners.map((p) => p.category))];

  const filteredPartners = useMemo(() => {
    return allPartners.filter((partner) => {
      const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "Tout" || partner.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Page avec bouton Retour et Theme Toggle */}
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

      {/* Barre de recherche et Filtres Sticky */}
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
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat 
                  ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille des résultats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <motion.div
                key={partner.name}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <PartnerCard {...partner} onClick={() => setSelectedPartner(partner)} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400">Aucun partenaire trouvé.</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <PartnerModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
    </motion.div>
  );
}