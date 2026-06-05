// FILE: src/pages/partner-portal/PartnerHome.jsx

import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Plus, ChevronRight, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import { getCloudinaryUrl } from "../../utils/imageUtils";
import { fetchMyPartnerStats } from "../../api/stats.api";

export default function PartnerHome() {
  const { currentPartner } = useOutletContext();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ delivered: 0, pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await fetchMyPartnerStats("MONTH");
        // Transformation des données (ex: [{ _id: 'DELIVERED', count: 5 }...])
        const summary = data.reduce((acc, curr) => {
            // Si c'est DELIVERED, on ajoute aux livrés
            if (curr._id === 'DELIVERED') {
                acc.delivered += curr.count;
            } 
            // Sinon, on considère que tout le reste est "en cours/attente"
            else if (curr._id !== 'CANCELLED') { // On exclut les annulés si besoin
                acc.pending += curr.count;
            }
            
            acc.total += curr.count;
            return acc;
        }, { delivered: 0, pending: 0, total: 0 });
        setStats(summary);
      } catch (err) {
        console.error("Erreur chargement stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* 1. HEADER HERO */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-b-[2.5rem] shadow-lg">
        {currentPartner?.coverImage?.url ? (
          <img src={getCloudinaryUrl(currentPartner.coverImage.url, "w_1200,h_600,c_fill")} alt="Bannière" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute bottom-4 left-6 flex items-end gap-4">
          {currentPartner?.logo?.url && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-xl p-1 border-4 border-white dark:border-slate-900 overflow-hidden">
               <img src={getCloudinaryUrl(currentPartner.logo.url, "w_200,h_200,c_fill")} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic mb-2">
            {currentPartner?.name}
          </h1>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 -mt-8 relative z-10">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border w-fit ${currentPartner?.isOnline ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-rose-50 border-rose-200 text-rose-600"}`}>
          <span className={`w-2 h-2 rounded-full ${currentPartner?.isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {currentPartner?.isOnline ? "Ouvert" : "Fermé"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate("/partner/orders/new")} className="col-span-2 sm:col-span-1 bg-secondary hover:bg-secondary/90 text-white p-6 rounded-[2rem] shadow-lg shadow-secondary/20 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95">
            <Plus size={32} />
            <span className="text-xs font-black uppercase tracking-widest">Nouvelle Course</span>
          </button>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => navigate("/partner/orders")} className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl hover:border-secondary transition-all">
              <span className="text-xs font-black uppercase">Mes Commandes</span>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate("/partner/settings")} className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl hover:border-secondary transition-all">
              <span className="text-xs font-black uppercase">Paramètres</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card En cours */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Activity size={20}/></div>
              <h3 className="text-xs font-black uppercase tracking-widest">En cours / Attente</h3>
            </div>
            <p className="text-2xl font-black text-primary dark:text-white">
              {loading ? "..." : stats.pending} 
              <span className="text-xs font-normal ml-1">Commandes</span>
            </p>
          </div>

          {/* Card Livrées */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><ShieldCheck size={20}/></div>
              <h3 className="text-xs font-black uppercase tracking-widest">Livrées</h3>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {loading ? "..." : stats.delivered} 
              <span className="text-xs font-normal ml-1">Commandes</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-slate-800 p-6 rounded-[2rem] text-white flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-2xl"><ShieldCheck size={24}/></div>
            <div><h4 className="font-black text-sm text-white uppercase">Support EMENO</h4><p className="text-[10px] opacity-70 mt-0.5">Une question ? Besoin d'aide sur une livraison ?</p></div>
          </div>
          <button className="bg-white text-primary text-[10px] font-black uppercase px-4 py-2 rounded-xl">Contacter</button>
        </div>
      </div>
    </div>
  );
}