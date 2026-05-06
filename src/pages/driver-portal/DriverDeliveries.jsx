// FILE: src/pages/driver-portal/DriverDeliveries.jsx

import { useState, useEffect, useMemo } from "react";
import { Package, Loader2, Search, X, Calendar } from "lucide-react";
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
      case 'DELIVERED': return "bg-success/10 text-success border-success/20";
      case 'CANCELLED': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-100 text-slate-400 border-slate-200";
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-secondary" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-muted text-center">Récupération des courses...</p>
    </div>
  );

  return (
    /* h-screen + flex-col pour occuper tout l'écran sans dépasser */
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-primary-dark overflow-hidden">
      
      {/* SECTION FIXE HAUT (Header + Filtres) */}
      <div className="p-4 space-y-4 bg-slate-50 dark:bg-primary-dark z-10 shadow-sm">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-primary dark:text-white italic tracking-tighter leading-none">Archives</h1>
            <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] mt-2">EMENO Delivery System</p>
          </div>
          <div className="relative bg-primary/5 dark:bg-white/5 p-3 rounded-2xl">
              <Calendar size={20} className="text-primary dark:text-white" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text"
              placeholder="N° commande ou lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-primary-light border-2 border-slate-50 dark:border-white/5 py-3 pl-11 pr-4 rounded-2xl shadow-sm outline-none font-bold text-[13px] text-primary dark:text-white"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <FilterButton label="Toutes" count={history.length} active={activeFilter === "ALL"} onClick={() => setActiveFilter("ALL")} />
            <FilterButton label="Livrées" count={history.filter(h => h.status === 'DELIVERED').length} active={activeFilter === "DELIVERED"} onClick={() => setActiveFilter("DELIVERED")} activeClass="bg-success text-white" />
            <FilterButton label="Annulées" count={history.filter(h => h.status === 'CANCELLED').length} active={activeFilter === "CANCELLED"} onClick={() => setActiveFilter("CANCELLED")} activeClass="bg-red-500 text-white" />
          </div>

          {selectedDate && (
            <div className="flex items-center justify-between bg-secondary/10 border border-secondary/20 px-3 py-2 rounded-xl">
              <p className="text-[9px] font-black text-secondary uppercase italic tracking-widest">Journée du {new Date(selectedDate).toLocaleDateString('fr-FR')}</p>
              <button onClick={() => setSelectedDate("")}><X size={14} className="text-secondary" /></button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION SCROLLABLE (Liste des courses) */}
      <div className="flex-1 overflow-y-auto px-4 pb-40">
        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-primary-light rounded-[3rem] border-2 border-dashed border-slate-100">
              <Package size={32} className="mx-auto mb-3 text-slate-200" />
              <p className="font-black uppercase text-[9px] tracking-widest text-muted">Aucune course</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item._id} className="bg-white dark:bg-primary-light p-4 rounded-[2.2rem] shadow-sm border border-slate-50 dark:border-white/5 flex items-center justify-between active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${getStatusStyle(item.status)}`}>
                    <Package size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-black text-primary dark:text-white italic tracking-tighter block">#{item.orderNumber}</span>
                    <p className="text-[9px] font-bold text-muted truncate max-w-[100px] uppercase">{item.dropoffLocation}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-primary dark:text-white tracking-tighter leading-none mb-1">
                      {item.totalAmount?.toLocaleString()} <span className="text-[9px] italic font-black text-secondary">F</span>
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
    </div>
  );
}

function FilterButton({ label, count, active, onClick, activeClass = "bg-primary text-white" }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
        active ? `${activeClass} shadow-md` : 'bg-white dark:bg-primary-light text-muted border border-slate-50 dark:border-white/5'
      }`}
    >
      {label}
      <span className={`text-[7px] px-1.5 py-0.5 rounded-md font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-white/5 text-muted'}`}>{count}</span>
    </button>
  );
}