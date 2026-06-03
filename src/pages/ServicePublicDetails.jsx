// FILE: src/pages/ServicePublicDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getById } from "../api/service.api"
import { ArrowLeft, MessageCircle, CheckCircle } from "lucide-react";

export default function ServicePublicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);

  useEffect(() => {
    getById(id)
      .then((res) => setService(res.data))
      .catch(console.error);
  }, [id]);

  if (!service) {
    return <div className="p-6 text-slate-400">Chargement...</div>;
  }

  const whatsapp = service.whatsappNumber?.replace(/\D/g, "");

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-4"
      >
        <ArrowLeft size={14} /> Retour
      </button>

      {/* HERO */}
      <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <img
          src={service.image?.url}
          className="h-64 w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="mt-6 space-y-4">

        <h1 className="text-2xl font-black text-primary dark:text-white uppercase italic">
          {service.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          {service.description}
        </p>

        {/* BENEFITS (si dispo sinon fallback) */}
        <div className="space-y-2">
          {(service.benefits || [
            "Service rapide",
            "Support client inclus",
            "Qualité garantie"
          ]).map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle size={14} className="text-emerald-500" />
              {b}
            </div>
          ))}
        </div>

        {/* CTA BOX */}
        <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800">

          <p className="text-xs font-black uppercase text-slate-400 mb-2">
            Prêt à commander ?
          </p>

          <button
            onClick={() => window.location.href = `https://wa.me/${whatsapp}`}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black uppercase text-xs py-4 rounded-2xl"
          >
            <MessageCircle size={16} />
            Commander sur WhatsApp
          </button>

        </div>

      </div>
    </div>
  );
}