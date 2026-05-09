// FILE: src/pages/pricing/PricingList.jsx

import { useState } from "react";
import { Plus, Edit2, Power, ArrowRight, ArrowLeft, Banknote, Navigation, MapPin, ArrowLeftRightIcon } from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { fetchPricing, createPricing, updatePricing, togglePricing } from "../../api/pricing.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import PricingForm from "./PricingForm";
import PageLoader from "../../components/ui/PageLoader";

export default function PricingList() {
  const { 
    data: pricing = [], 
    meta, 
    loading, 
    setPage, 
    setStatus, 
    status, 
    refresh 
  } = usePaginatedFetch(fetchPricing, 5); 

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = async (data) => {
    try {
      if (data._id) {
        await updatePricing(data._id, data);
        notifySuccess("Tarif mis à jour avec succès");
      } else {
        await createPricing(data);
        notifySuccess("Règle tarifaire enregistrée");
      }
      closeModal();
      refresh();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const handleToggle = async (item) => {
    try {
      await togglePricing(item._id);
      refresh();
      notifySuccess("Statut du tarif modifié");
    } catch (err) {
      notifyError(err.message);
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 md:space-y-10 font-sans pb-10 max-w-7xl mx-auto transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl lg:text-5xl font-black text-primary dark:text-white font-display italic tracking-tighter uppercase leading-none">
            Tarification
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
            Zones logistiques & Corridors EMENO
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white hover:bg-secondary transition-all shadow-xl shadow-primary/10 text-[11px] font-black uppercase tracking-widest active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Nouveau Tarif
        </button>
      </div>

      {/* FILTRES */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0">
        {[
          { label: "Tous les tarifs", value: "ALL" },
          { label: "Actifs", value: "true" },
          { label: "Suspendus", value: "false" }
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${status === f.value 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-200"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* MOBILE VIEW */}
      <div className="grid grid-cols-1 gap-4 lg:hidden px-4">
        {pricing.length > 0 ? (
          pricing.map((p) => (
            <div key={p._id} className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm transition-all ${!p.isActive ? "opacity-70 grayscale-[0.5]" : ""}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-display font-black text-primary dark:text-white italic uppercase text-sm tracking-tighter">
                    <span>{p.from?.name || "Zone inconnue"}</span>
                    <ArrowLeftRightIcon size={12} className="text-secondary" />
                    <span>{p.to?.name || "Zone inconnue"}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Trajet standard</span>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${p.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-600"}`}>
                  {p.isActive ? "Actif" : "Suspendu"}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="text-xl font-black text-primary dark:text-secondary italic">
                  {p.basePrice?.toLocaleString()} <span className="text-[10px] not-italic opacity-40 uppercase">CFA</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-3 text-slate-300 dark:text-slate-600 active:text-secondary transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleToggle(p)} className={`p-3 transition-colors ${p.isActive ? "text-slate-200 dark:text-slate-700 active:text-red-500" : "text-emerald-400"}`}>
                    <Power size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 font-display italic">
            Aucun tarif enregistré
          </div>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/30 dark:bg-slate-800/30 border-b border-slate-50 dark:border-slate-800">
            <tr>
              <th className="p-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Trajet / Corridor</th>
              <th className="p-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Prix de base</th>
              <th className="p-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Statut</th>
              <th className="p-8 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {pricing.length > 0 ? (
              pricing.map((p) => (
                <tr key={p._id} className={`hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors group ${!p.isActive ? "opacity-60" : ""}`}>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-secondary transition-colors">
                        <MapPin size={18} />
                      </div>
                      <div className="flex items-center gap-4 font-display font-black text-primary dark:text-white italic text-xl tracking-tighter uppercase">
                        <span>{p.from?.name || "???"}</span>
                        <ArrowLeftRightIcon size={14} className="text-secondary" />
                        <span>{p.to?.name || "???"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-xl font-black text-primary dark:text-secondary italic">
                    {p.basePrice?.toLocaleString()} <span className="text-[10px] not-italic opacity-40 dark:text-slate-500 uppercase">CFA</span>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all 
                      ${p.isActive 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                        : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-600 dark:border-slate-700"}`}>
                      {p.isActive ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-3 text-slate-300 hover:text-secondary dark:hover:text-secondary rounded-xl transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleToggle(p)} className={`p-3 rounded-xl transition-all ${p.isActive ? "text-slate-200 hover:text-rose-500" : "text-emerald-400"}`}>
                        <Power size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center text-slate-300 dark:text-slate-700 font-display italic text-lg">
                  Aucune règle tarifaire trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="px-4 md:px-0 pt-6">
        <Pagination meta={meta} setPage={setPage} />
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-primary/40 dark:bg-black/60 backdrop-blur-md p-0 md:p-4">
          <div className="w-full max-w-xl animate-in fade-in zoom-in duration-200">
            <PricingForm onSave={handleSave} onCancel={closeModal} pricing={editing} />
          </div>
        </div>
      )}
    </div>
  );
}