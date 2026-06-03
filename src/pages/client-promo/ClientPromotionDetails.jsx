// FILE: src/pages/client-promo/ClientPromotionDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Gift,
  Tag,
  ShoppingBag,
} from "lucide-react";

import {
  fetchPromotionById,
  generateWhatsAppLink,
} from "../../api/promotions.api";

import { fetchPartnerProducts } from "../../api/products.api";
import { computeDiscount } from "../../utils/pricing/computeDiscount";

export default function ClientPromotionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [promo, setPromo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      // 1. promo
      const promoRes = await fetchPromotionById(id);
      const promoData = promoRes?.data?.data || promoRes?.data;
      setPromo(promoData);

      // 2. products (si partner promo)
      const partnerId = promoData?.partnerId?._id || promoData?.partnerId;

      if (partnerId) {
        const prodRes = await fetchPartnerProducts(partnerId);
        const prodData =
          prodRes?.data?.data || prodRes?.data || [];

        setProducts(Array.isArray(prodData) ? prodData : []);
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOrder = async (product) => {
    if (!promo) return;

    try {
      setSendingId(product._id);

      const res = await generateWhatsAppLink({
        promoId: promo._id,
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
      });

      const link =
        res?.data?.link || res?.data?.data?.link;

      if (link) {
        window.location.href = link;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-white/10 rounded-2xl" />
        <div className="h-20 bg-slate-200 dark:bg-white/10 rounded-xl" />
        <div className="h-24 bg-slate-200 dark:bg-white/10 rounded-xl" />
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

      {/* HERO PROMO */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 text-white relative overflow-hidden"
      >
        <div className="absolute top-[-40px] right-[-40px] w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-black/10 rounded-full" />

        <Gift size={28} />
        <h2 className="text-2xl font-black mt-3">
          {promo.title}
        </h2>
        <p className="text-white/80 mt-2 text-sm">
          {promo.description}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
          <Tag size={14} />
          {promo.code}
        </div>
      </motion.div>

      {/* INTRO */}
      <div className="px-4 mt-6">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Choisissez un produit ci-dessous et commandez directement via WhatsApp.
            EMENO transmettra votre commande au partenaire avec votre promotion appliquée.
          </p>
        </div>
      </div>

      {/* PRODUITS */}
      <div className="px-4 mt-6 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-600 dark:text-white">
          <ShoppingBag size={16} />
          Produits disponibles
        </div>

        {products.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 bg-slate-100 dark:bg-white/5 rounded-xl">
            Aucun produit disponible pour cette promotion.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => {
              const { price, oldPrice, percent } = computeDiscount(
                product.price,
                promo
              );

              const isHotDeal = percent >= 15;

              return (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-2xl border transition
                    ${
                      isHotDeal
                        ? "border-green-400 bg-green-50 dark:bg-green-500/10"
                        : "border-slate-100 dark:border-white/10 bg-white dark:bg-white/5"
                    }`}
                >
                  {/* HEADER PRODUIT */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold">{product.name}</h3>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>

                      {/* PRIX */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-lg font-black text-green-600">
                          {price.toLocaleString()} XAF
                        </span>

                        {oldPrice && (
                          <span className="text-sm line-through text-slate-400">
                            {oldPrice.toLocaleString()} XAF
                          </span>
                        )}

                        {percent > 0 && (
                          <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-full">
                            -{percent}%
                          </span>
                        )}
                      </div>

                      {/* BONUS MESSAGE MARKETING */}
                      {percent > 0 && (
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          💡 Vous économisez {(
                            oldPrice - price
                          ).toLocaleString()} XAF avec cette promo
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleOrder(product)}
                    disabled={sendingId === product._id}
                    className={`mt-4 w-full flex items-center justify-center gap-2 h-10 rounded-xl font-bold transition
                      ${
                        isHotDeal
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                  >
                    <MessageCircle size={16} />
                    {sendingId === product._id
                      ? "Ouverture..."
                      : "Commander sur WhatsApp"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}