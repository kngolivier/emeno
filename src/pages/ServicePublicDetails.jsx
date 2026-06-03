// FILE: src/pages/ServicePublicDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getById } from "../api/service.api";
import { ArrowLeft, MessageCircle, CheckCircle } from "lucide-react";

const unwrap = (res) =>
  res?.data?.data || res?.data?.service || res?.data || res;

export default function ServicePublicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getById(id)
      .then((res) => setService(unwrap(res)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-slate-400 font-bold uppercase text-xs">
        Chargement...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-6 text-red-400 font-black uppercase text-xs">
        Service introuvable
      </div>
    );
  }

  const whatsapp = service.whatsappNumber?.replace(/\D/g, "");
  const imageFallback =
    "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-light.png";

  const benefits = service.benefits?.length
    ? service.benefits
    : ["Service rapide", "Support client inclus", "Qualité garantie"];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase"
      >
        <ArrowLeft size={14} /> Retour
      </button>

      {/* IMAGE */}
      <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <img
          src={service.image?.url || imageFallback}
          onError={(e) => (e.target.src = imageFallback)}
          className="h-64 w-full object-cover"
          alt={service.title}
        />
      </div>

      {/* CONTENT */}
      <div className="space-y-4">

        <h1 className="text-2xl font-black text-primary dark:text-white uppercase italic">
          {service.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          {service.description}
        </p>

        {/* BENEFITS */}
        <div className="space-y-2">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
            >
              <CheckCircle size={14} className="text-emerald-500" />
              {b}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800">

          <p className="text-xs font-black uppercase text-slate-400 mb-2">
            Prêt à commander ?
          </p>

          <button
            disabled={!whatsapp}
            onClick={() => window.open(`https://wa.me/${whatsapp}`, "_blank")}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white font-black uppercase text-xs py-4 rounded-2xl"
          >
            <MessageCircle size={16} />
            Commander sur WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}