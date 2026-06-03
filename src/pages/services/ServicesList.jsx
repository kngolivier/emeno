// FILE: src/pages/services/ServicesList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

import { getAll, remove } from "../../api/service.api";
import { notifyError, notifySuccess } from "../../utils/notify";
import PageLoader from "../../components/ui/PageLoader";

import ServiceForm from "./ServiceForm";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const loadServices = async () => {
    try {
      const res = await getAll();

      const data = res?.data?.data || res?.data || [];
      setServices(data);
    } catch (err) {
      notifyError("Erreur chargement services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce service ?")) return;

    try {
      await remove(id);
      notifySuccess("Service supprimé");
      loadServices();
    } catch (err) {
      notifyError("Erreur suppression");
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Services</h1>
          <p className="text-sm text-gray-500">Gestion des services EMENO</p>
        </div>

        <button
          onClick={() => {
            setSelectedService(null);
            setShowForm(true);
          }}
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
              <Link
                to={`/admin/services/${s._id}`}
                className="text-blue-500"
              >
                <Eye size={18} />
              </Link>

              <button
                onClick={() => handleEdit(s)}
                className="text-yellow-500"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => handleDelete(s._id)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <ServiceForm
          service={selectedService}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadServices();
          }}
        />
      )}
    </div>
  );
}