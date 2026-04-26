import { Bell, Search, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-[#002D15] border-b border-slate-100 px-8 flex justify-between items-center sticky top-0 z-10">
      {/* Barre de recherche (facultatif mais pro) */}
      <div className="relative w-96 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#002E1B] transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher une commande, un livreur..." 
          className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#B08D3E]/20 transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-white hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          {/* Badge de notification aux couleurs du logo */}
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#B08D3E] border-2 border-white rounded-full"></span>
        </button>

        {/* Profil Utilisateur */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[#002E1B] leading-none">Admin Emeno</p>
            <p className="text-xs text-white mt-1 uppercase tracking-wider font-medium">Super Administrateur</p>
          </div>
          
          <div className="relative">
            {/* Avatar avec le dégradé de votre logo (Vert vers Doré) */}
            <div className="w-11 h-11 bg-[#fff] text-black flex items-center justify-center rounded-xl shadow-md font-bold text-lg">
              E
            </div>
            {/* Indicateur de statut en ligne (Vert) */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#002E1B] border-2 border-white rounded-full"></div>
          </div>
          
          <ChevronDown size={16} className="text-slate-400 group-hover:text-[#002E1B] transition-transform group-hover:translate-y-0.5" />
        </div>
      </div>
    </header>
  );
}
