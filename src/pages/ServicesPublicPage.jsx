// FILE: src/pages/ServicesPublicPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAll } from "../../../api/service.api";

export default function ServicesPublicPage() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAll({ activeOnly: true })
      .then((res) => setServices(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      
      <h1 className="text-2xl font-black text-primary dark:text-white mb-6 uppercase italic">
        Nos Services
      </h1>

      {/* CAROUSEL */}
      <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4">

        {services.map((s) => (
          <div
            key={s._id}
            onClick={() => navigate(`/services/${s._id}`)}
            className="min-w-[260px] md:min-w-[320px] snap-center cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src={s.image?.url}
              alt={s.title}
              className="h-44 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="font-black text-primary dark:text-white uppercase italic">
                {s.title}
              </h2>

              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {s.description}
              </p>

              <div className="mt-3 text-[10px] font-black uppercase text-secondary">
                Voir détails →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}