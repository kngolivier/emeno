// FILE: src/components/services/ServicesCarousel.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAll } from "../../api/service.api";
import { ArrowRight } from "lucide-react";

export default function ServicesCarousel() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAll({ activeOnly: true })
      .then((res) => setServices(res.data?.data || res.data || []))
      .catch(console.error);
  }, []);

  if (!services.length) return null;

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="flex gap-5 px-1">
        {services.map((s, index) => (
          <motion.div
            key={s._id}
            whileHover={{ y: -6, scale: 1.02 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/services/details/${s._id}`)}
            className="min-w-[260px] md:min-w-[300px] cursor-pointer rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#071120] shadow-sm"
          >
            <img
              src={s.image?.url}
              alt={s.title}
              className="h-40 w-full object-cover"
            />

            <div className="p-5 space-y-2">
              <h3 className="font-black text-primary dark:text-white uppercase italic">
                {s.title}
              </h3>

              <p className="text-sm text-slate-500 dark:text-white/40 line-clamp-2">
                {s.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-black uppercase text-secondary">
                  Voir détails
                </span>
                <ArrowRight size={16} className="text-secondary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}