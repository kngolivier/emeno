// FILE: src/pages/driver-portal/DriverDeliveries.jsx
import { useState, useEffect, useMemo } from "react";
import { Package, Loader2, Search, Filter, X, Calendar } from "lucide-react";
import driverApi from "../../api/driver.api";

export default function DriverDeliveries() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); 

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await driverApi.fetchDriverHistory();
        // S'assurer que history est toujours un tableau
        setHistory(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Erreur historique:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Logique de filtrage combinée avec correction du bug .toLowerCase()
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // Conversion forcée en String pour éviter le crash si c'est un nombre
      const orderNum = String(item.orderNumber || "").toLowerCase();
      const location = String(item.dropoffLocation || "").toLowerCase();
      const search = searchQuery.toLowerCase();

      const matchesSearch = orderNum.includes(search) || location.includes(search);
      const matchesStatus = activeFilter === "ALL" || item.status === activeFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [history, searchQuery, activeFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED': return "bg-success/10 text-success border-success/20";
      case 'CANCELLED': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-100 text-slate-400 border-slate-200";
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="animate-spin text-secondary" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-muted">Récupération des courses...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-32 px-4 pt-4">
      {/* Header Statique */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-primary dark:text-white italic tracking-tighter leading-none">Archives</h1>
          <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] mt-2">EMENO Delivery System</p>
        </div>
        <div className="bg-primary/5 dark:bg-white/5 p-3 rounded-2xl">
            <Calendar size={20} className="text-primary dark:text-white" />
        </div>
      </div>

      {/* ZONE DE FILTRAGE */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Numéro de commande ou lieu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-primary-light border-2 border-slate-100 dark:border-white/5 focus:border-secondary/30 p-4 pl-12 rounded-[1.5rem] shadow-sm outline-none font-bold text-sm transition-all text-primary dark:text-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-slate-100 dark:bg-white/10 rounded-full text-muted">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Onglets de filtre type "Pilules" */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <FilterButton label="Toutes" count={history.length} active={activeFilter === "ALL"} onClick={() => setActiveFilter("ALL")} />
          <FilterButton 
            label="Livrées" 
            count={history.filter(h => h.status === 'DELIVERED').length}
            active={activeFilter === "DELIVERED"} 
            onClick={() => setActiveFilter("DELIVERED")} 
            activeClass="bg-success text-white" 
          />
          <FilterButton 
            label="Annulées" 
            count={history.filter(h => h.status === 'CANCELLED').length}
            active={activeFilter === "CANCELLED"} 
            onClick={() => setActiveFilter("CANCELLED")} 
            activeClass="bg-red-500 text-white" 
          />
        </div>
      </div>

      {/* LISTE DES COURSES */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-primary-light rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-white/5">
            <Package size={40} className="mx-auto mb-4 text-slate-200" />
            <p className="font-black uppercase text-[10px] tracking-widest text-muted">Aucune archive correspondante</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item._id} className="bg-white dark:bg-primary-light p-5 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between group active:scale-[0.97] transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center border-2 ${getStatusStyle(item.status)}`}>
                  <Package size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-primary dark:text-white italic tracking-tighter">#{item.orderNumber}</span>
                  </div>
                  <p className="text-[10px] font-bold text-muted truncate max-w-[120px] uppercase">
                    {item.dropoffLocation}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-black text-primary dark:text-white tracking-tighter leading-none mb-1">
                    {item.totalAmount?.toLocaleString()} <span className="text-[10px] italic">F</span>
                </p>
                <p className="text-[8px] font-black text-muted uppercase tracking-widest">
                  {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FilterButton({ label, count, active, onClick, activeClass = "bg-primary text-white" }) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
        active 
        ? `${activeClass} shadow-lg scale-105` 
        : 'bg-white dark:bg-primary-light text-muted border border-slate-100 dark:border-white/5'
      }`}
    >
      {label}
      <span className={`text-[8px] px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/5 text-muted'}`}>
        {count}
      </span>
    </button>
  );
}