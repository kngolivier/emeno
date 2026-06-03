// FILE: src/components/services/ServicesCarousel.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAll, getWhatsappLink } from "../../api/service.api";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ServicesCarousel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);

    const loadServices = async () => {
      try {
        const res = await getAll({ activeOnly: true });
        setServices(res.data?.data || res.data || []);
        console.log("Services chargés :", res.data?.data || res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) return null;

  if (!services.length) {
    return (
      <div className="text-center py-10 text-slate-400 text-xs font-black uppercase">
        Aucun service disponible
      </div>
    );
  }

  const fallbackImage =
    "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-light.png";

  const handleClick = async (service) => {
    const mode = service?.pricingMode;

    if (mode === "WHATSAPP_ONLY") {
      try {
        const res = await getWhatsappLink(service._id);

        const link =
          res?.data?.link || res?.data?.data?.link;
        console.log("Lien WhatsApp reçu :", link);

        if (link) {
          window.open(link, "_blank");
        } else {
          console.error("Lien WhatsApp introuvable");
        }
      } catch (err) {
        console.error("Erreur WhatsApp link:", err);
      }
      return;
    }

    if (user && user.role === "CLIENT") {
      navigate("/client/new-order", {
        state: { selectedService: service },
      });
      return;
    }

    navigate(`/services/details/${service._id}`);
  };

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
            onClick={() => handleClick(s)}
            className="min-w-[260px] md:min-w-[300px] cursor-pointer rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#071120] shadow-sm"
          >

            <img
              src={s.image?.url || fallbackImage}
              onError={(e) => (e.target.src = fallbackImage)}
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
                  {s.pricingMode === "WHATSAPP_ONLY"
                    ? "Commander sur WhatsApp"
                    : user?.role === "CLIENT"
                      ? "Créer une commande"
                      : "Voir les détails"}
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