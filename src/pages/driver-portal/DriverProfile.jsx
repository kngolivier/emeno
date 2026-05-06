// FILE: src/pages/driver-portal/DriverProfile.jsx
// import { useState, useEffect } from "react";
import { 
  User, Shield, Phone, LogOut, 
  ChevronRight, Star, MapPin, Settings 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DriverProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Profil Header */}
      <div className="text-center pt-6">
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-card dark:bg-primary-light rounded-[2.5rem] border-4 border-white dark:border-primary-dark shadow-2xl mx-auto flex items-center justify-center text-primary dark:text-white mb-4 overflow-hidden">
            {user?.photo ? (
              <img src={user.photo} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <User size={48} />
            )}
          </div>
          <div className="absolute bottom-4 right-0 bg-secondary text-white p-2 rounded-2xl shadow-lg border-2 border-white dark:border-primary-dark">
            <Star size={14} fill="currentColor" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-primary dark:text-white uppercase italic tracking-tighter">
          {user?.nom} {user?.prenom}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Livreur Officiel</span>
          <span className="w-1 h-1 bg-muted rounded-full" />
          <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Libreville, GA</span>
        </div>
      </div>

      {/* 2. Stats de Performance (Vue rapide) */}
      <div className="grid grid-cols-3 gap-3 px-2">
        <StatSmall label="Note" value="4.9" />
        <StatSmall label="Niveau" value="Pro" />
        <StatSmall label="Depuis" value="2024" />
      </div>

      {/* 3. Menu de Configuration */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-6">Paramètres du compte</h3>
        
        <div className="bg-card dark:bg-primary-light rounded-[2.5rem] p-4 shadow-soft border border-muted/5">
          <ProfileMenuItem 
            icon={<Phone size={18}/>} 
            label="Contact" 
            value={user?.telephone || "Non renseigné"} 
          />
          <ProfileMenuItem 
            icon={<MapPin size={18}/>} 
            label="Zone d'activité" 
            value="Estuaire / Libreville" 
          />
          <ProfileMenuItem 
            icon={<Shield size={18}/>} 
            label="Vérification" 
            value="Identité Confirmée" 
            isVerified
          />
          <ProfileMenuItem 
            icon={<Settings size={18}/>} 
            label="Préférences" 
            value="Notifications, Thème" 
          />

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-5 text-danger bg-danger/5 rounded-2xl transition-all active:scale-[0.98] mt-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-danger/10 rounded-xl flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Déconnexion</span>
            </div>
            <ChevronRight size={16} className="opacity-30" />
          </button>
        </div>
      </div>

      {/* 4. Footer Branding */}
      <p className="text-center text-[9px] font-bold text-muted/40 uppercase tracking-[0.3em]">
        EMENO Delivery • Version 2.1.0
      </p>
    </div>
  );
}

function StatSmall({ label, value }) {
  return (
    <div className="bg-card dark:bg-primary-light p-4 rounded-3xl border border-muted/5 text-center shadow-sm">
      <p className="text-[8px] font-black text-muted uppercase mb-1 tracking-tighter">{label}</p>
      <p className="text-sm font-black text-primary dark:text-white italic">{value}</p>
    </div>
  );
}

function ProfileMenuItem({ icon, label, value, isVerified }) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-muted/5 last:border-0 group cursor-pointer active:bg-muted/5 transition-colors rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-muted/5 rounded-xl flex items-center justify-center text-muted group-hover:text-primary transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-[9px] font-black text-muted uppercase tracking-tighter">{label}</p>
          <div className="flex items-center gap-1">
            <p className="text-xs font-bold text-primary dark:text-slate-200">{value}</p>
            {isVerified && <div className="w-1.5 h-1.5 bg-success rounded-full" />}
          </div>
        </div>
      </div>
      <ChevronRight size={16} className="text-muted/30 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}