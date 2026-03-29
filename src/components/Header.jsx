import { Bell, Search, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex justify-between items-center sticky top-0 z-10">
      {/* Barre de recherche (facultatif mais pro) */}
      <div className="relative w-96 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher une commande, un livreur..." 
          className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Profil Utilisateur */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">Admin Emeno</p>
            <p className="text-xs text-slate-500 mt-1">Super Administrateur</p>
          </div>
          
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center rounded-xl shadow-md font-bold text-lg">
              A
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5" />
        </div>
      </div>
    </header>
  );
}
