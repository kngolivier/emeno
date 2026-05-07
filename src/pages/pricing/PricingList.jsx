// FILE: src/pages/pricing/PricingList.jsx

import { useState } from "react";
import { Plus, Edit2, Power, ArrowRight, ArrowLeft, Banknote, Navigation } from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { formatCommune } from "../../utils/formatter";
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
    <div className="p-4 md:p-0 space-y-6 md:space-y-10 font-sans pb-10 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-5xl font-black text-primary font-display italic tracking-tighter uppercase leading-none">
            Tarification
          </h1>
          <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">
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
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { label: "Tous", value: "ALL" },
          { label: "Actifs", value: "true" },
          { label: "Suspendus", value: "false" }
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`whitespace-nowrap px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${status === f.value ? "bg-primary text-white border-primary shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* MOBILE VIEW (Visible sur mobile et tablette) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {pricing.length > 0 ? (
          pricing.map((p) => (
            <div key={p._id} className={`bg-white p-6 rounded-[2rem] border border-slate-50 shadow-soft transition-opacity ${!p.isActive ? "opacity-70" : ""}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-display font-black text-primary italic uppercase text-sm tracking-tighter">
                    <span>{formatCommune(p.from)}</span>
                    <ArrowRight size={12} className="text-secondary" />
                    <span>{formatCommune(p.to)}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Trajet standard</span>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${p.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                  {p.isActive ? "Actif" : "Suspendu"}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="text-xl font-black text-primary italic">
                  {p.basePrice?.toLocaleString()} <span className="text-[10px] not-italic opacity-40 uppercase">CFA</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-3 text-slate-300 active:text-secondary transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleToggle(p)} className={`p-3 transition-colors ${p.isActive ? "text-slate-200 active:text-red-500" : "text-emerald-400"}`}>
                    <Power size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-10 rounded-[2rem] text-center text-slate-400 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-200">
            Aucun tarif trouvé
          </div>
        )}
      </div>

      {/* DESKTOP TABLE (Visible uniquement sur grand écran) */}
      <div className="hidden lg:block bg-white border border-slate-50 rounded-[2.5rem] shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 border-b border-slate-50">
            <tr>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trajet / Corridor</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix de base</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pricing.length > 0 ? (
              pricing.map((p) => (
                <tr key={p._id} className={`hover:bg-slate-50/20 transition-colors ${!p.isActive ? "opacity-60" : ""}`}>
                  <td className="p-8">
                    <div className="flex items-center gap-4 font-display font-black text-primary italic text-xl tracking-tighter uppercase">
                      <span>{formatCommune(p.from)}</span>
                      <ArrowRight size={14} className="text-secondary" />
                      <span>{formatCommune(p.to)}</span>
                    </div>
                  </td>
                  <td className="p-8 text-xl font-black text-primary italic">
                    {p.basePrice?.toLocaleString()} <span className="text-[10px] not-italic opacity-40 uppercase">CFA</span>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border ${p.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                      {p.isActive ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-3 text-slate-300 hover:text-secondary rounded-xl transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleToggle(p)} className={`p-3 rounded-xl transition-all ${p.isActive ? "text-slate-200 hover:text-red-500" : "text-emerald-400"}`}>
                        <Power size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center text-slate-300 font-bold uppercase tracking-[0.2em] text-[10px]">
                  Aucune donnée disponible dans cette catégorie
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pt-6">
        <Pagination meta={meta} setPage={setPage} />
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-primary/40 backdrop-blur-md p-0 md:p-4">
          <div className="w-full max-w-xl animate-in fade-in zoom-in duration-200">
            <PricingForm onSave={handleSave} onCancel={closeModal} pricing={editing} />
          </div>
        </div>
      )}
    </div>
  );
}