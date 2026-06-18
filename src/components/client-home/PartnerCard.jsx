import { 
  Utensils, ShoppingBasket, Pill, Shirt, Sparkles, Briefcase, Grid, HelpCircle 
} from "lucide-react";

// Mapping des icônes
const CATEGORY_ICONS = {
  'RESTAURANT': Utensils,
  'EPICERIE': ShoppingBasket,
  'PHARMACIE': Pill,
  'MODE': Shirt,
  'BEAUTE': Sparkles,
  'SERVICES': Briefcase,
  'AUTRE': HelpCircle
};

export default function PartnerCard({ name, category, image, onClick }) {
  // Sélection de l'icône, avec 'AUTRE' par défaut
  const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS['AUTRE'];

  return (
    <div 
      onClick={onClick} 
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/[0.06] aspect-[3/4] md:aspect-auto md:h-72 cursor-pointer transition-all duration-500 hover:shadow-2xl"
    >
      {/* IMAGE */}
      <img 
        src={image} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      
      {/* DÉGRADÉ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
      
      {/* CONTENU */}
      <div className="relative z-10 h-full p-5 flex flex-col justify-end">
        {/* Icône dynamique basée sur la catégorie */}
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
          <Icon size={20} className="text-white" />
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-black text-white italic uppercase leading-tight">{name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/70 uppercase tracking-wider">
            {category}
          </p>
        </div>
      </div>
    </div>
  );
}