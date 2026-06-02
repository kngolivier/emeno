// src/pages/driver-portal/DriverDeliveries.jsx

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Loader2, Search, X, Calendar, Filter, ChevronRight, Hash } from "lucide-react";
import driverApi from "../../api/driver.api";

export default function DriverDeliveries() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); 
  const [selectedDate, setSelectedDate] = useState(""); 

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await driverApi.fetchDriverHistory();
        setHistory(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Erreur historique:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const orderNum = String(item.orderNumber || "").toLowerCase();
      const location = String(item.dropoffLocation || "").toLowerCase();
      const search = searchQuery.toLowerCase();
      const itemDate = new Date(item.createdAt).toLocaleDateString('fr-CA'); 
      
      const matchesSearch = orderNum.includes(search) || location.includes(search);
      const matchesStatus = activeFilter === "ALL" || item.status === activeFilter;
      const matchesDate = !selectedDate || itemDate === selectedDate;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [history, searchQuery, activeFilter, selectedDate]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'CANCELLED': return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-6 px-10">
      <div className="relative">
        <Loader2 className="animate-spin text-secondary" size={40} strokeWidth={3} />
        <div className="absolute inset-0 blur-xl bg-secondary/20 animate-pulse" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center italic">Chargement de vos succès...</p>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden">
      
      {/* --- HEADER FIXE AVEC FILTRES --- */}
      <div className="p-6 space-y-6 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl z-20 border-b border-slate-100 dark:border-slate-800/50 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] italic block mb-1">Historique</span>
            <h1 className="text-3xl font-black text-primary dark:text-white italic tracking-tighter leading-none uppercase">Archives</h1>
          </div>
          <div className="relative">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 text-primary dark:text-white active:scale-95 transition-all">
                <Calendar size={22} strokeWidth={2.5} />
              </div>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Rechercher une course ou un lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-secondary/30 focus:bg-white dark:focus:bg-slate-800 py-4 pl-14 pr-6 rounded-[1.5rem] outline-none font-bold text-[13px] text-primary dark:text-white transition-all shadow-inner"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            <FilterButton label="Toutes" count={history.length} active={activeFilter === "ALL"} onClick={() => setActiveFilter("ALL")} />
            <FilterButton 
                label="Livrées" 
                count={history.filter(h => h.status === 'DELIVERED').length} 
                active={activeFilter === "DELIVERED"} 
                onClick={() => setActiveFilter("DELIVERED")} 
                activeClass="bg-emerald-500 text-white shadow-emerald-500/20" 
            />
            <FilterButton 
                label="Annulées" 
                count={history.filter(h => h.status === 'CANCELLED').length} 
                active={activeFilter === "CANCELLED"} 
                onClick={() => setActiveFilter("CANCELLED")} 
                activeClass="bg-rose-500 text-white shadow-rose-500/20" 
            />
          </div>

          <AnimatePresence>
            {selectedDate && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-secondary/10 border border-secondary/20 px-4 py-3 rounded-2xl"
              >
                <p className="text-[9px] font-black text-secondary uppercase italic tracking-[0.2em]">Journée du {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <button onClick={() => setSelectedDate("")} className="p-1 hover:bg-secondary/20 rounded-lg transition-colors"><X size={16} className="text-secondary" strokeWidth={3}/></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- LISTE SCROLLABLE --- */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-40 space-y-4 custom-scrollbar">
        {filteredHistory.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-slate-200 dark:text-slate-700" />
            </div>
            <p className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400 italic">Aucune archive trouvée</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-[2.2rem] shadow-sm border border-slate-50 dark:border-slate-800/50 flex items-center justify-between group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-colors ${getStatusStyle(item.status)} shadow-sm`}>
                    <Package size={24} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                        <Hash size={10} className="text-secondary" />
                        <span className="text-sm font-black text-primary dark:text-white italic tracking-tighter leading-none">{item.orderNumber}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 truncate max-w-[140px] uppercase tracking-tight">{item.dropoffLocation}</p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  {/* <p className="text-lg font-black text-primary dark:text-white tracking-tighter leading-none mb-1">
                      {item.totalAmount?.toLocaleString()} <span className="text-[10px] italic font-black text-secondary">FCFA</span>
                  </p> */}
                  <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">
                    {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ label, count, active, onClick, activeClass = "bg-primary text-white" }) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all whitespace-nowrap flex items-center gap-3 border-2 ${
        active 
          ? `${activeClass} border-transparent shadow-lg scale-105` 
          : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-50 dark:border-slate-800'
      }`}
    >
      {label}
      <span className={`text-[8px] px-2 py-0.5 rounded-lg font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{count}</span>
    </button>
  );
}