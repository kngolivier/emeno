// src/pages/driver-portal/DriverProfile.jsx

import { 
  User, Shield, Phone, LogOut, 
  ChevronRight, Star, MapPin, Settings, Moon, Sun, Award,
  Calendar
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/Theme/ThemeContext";
import { motion } from "framer-motion";

export default function DriverProfile() {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const joinYear = user?.createdAt 
    ? new Date(user.createdAt).getFullYear() 
    : 2024;

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 pb-40 custom-scrollbar"> 
        
        {/* --- 1. HEADER PRO : L'IDENTITÉ EMENO --- */}
        <div className="text-center pt-12 pb-8">
          <div className="relative inline-block mb-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[3.5rem] border-[6px] border-white dark:border-slate-800 shadow-2xl mx-auto flex items-center justify-center text-primary dark:text-white overflow-hidden relative group"
            >
              {user?.photo ? (
                <img src={user.photo} alt="Profil" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <User size={48} strokeWidth={2.5} className="opacity-20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </motion.div>
            
            <motion.div 
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="absolute -bottom-2 -right-2 bg-secondary text-primary p-3 rounded-2xl shadow-xl border-4 border-[#F8FAFC] dark:border-[#0B1120]"
            >
              <Award size={20} strokeWidth={3} />
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-black text-primary dark:text-white uppercase italic tracking-tighter leading-none mb-3">
            {user?.nom || "Livreur"} <span className="text-secondary">{user?.prenom || "Emeno"}</span>
          </h2>
          
          <div className="flex items-center justify-center gap-3">
            <span className="px-4 py-1.5 bg-primary text-white dark:bg-white dark:text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/10">
              Partenaire Certifié
            </span>
          </div>
        </div>

        {/* --- 2. QUICK STATS : LA CRÉDIBILITÉ --- */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <StatSmall label="Membre depuis" value={joinYear.toString()} icon={<Calendar size={12}/>} />
          <StatSmall label="Zone d'activité" value="Libreville" icon={<MapPin size={12}/>} />
        </div>

        {/* --- 3. MENU DE CONFIGURATION : L'EFFICACITÉ --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Paramètres Sécurisés</h3>
             <Settings size={14} className="text-slate-300" />
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-3 shadow-sm border border-slate-100 dark:border-slate-800/50">
            <ProfileMenuItem 
              icon={<Phone size={20}/>} 
              label="Contact Privé" 
              value={user?.telephone || "+241 00 00 00 00"} 
            />
            
            <ProfileMenuItem 
              icon={<Shield size={20} className="text-emerald-500" />} 
              label="Statut du Compte" 
              value="Identité Vérifiée" 
              isVerified
            />

            <div onClick={toggleTheme} className="group">
              <ProfileMenuItem 
                icon={isDarkMode ? <Sun size={20} className="text-secondary" /> : <Moon size={20} />} 
                label="Interface" 
                value={isDarkMode ? "Mode Sombre Actif" : "Mode Clair Actif"} 
              />
            </div>

            {/* --- BOUTON DÉCONNEXION --- */}
            <div className="px-3 pt-4 pb-3">
              <button 
                onClick={handleLogout}
                className="w-full group flex items-center justify-between p-5 bg-rose-500/5 hover:bg-rose-500/10 rounded-[2.2rem] border-2 border-dashed border-rose-500/10 transition-all active:scale-[0.97]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:rotate-[15deg] transition-transform">
                    <LogOut size={22} strokeWidth={3} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-rose-500/40 mb-1">Session</span>
                    <span className="text-sm font-black uppercase tracking-widest text-rose-500">Déconnexion</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-rose-500/30 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* --- 4. BRANDING FOOTER --- */}
        <div className="mt-16 pb-12 text-center opacity-30 group">
          <p className="text-[10px] font-black text-primary dark:text-white uppercase tracking-[0.5em] group-hover:tracking-[0.6em] transition-all duration-700">
            EMENO<span className="text-secondary">.</span>
          </p>
          <div className="h-px w-8 bg-slate-300 dark:bg-slate-700 mx-auto my-3" />
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            Libreville, Gabon • Build 2026.5
          </p>
        </div>
      </div>
    </div>
  );
}

function StatSmall({ label, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="text-slate-300 dark:text-slate-600 mb-2">{icon}</div>
      <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">{label}</p>
      <p className="text-sm font-black italic tracking-tighter text-primary dark:text-white uppercase">{value}</p>
    </div>
  );
}

function ProfileMenuItem({ icon, label, value, isVerified }) {
  return (
    <div className="flex items-center justify-between p-6 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-[2.2rem]">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-secondary group-hover:scale-110 transition-all shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-black text-primary dark:text-slate-200 uppercase italic tracking-tight">{value}</p>
            {isVerified && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            )}
          </div>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-200 dark:text-slate-700 group-hover:translate-x-1 group-hover:text-secondary transition-all" />
    </div>
  );
}