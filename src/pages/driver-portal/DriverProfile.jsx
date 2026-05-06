// FILE: src/pages/driver-portal/DriverProfile.jsx

import { 
  User, Shield, Phone, LogOut, 
  ChevronRight, Star, MapPin, Settings 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/Theme/ThemeContext";

export default function DriverProfile() {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme(); // On récupère le thème et sa fonction de modification
    const navigate = useNavigate();

  const handleLogout = async () => {
    // Petit feedback haptique ou visuel possible ici avant le logout
    await logout();
    navigate("/login");
  };

  // On récupère l'année de création (ex: 2024) ou l'année actuelle par défaut
  const joinYear = user?.createdAt 
    ? new Date(user.createdAt).getFullYear() 
    : new Date().getFullYear();

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-primary-dark overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-40"> {/* Scroll indépendant */}
        
        {/* 1. Profil Header */}
        <div className="text-center pt-10 pb-6">
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-white dark:bg-primary-light rounded-[2.8rem] border-4 border-white dark:border-primary-dark shadow-xl mx-auto flex items-center justify-center text-primary dark:text-white mb-4 overflow-hidden">
              {user?.photo ? (
                <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <User size={40} strokeWidth={2.5} />
              )}
            </div>
            {/* Badge de niveau - Utilise ta couleur secondary */}
            <div className="absolute bottom-4 -right-1 bg-secondary text-white p-2 rounded-2xl shadow-lg border-4 border-slate-50 dark:border-primary-dark">
              <Star size={14} fill="currentColor" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter leading-none">
            {user?.nom || "Livreur"} {user?.prenom || "Emeno"}
          </h2>
          
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-[9px] font-black uppercase tracking-widest rounded-full">
              Livreur Officiel
            </span>
            <div className="flex items-center gap-1 text-muted">
              <MapPin size={10} />
              <span className="text-[9px] font-black uppercase tracking-widest">Libreville</span>
            </div>
          </div>
        </div>

        {/* 2. Stats de Performance - Design "Flat" */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* <StatSmall label="Note" value="4.9" color="text-secondary" />
          <StatSmall label="Niveau" value="Pro" color="text-success" /> */}
          <StatSmall label="Depuis" value={joinYear.toString()} color="text-secondary" />
        </div>

        {/* 3. Menu de Configuration */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-4">
            Paramètres du compte
          </h3>
          
          <div className="bg-white dark:bg-primary-light rounded-[2.5rem] p-2 shadow-sm border border-slate-100 dark:border-white/5">
            <ProfileMenuItem 
              icon={<Phone size={18}/>} 
              label="Contact" 
              value={user?.telephone || "+241 00 00 00 00"} 
            />
            <ProfileMenuItem 
              icon={<MapPin size={18}/>} 
              label="Zone" 
              value="Estuaire / Libreville" 
            />
            <ProfileMenuItem 
              icon={<Shield size={18}/>} 
              label="Vérification" 
              value="Identité Confirmée" 
              isVerified
            />
            <div onClick={toggleTheme} className="cursor-pointer">
              <ProfileMenuItem 
                icon={<Settings size={18}/>} 
                label="Préférences" 
                value={isDarkMode ? "Mode Sombre" : "Mode Clair"} 
              />
            </div>

            {/* Bouton Déconnexion - Style plus affirmé */}
            <div className="px-2 pb-2"> {/* Un peu d'espace interne pour l'esthétique */}
              <button 
                onClick={handleLogout}
                className="w-full group relative flex items-center justify-between p-4 bg-red-500/[0.03] dark:bg-red-500/[0.02] border-2 border-dashed border-red-500/10 hover:border-red-500/30 rounded-[2rem] transition-all active:scale-[0.96]"
              >
                <div className="flex items-center gap-4">
                  {/* Icône avec un effet de glassmorphism léger */}
                  <div className="w-11 h-11 bg-red-500 text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:rotate-12 transition-transform">
                    <LogOut size={20} strokeWidth={2.5} />
                  </div>
                  
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-red-500/50">Session</span>
                    <span className="text-sm font-black uppercase tracking-widest text-red-500">Quitter l'app</span>
                  </div>
                </div>

                <div className="bg-red-500/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={16} className="text-red-500" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Footer Branding */}
        <div className="mt-10 pb-10 text-center">
          <p className="text-[9px] font-black text-muted/30 uppercase tracking-[0.4em]">
            EMENO Delivery System
          </p>
          <p className="text-[8px] font-bold text-muted/20 uppercase mt-1">
            v2.1.0 • Stable Build
          </p>
        </div>
      </div>
    </div>
  );
}

function StatSmall({ label, value, color }) {
  return (
    <div className="bg-white dark:bg-primary-light p-4 rounded-[2rem] border border-slate-50 dark:border-white/5 text-center shadow-sm">
      <p className="text-[8px] font-black text-muted uppercase mb-1 tracking-widest">{label}</p>
      <p className={`text-sm font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function ProfileMenuItem({ icon, label, value, isVerified }) {
  return (
    <div className="flex items-center justify-between p-5 group cursor-pointer active:bg-slate-50 dark:active:bg-primary-dark/50 transition-colors rounded-[2rem]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-50 dark:bg-primary-dark rounded-2xl flex items-center justify-center text-muted group-hover:text-secondary transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold text-primary dark:text-slate-200">{value}</p>
            {isVerified && (
              <div className="px-1.5 py-0.5 bg-success/10 rounded-md">
                <div className="w-1 h-1 bg-success rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
      <ChevronRight size={14} className="text-muted/20 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}