// FILE: src/pages/services/ServicesList.jsx

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

import { getAll, remove } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";
import ServiceForm from "./ServiceForm";
import { useCrudList } from "../../hooks/useCrudList";

const normalize = (res) =>
  res?.data?.data || res?.data || [];

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

  // LIST
  if (services.length === 0) {
    return (
      <div className="p-4 md:p-6 space-y-6">

        {/* HEADER (on garde le header même en empty state) */}
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

        {/* EMPTY STATE */}
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
          
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="text-primary" size={24} />
          </div>

          <h2 className="text-xl font-black text-gray-800 dark:text-white">
            Aucun service créé
          </h2>

          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Commencez par créer votre premier service pour le rendre disponible sur la plateforme EMENO.
          </p>

          <button
            onClick={openCreate}
            className="mt-6 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            <Plus size={16} />
            Créer un service
          </button>
        </div>

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

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Services</h1>
          <p className="text-sm text-gray-500">Gestion des services EMENO</p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold"
        >
          <Plus size={16} />
          Nouveau service
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s._id}
            className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 rounded-2xl space-y-3"
          >
            <div className="flex justify-between">
              <h2 className="font-black text-lg">{s.title}</h2>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-lg">
                {s.type}
              </span>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2">
              {s.description}
            </p>

            <div className="text-xs text-gray-400">
              Mode: {s.pricingMode}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between pt-3">
              <Link to={`/admin/services/${s._id}`} className="text-blue-500">
                <Eye size={18} />
              </Link>

              <button onClick={() => openEdit(s)} className="text-yellow-500">
                <Edit size={18} />
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
        ))}
      </div>

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