// FILE: src/pages/client-promo/PromotionDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Gift, Tag } from "lucide-react";

import { fetchPromotionById, generateWhatsAppLink } from "../../api/promotions.api";

export default function ClientPromotionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadPromo();
  }, [id]);

  async function loadPromo() {
    try {
      setLoading(true);
      const res = await fetchPromotionById(id);
      const data = res?.data?.data || res?.data;
      setPromo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleWhatsApp = async () => {
    if (!promo) return;

    try {
      setSending(true);

      const res = await generateWhatsAppLink({
        promoId: promo._id,
      });

      const link = res?.data?.link || res?.data?.data?.link;

      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-white/10 rounded-2xl" />
        <div className="h-20 bg-slate-200 dark:bg-white/10 rounded-xl" />
        <div className="h-12 bg-slate-200 dark:bg-white/10 rounded-xl" />
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="p-6 text-center text-slate-500">
        Promotion introuvable
      </div>
    );
  }

  return (
    <div className="pb-28">
      {/* HEADER */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="font-black text-lg">{promo.title}</h1>
          <p className="text-xs text-slate-500">{promo.badge}</p>
        </div>
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 text-white relative overflow-hidden"
      >
        <div className="absolute top-[-40px] right-[-40px] w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-black/10 rounded-full" />

        <div className="relative z-10">
          <Gift size={28} />
          <h2 className="text-2xl font-black mt-3">{promo.title}</h2>
          <p className="text-white/80 mt-2 text-sm">
            {promo.description}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            <Tag size={14} />
            {promo.code}
          </div>
        </div>
      </motion.div>

      {/* INFO SECTION */}
      <div className="px-4 mt-6 space-y-3">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5">
          <p className="text-xs text-slate-500">Comment ça marche</p>
          <p className="text-sm mt-1">
            Cliquez sur le bouton ci-dessous pour ouvrir une conversation WhatsApp avec le partenaire et profiter de cette offre via EMENO.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#071120] border-t border-slate-200 dark:border-white/10">
        <button
          onClick={handleWhatsApp}
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition"
        >
          <MessageCircle size={18} />
          {sending ? "Ouverture..." : "Contacter le partenaire sur WhatsApp"}
        </button>
      </div>
    </div>
  );
}