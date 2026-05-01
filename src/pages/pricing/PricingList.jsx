// FILE: src/pages/pricing/PricingList.jsx

import { useState } from "react";
import { Plus } from "lucide-react";

import { Pagination } from "../../components/Pagination";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { formatCommune } from "../../utils/formatter";
import {
  fetchPricing,
  createPricing,
  updatePricing,
//   deletePricing,
  togglePricing
} from "../../api/pricing.api";

import { notifySuccess, notifyError } from "../../utils/notify";

import PricingForm from "./PricingForm";
import PageLoader from "../../components/ui/PageLoader";

export default function PricingList() {

  // ======================
  // HOOK
  // ======================
  const {
    data: pricing = [],
    meta,
    loading,
    setPage,
    refresh
  } = usePaginatedFetch(fetchPricing, 10);

  // ======================
  // STATE
  // ======================
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("ALL");

  // ======================
  // CREATE / UPDATE
  // ======================
  const handleSave = async (data) => {
    try {

      if (data._id) {
        await updatePricing(data._id, data);
        notifySuccess("Tarif mis à jour");
      } else {
        await createPricing(data);
        notifySuccess("Tarif créé");
      }

      setShowForm(false);
      setEditing(null);
      refresh();

    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  // ======================
  // TOGGLE
  // ======================
  const handleToggle = async (item) => {
    try {
      await togglePricing(item._id);
      refresh();
      notifySuccess("Statut mis à jour");
    } catch (err) {
      notifyError(err.message);
    }
  };

  // ======================
  // FILTER
  // ======================
  const filtered = pricing.filter((p) => {
    if (filter === "ALL") return true;
    return filter === "ACTIVE" ? p.isActive : !p.isActive;
  });

  // ======================
  // STATUS UI
  // ======================
  const statusBadge = (active) =>
    active
      ? "bg-emerald-50 text-emerald-700 border-emerald-100/60"
      : "bg-slate-100 text-slate-500 border-slate-200";

  const closeModal = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50/50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Tarification
          </h1>
          <p className="text-slate-500">
            Gestion des prix de livraison
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl"
        >
          <Plus size={16} />
          Nouveau tarif
        </button>

      </div>

      {/* FILTERS */}
      <div className="flex gap-2">
        {["ALL", "ACTIVE", "INACTIVE"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
              filter === f
                ? "bg-primary text-white"
                : "bg-white text-slate-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-50 text-xs text-slate-400 uppercase">
            <tr>
              <th className="p-4 text-left">De</th>
              <th className="text-left">À</th>
              <th className="text-left">Type</th>
              <th className="text-left">Base</th>
              <th className="text-left">/Km</th>
              <th className="text-center">Statut</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="group border-t hover:bg-emerald-50/30 transition">

                <td className="p-4 font-medium">{formatCommune(p.from)}</td>
                <td>{formatCommune(p.to)}</td>
                <td>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                    {p.pricingType}
                  </span>
                </td>
                <td>{p.basePrice} FCFA</td>
                <td>{p.pricePerKm} FCFA</td>

                <td className="text-center">
                  <span className={`px-3 py-1 rounded-full text-xs border ${statusBadge(p.isActive)}`}>
                    {p.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>

                <td className="text-right p-4 flex justify-end gap-2">

                  <button
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleToggle(p)}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-bold transition
                      text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white"
                  >
                    {p.isActive ? "Désactiver" : "Activer"}
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>


      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">

          <div className="animate-fadeIn w-full flex justify-center">
            <PricingForm
              onSave={handleSave}
              onCancel={closeModal}
              pricing={editing}
            />
          </div>

        </div>
      )}
      <Pagination meta={meta} setPage={setPage} />

    </div>
  );
}