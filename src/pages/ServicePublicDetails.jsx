// FILE: src/pages/ServicePublicDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getById } from "../api/service.api";
import {
  ArrowLeft,
  MessageCircle,
  CheckCircle,
  Sparkles,
  LogIn
} from "lucide-react";

import PageLoader from "../components/ui/PageLoader";
import { useAuth } from "../context/AuthContext";
import { MODE_LABELS } from "../constants/constants";
import Navbar from "../components/landing/Navbar";

const unwrap = (res) =>
  res?.data?.data || res?.data?.service || res?.data || res;

export default function ServicePublicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    setLoading(true);

    getById(id)
      .then((res) => setService(unwrap(res)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsImageOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading) return <PageLoader />;

  if (!service) {
    return (
      <div className="p-10 text-center text-red-400 font-black uppercase text-xs">
        Service introuvable
      </div>
    );
  }

  const whatsapp = service.whatsappNumber?.replace(/\D/g, "");
  const image =
    service.image?.url ||
    "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/service-light.png";

  const benefits = service.benefits?.length
    ? service.benefits
    : [
        "Service rapide et fiable",
        "Support client disponible",
        "Qualité garantie",
        "Suivi en temps réel"
      ];

  const handleWhatsApp = () => {
    const msg = `Bonjour 👋, je suis intéressé par le service "${service.title}".`;
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">

      <Navbar />
      {/* BACK BUTTON */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-black text-[10px] uppercase tracking-widest transition"
        >
          <ArrowLeft size={14} />
          Retour
        </button>
      </div>

      {/* HERO */}
      <div className="max-w-5xl mx-auto mt-4 px-4">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">

          <div className="relative group cursor-pointer" onClick={() => setIsImageOpen(true)}>
            <img
              src={image}
              alt={service.title}
              className="h-[320px] md:h-[420px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* petit hint UX */}
            <div className="absolute top-4 right-4 bg-black/40 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur">
              Cliquer pour agrandir
            </div>

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* content */}
          <div className="absolute bottom-0 p-6 md:p-10 text-white space-y-3">

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-[10px] font-black uppercase bg-white/10 backdrop-blur rounded-full">
                {service.pricingMode === "WHATSAPP_ONLY"
                  ? "WhatsApp uniquement"
                  : "Commande disponible"}
              </span>

              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-300">
                <Sparkles size={12} />
                Premium
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black uppercase italic leading-tight">
              {service.title}
            </h1>

            <p className="text-sm text-white/80 max-w-xl">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 mt-10 space-y-10">

        {/* BENEFITS */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">

          <h2 className="text-lg font-black uppercase text-primary dark:text-white mb-4">
            Pourquoi choisir ce service ?
          </h2>

          <div className="grid md:grid-cols-2 gap-3">
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
        </div>

        {/* INFO BOX */}
        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Type
            </p>
            <p className="font-black text-primary dark:text-white mt-1">
              {service.type}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Mode
            </p>
            <p className="font-black text-primary dark:text-white mt-1">
              {MODE_LABELS[service.pricingMode]}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Support
            </p>
            <p className="font-black text-primary dark:text-white mt-1">
              24/7
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary to-slate-900 text-white p-6 md:p-8 rounded-[2rem] shadow-xl">

          <h3 className="text-lg font-black uppercase text-white">
            Prêt à utiliser ce service ?
          </h3>

          <p className="text-sm text-white/70 mt-2">
            Lancez votre demande maintenant et obtenez une prise en charge rapide.
          </p>

          <div className="mt-5">

            {/* CONNECTÉ */}
            {user ? (
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 font-black uppercase text-xs py-4 rounded-2xl transition"
              >
                <MessageCircle size={16} />
                Commander maintenant
              </button>
            ) : (
              <div className="space-y-3">

                <button
                  onClick={() => navigate("/login")}
                  className="w-full flex items-center justify-center gap-2 bg-white text-primary font-black uppercase text-xs py-4 rounded-2xl hover:bg-slate-100 transition"
                >
                  <LogIn size={16} />
                  Se connecter pour commander
                </button>

                <p className="text-[10px] text-white/60 text-center">
                  Connectez-vous pour accéder à la commande instantanée
                </p>

              </div>
            )}

          </div>
        </div>

      </div>

        {isImageOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsImageOpen(false)}
        >
          <img
            src={image}
            alt={service.title}
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl shadow-2xl"
          />

          {/* bouton fermer */}
          <button
            onClick={() => setIsImageOpen(false)}
            className="absolute top-4 right-4 text-white text-xs font-black uppercase bg-white/10 px-4 py-2 rounded-xl backdrop-blur hover:bg-white/20"
          >
            Fermer
          </button>
        </div>
      )}
      <div className="h-10" />
    </div>
  );
}