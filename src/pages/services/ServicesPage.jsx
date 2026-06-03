// FILE: src/pages/services/ServicesPage.jsx

import { useEffect, useState } from "react";
import { getAll, remove } from "../../../api/service.api";
import { Plus, Trash2, Edit } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  const loadServices = async () => {
    try {
      const res = await getAll();
      setServices(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce service ?")) return;

    await remove(id);
    loadServices();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Services</h1>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded">
          <Plus size={16} />
          Nouveau service
        </button>
      </div>

      <div className="grid gap-3">
        {services.map((s) => (
          <div key={s._id} className="border p-3 rounded flex justify-between">
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-gray-500">{s.type}</p>
              <p className="text-xs">{s.pricingMode}</p>
            </div>

            <div className="flex gap-2">
              <button className="text-blue-600">
                <Edit size={18} />
              </button>

              <button
                className="text-red-600"
                onClick={() => handleDelete(s._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}