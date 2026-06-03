// FILE: src/pages/services/ServicesList.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2, Eye } from "lucide-react";

import { getAll, remove } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import ServiceForm from "./ServiceForm";
import { useCrudList } from "../../hooks/useCrudList";

const normalize = (res) => res?.data?.data || res?.data || [];

/* =========================
   🌍 TRANSLATIONS / LABELS
========================= */

const SERVICE_TYPE_LABELS = {
  STANDARD: "Standard",
  EXPRESS: "Express",
  PRIVATE: "Privé",
  ADMIN: "Administration",
  CARE: "Service client",
  BUSINESS: "Business",
};

const PRICING_MODE_LABELS = {
  BASE_PRICING: "Tarification de base",
  WHATSAPP_ONLY: "Sur WhatsApp uniquement",
};

const STATUS_LABELS = {
  true: { label: "Actif", className: "bg-emerald-500/10 text-emerald-500" },
  false: { label: "Inactif", className: "bg-rose-500/10 text-rose-500" },
};

export default function ServicesList() {
  const { data: services, loading, refresh } = useCrudList(getAll, { normalize });

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce service ?")) return;

    setDeletingId(id);
    try {
      await remove(id);
      notifySuccess("Service supprimé");
      refresh();
    } catch {
      notifyError("Erreur suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setShowForm(true);
  };

  const openEdit = (service) => {
    setSelected(service);
    setShowForm(true);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Services</h1>
          <p className="text-sm text-gray-500">
            Gestion des services EMENO
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold"
        >
          <Plus size={16} />
          Nouveau service
        </button>
      </div>

      {/* EMPTY */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
          <Plus className="text-primary mb-3" size={28} />
          <h2 className="text-xl font-black">Aucun service</h2>
          <p className="text-sm text-gray-500 mt-2">
            Créez votre premier service pour commencer
          </p>
        </div>
      ) : (
        <>
          {/* =========================
              📱 CARDS MOBILE
          ========================== */}
          <div className="grid md:grid-cols-2 lg:hidden gap-4">
            {services.map((s) => {
              const isActive = s.isActive ?? true;

              return (
                <div
                  key={s._id}
                  className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="font-black text-lg">{s.title}</h2>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-black ${
                        STATUS_LABELS[isActive].className
                      }`}
                    >
                      {STATUS_LABELS[isActive].label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {s.description}
                  </p>

                  {/* TYPE */}
                  <div className="text-xs">
                    <span className="text-gray-400 font-bold">Type :</span>{" "}
                    {SERVICE_TYPE_LABELS[s.type] || s.type}
                  </div>

                  {/* MODE (AMÉLIORÉ) */}
                  <div className="text-xs">
                    <span className="text-gray-400 font-bold">Mode :</span>{" "}
                    {PRICING_MODE_LABELS[s.pricingMode] || s.pricingMode}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between pt-3">
                    <Link
                      to={`/admin/services/${s._id}`}
                      className="text-blue-500"
                    >
                      <Eye size={18} />
                    </Link>

                    <button
                      onClick={() => openEdit(s)}
                      className="text-yellow-500"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(s._id)}
                      disabled={deletingId === s._id}
                      className="text-red-500 disabled:opacity-40"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================
              🖥️ TABLE DESKTOP
          ========================== */}
          <div className="hidden lg:block bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="p-4 text-xs font-black uppercase">Service</th>
                  <th className="p-4 text-xs font-black uppercase">Type</th>
                  <th className="p-4 text-xs font-black uppercase">Mode</th>
                  <th className="p-4 text-xs font-black uppercase">Statut</th>
                  <th className="p-4 text-xs font-black uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {services.map((s) => {
                  const isActive = s.isActive ?? true;

                  return (
                    <tr
                      key={s._id}
                      className="border-t dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-black">{s.title}</p>
                          <p className="text-xs text-gray-500">
                            {s.description}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 text-sm">
                        {SERVICE_TYPE_LABELS[s.type] || s.type}
                      </td>

                      <td className="p-4 text-sm">
                        {PRICING_MODE_LABELS[s.pricingMode] || s.pricingMode}
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-black ${
                            STATUS_LABELS[isActive].className
                          }`}
                        >
                          {STATUS_LABELS[isActive].label}
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/admin/services/${s._id}`}
                          className="text-blue-500"
                        >
                          <Eye size={18} />
                        </Link>

                        <button
                          onClick={() => openEdit(s)}
                          className="text-yellow-500"
                        >
                          <Edit3 size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(s._id)}
                          className="text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MODAL */}
      {showForm && (
        <ServiceForm
          service={selected}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}