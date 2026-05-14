// FILE: src/pages/client-portal/ClientHome.jsx

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Bell,
  ChevronRight,
  Globe,
  HeartHandshake,
  LayoutDashboard,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Zap,
  Gift,
  Coins,
  Headphones,
  Boxes,
  PlayCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/Theme/ThemeContext";

import { fetchClientDeliveries } from "../../api/deliveries.api";
import { fetchMyStats } from "../../api/stats.api";

import PageLoader from "../../components/ui/PageLoader";
import { STATUS_LABELS } from "../../constants/constants";

/* ==========================================================================
   HERO SLIDES
   ========================================================================== */

const heroSlides = [
  {
    id: 1,
    tag: "Livraison premium",
    title: "Livrez",
    accent: "Partout",
    description:
      "Expédiez vos colis rapidement avec suivi temps réel et notifications instantanées.",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1800&auto=format&fit=crop",
    cta: "Nouvelle commande",
    route: "/client/new-order",
  },
  {
    id: 2,
    tag: "Programme fidélité",
    title: "Cumulez",
    accent: "Des points",
    description:
      "Recevez des récompenses et des livraisons offertes grâce à votre fidélité.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1800&auto=format&fit=crop",
    cta: "Voir mes avantages",
    route: "/client/dashboard",
  },
  {
    id: 3,
    tag: "Tracking intelligent",
    title: "Suivi",
    accent: "Temps réel",
    description:
      "Suivez vos colis et vos livreurs directement depuis EMENO Livraison.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1800&auto=format&fit=crop",
    cta: "Mes livraisons",
    route: "/client/orders",
  },
];

/* ==========================================================================
   SERVICES
   ========================================================================== */

const services = [
  {
    title: "Express",
    desc: "Livraison rapide partout.",
    icon: Zap,
  },
  {
    title: "Tracking GPS",
    desc: "Suivi temps réel.",
    icon: MapPin,
  },
  // {
  //   title: "Paiement sécurisé",
  //   desc: "Transactions sécurisées.",
  //   icon: ShieldCheck,
  // },
  {
    title: "Support réactif",
    desc: "Une équipe à votre écoute.",
    icon: HeartHandshake,
  },
];

/* ==========================================================================
   PROMOTIONS
   ========================================================================== */

const promotions = [
  {
    title: "1 course offerte",
    desc: "Toutes les 5 livraisons.",
    badge: "OFFRE",
    glow: "from-emerald-500/20",
  },
  {
    title: "-10% Nelia's Care",
    desc: "Code EMENO10.",
    badge: "PARTENAIRE",
    glow: "from-amber-500/20",
  },
  {
    title: "Points fidélité",
    desc: "Débloquez des avantages.",
    badge: "FIDÉLITÉ",
    glow: "from-cyan-500/20",
  },
];

/* ==========================================================================
   PARTNERS
   ========================================================================== */

const defaultDarkBg =
  // "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop";
  "./logo.png";

const defaultLightBg =
  // "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop";
  "./logo-dark.png"

const partners = [
  {
    name: "Nelia's Care",
    category: "Cosmétique",
  },
  {
    name: "Gabon Tech",
    category: "Électronique",
  },
  {
    name: "AfroPharma",
    category: "Santé",
  },
  {
    name: "BioShop",
    category: "Alimentaire",
  },
];

/* ==========================================================================
   MAIN
   ========================================================================== */

export default function ClientHome() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { isDarkMode } = useTheme();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);

  const [activeDelivery, setActiveDelivery] = useState(null);

  const slide = useMemo(
    () => heroSlides[currentSlide],
    [currentSlide]
  );

  /* ==========================================================================
     AUTO SLIDE
     ========================================================================== */

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  /* ==========================================================================
     LOAD DATA
     ========================================================================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [statsRes, deliveriesRes] = await Promise.all([
          fetchMyStats("MONTH"),
          fetchClientDeliveries(),
        ]);

        const statsData = statsRes?.data || statsRes;

        setStats(statsData);

        const deliveries =
          deliveriesRes?.data?.data ||
          deliveriesRes?.data ||
          [];

        if (Array.isArray(deliveries)) {
          const active = deliveries.find((d) =>
            [
              "PENDING",
              "ASSIGNED",
              "PICKED_UP",
              "IN_TRANSIT",
            ].includes(d.status)
          );

          setActiveDelivery(active || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  const statsCards = [
    {
      label: "Livraisons",
      value: stats?.completedOrders || 0,
      icon: Package,
    },
    {
      label: "Dépenses",
      value: `${(stats?.totalSpent || 0).toLocaleString()} F`,
      icon: Coins,
    },
    {
      label: "Commandes",
      value: stats?.totalOrders || 0,
      icon: Boxes,
    },
    {
      label: "Points",
      value: stats?.loyaltyPoints || 0,
      icon: Star,
    },
  ];

  return (
    <div className="pb-28">

      {/* ==========================================================================
          HERO
          ========================================================================== */}

      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] min-h-[350px] md:min-h-[560px] mx-4 md:mx-8 border border-slate-200/70 dark:border-white/[0.06]"
      >
        <AnimatePresence mode="wait">

          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_30%)]" />

          </motion.div>

        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center">

          <div className="grid lg:grid-cols-2 gap-10 w-full px-5 md:px-10 py-8 md:py-12">

            {/* LEFT */}

            <div className="max-w-xl flex flex-col justify-center">

              <span className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full border border-secondary/20 bg-secondary/10 backdrop-blur-xl text-secondary text-[9px] md:text-[11px] font-black uppercase tracking-[0.18em]">

                <Sparkles size={12} />

                {slide.tag}

              </span>

              <h1 className="mt-6 text-[2.2rem] md:text-[6.5rem] font-black uppercase italic leading-[0.88] tracking-[-0.08em] text-white">
                {slide.title}
                <br />

                <span className="text-secondary">
                  {slide.accent}
                </span>
              </h1>

              <p className="mt-5 text-sm md:text-lg text-white/70 leading-relaxed max-w-md">
                {slide.description}
              </p>

              {/* CTA */}

              <div className="flex flex-wrap gap-3 mt-7">

                <button
                  onClick={() => navigate(slide.route)}
                  className="group h-9 px-6 rounded-2xl bg-secondary hover:bg-secondary-light text-white text-xs md:text-sm font-black transition-all flex items-center gap-2 shadow-xl"
                >
                  {slide.cta}

                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                {/* <button className="h-12 px-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white text-xs md:text-sm font-bold flex items-center gap-2">

                  <PlayCircle size={17} />

                  Voir la démo

                </button> */}

              </div>

            </div>

            {/* RIGHT */}

            <div className="hidden lg:flex items-center justify-end">

              <div className="w-[360px] rounded-[2.5rem] border border-white/10 bg-black/20 backdrop-blur-2xl p-4 shadow-2xl">

                <div className="relative overflow-hidden rounded-[2rem] h-[430px] bg-gradient-to-br from-[#071120] via-[#0b1729] to-black border border-white/5">

                  <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:24px_24px]" />

                  <motion.div
                    animate={{
                      x: [0, 180, 0],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-1/2 left-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-2xl">
                      <Truck
                        size={24}
                        className="text-white"
                      />
                    </div>
                  </motion.div>

                  <div className="absolute left-4 right-4 bottom-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">
                          Livraison active
                        </p>

                        <h4 className="text-white text-xl font-black italic uppercase mt-1">
                          {
                            STATUS_LABELS[
                              activeDelivery?.status
                            ] || "En attente"
                          }
                        </h4>

                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                        <MapPin
                          size={20}
                          className="text-secondary"
                        />
                      </div>

                    </div>

                    <div className="mt-5 space-y-3">

                      <TrackingItem
                        active
                        label="Livreur assigné"
                      />

                      <TrackingItem
                        active={
                          [
                            "PICKED_UP",
                            "IN_TRANSIT",
                            "DELIVERED",
                          ].includes(
                            activeDelivery?.status
                          )
                        }
                        label="Colis récupéré"
                      />

                      <TrackingItem
                        active={
                          activeDelivery?.status ===
                            "IN_TRANSIT" ||
                          activeDelivery?.status ===
                            "DELIVERED"
                        }
                        label="Livraison imminente"
                      />

                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* INDICATORS */}

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">

          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-8 bg-secondary"
                  : "w-2 bg-white/30"
              }`}
            />
          ))}

        </div>
      </section>

      {/* ==========================================================================
          CONTENT
          ========================================================================== */}

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 md:mt-10 space-y-10">

        {/* ==========================================================================
            STATS
            ========================================================================== */}

        <section>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">

            {statsCards.map((item, index) => (
              <StatsCard
                key={index}
                {...item}
              />
            ))}

          </div>
        </section>

        {/* ==========================================================================
            ACTIVE DELIVERY
            ========================================================================== */}

        <section>

          <SectionHeader
            title="Livraison en cours"
            subtitle="Suivi intelligent"
            icon={Truck}
          />

          <div className="mt-5">

            {activeDelivery ? (

              <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#061120]">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_25%)]" />

                <div className="relative z-10 grid lg:grid-cols-[280px_1fr]">

                  {/* MAP */}

                  <div className="relative min-h-[230px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/[0.06] overflow-hidden">

                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-black/90" />

                    <div className="relative z-10 p-5 h-full flex items-center justify-center">

                      <div className="w-16 h-16 rounded-3xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shadow-2xl">

                        <Truck
                          size={28}
                          className="text-secondary"
                        />

                      </div>

                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="p-5 md:p-8">

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                      <div>

                        <h3 className="text-2xl md:text-4xl font-black italic uppercase text-primary dark:text-white">
                          #
                          {activeDelivery.orderNumber ||
                            activeDelivery._id?.slice(-8)}
                        </h3>

                        <p className="mt-3 text-sm text-slate-500 dark:text-white/50">
                          Destination
                        </p>

                        <h4 className="text-lg font-bold text-primary dark:text-white mt-1">
                          {activeDelivery.dropoffLocation ||
                            activeDelivery.receiverAddress ||
                            "Libreville"}
                        </h4>

                        <div className="mt-4 inline-flex px-4 py-2 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-black uppercase tracking-[0.18em]">
                          {
                            STATUS_LABELS[
                              activeDelivery.status
                            ]
                          }
                        </div>

                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/client/orders/${activeDelivery._id}`
                          )
                        }
                        className="h-12 px-5 rounded-2xl border border-secondary/20 bg-secondary/10 hover:bg-secondary/20 transition-all text-secondary text-xs font-black uppercase tracking-[0.18em] flex items-center justify-center gap-2"
                      >
                        Voir le suivi
                        <ArrowRight size={15} />
                      </button>

                    </div>

                    {/* TIMELINE */}

                    <div className="mt-8 grid grid-cols-4 gap-2 md:gap-5">

                      {[
                        {
                          key: "ASSIGNED",
                          label: "Assignée",
                        },
                        {
                          key: "PICKED_UP",
                          label: "Récupérée",
                        },
                        {
                          key: "IN_TRANSIT",
                          label: "En transit",
                        },
                        {
                          key: "DELIVERED",
                          label: "Livrée",
                        },
                      ].map((step, idx) => {

                        const order = [
                          "ASSIGNED",
                          "PICKED_UP",
                          "IN_TRANSIT",
                          "DELIVERED",
                        ];

                        const activeIndex =
                          order.indexOf(
                            activeDelivery.status
                          );

                        const currentIndex =
                          order.indexOf(step.key);

                        const done =
                          currentIndex <= activeIndex;

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center text-center"
                          >

                            <div className={`
                              w-10 h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all
                              ${
                                done
                                  ? "border-secondary bg-secondary/10"
                                  : "border-slate-300 dark:border-white/10"
                              }
                            `}>
                              <div className={`
                                w-3 h-3 rounded-full
                                ${
                                  done
                                    ? "bg-secondary"
                                    : "bg-slate-300 dark:bg-white/10"
                                }
                              `} />
                            </div>

                            <p className={`
                              mt-3 text-[10px] md:text-sm font-bold
                              ${
                                done
                                  ? "text-secondary"
                                  : "text-slate-400 dark:text-white/30"
                              }
                            `}>
                              {step.label}
                            </p>

                          </div>
                        );
                      })}

                    </div>

                  </div>
                </div>
              </div>

            ) : (

              <div className="rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10 p-10 text-center bg-white dark:bg-white/[0.02]">

                <Truck
                  size={32}
                  className="mx-auto text-slate-300 dark:text-white/20"
                />

                <p className="mt-4 text-sm font-bold text-slate-500 dark:text-white/40">
                  Aucune livraison active actuellement
                </p>

              </div>

            )}

          </div>
        </section>

        {/* ==========================================================================
            QUICK ACTIONS
            ========================================================================== */}

        <section>

          <SectionHeader
            title="Actions rapides"
            subtitle="Accès rapide"
            icon={Zap}
          />

          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5 mt-5">

            <QuickAction
              label="Nouvelle commande"
              icon={Plus}
              route="/client/new-order"
              highlight
            />

            <QuickAction
              label="Mes colis"
              icon={Package}
              route="/client/orders"
            />

            {/* <QuickAction
              label="Mes adresses"
              icon={MapPin}
              route="/client/addresses"
            /> */}

            {/* <QuickAction
              label="Support"
              icon={Headphones}
              route="/client/support"
            /> */}

            <QuickAction
              label="Notifications"
              icon={Bell}
              route="/client/notifications"
            />

            <QuickAction
              label="Dashboard"
              icon={LayoutDashboard}
              route="/client/dashboard"
            />

          </div>
        </section>

        {/* ==========================================================================
            SERVICES
            ========================================================================== */}

        <section>

          <SectionHeader
            title="Nos services"
            subtitle="EMENO Livraison"
            icon={ShieldCheck}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-5">

            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
              />
            ))}

          </div>
        </section>

        {/* ==========================================================================
            PROMOTIONS
            ========================================================================== */}

        <section>

          <div className="flex items-center justify-between mb-5">

            <SectionHeader
              title="Offres exclusives"
              subtitle="Promotions"
              icon={Gift}
            />

            <button className="text-secondary text-[10px] uppercase tracking-[0.18em] font-black flex items-center gap-1">
              Tout voir
              <ChevronRight size={14} />
            </button>

          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">

            {promotions.map((promo, index) => (
              <PromoCard
                key={index}
                {...promo}
              />
            ))}

          </div>
        </section>

        {/* ==========================================================================
            PARTNERS
            ========================================================================== */}

        <section>

          <SectionHeader
            title="Partenaires"
            subtitle="Écosystème EMENO"
            icon={Globe}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-5">

            {partners.map((partner, index) => (
              <PartnerCard
                key={index}
                {...partner}
                fallbackImage={
                  isDarkMode
                    ? defaultDarkBg
                    : defaultLightBg
                }
              />
            ))}

          </div>
        </section>

      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENTS
   ========================================================================== */

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}) {
  return (
    <div>

      <div className="flex items-center gap-2">

        <Icon
          size={14}
          className="text-secondary"
        />

        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-white/30">
          {subtitle}
        </span>

      </div>

      <h2 className="mt-2 text-2xl md:text-4xl font-black italic uppercase text-primary dark:text-white leading-none">
        {title}
      </h2>

    </div>
  );
}

function StatsCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.7rem] md:rounded-[2rem] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#071120] p-4 md:p-6">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_35%)]" />

      <div className="relative z-10">

        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-secondary/10 border border-secondary/10 flex items-center justify-center">

          <Icon
            size={22}
            className="text-secondary"
          />

        </div>

        <h3 className="mt-5 text-2xl md:text-4xl font-black text-primary dark:text-white">
          {value}
        </h3>

        <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.18em] font-black text-slate-400 dark:text-white/30">
          {label}
        </p>

      </div>
    </div>
  );
}

function QuickAction({
  label,
  icon: Icon,
  route,
  highlight,
}) {
  const navigate = useNavigate();

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(route)}
      className={`
        relative overflow-hidden
        rounded-[1.7rem]
        border p-4 md:p-5
        flex flex-col items-center justify-center gap-3
        transition-all duration-300
        min-h-[120px]

        ${
          highlight
            ? "bg-gradient-to-br from-secondary to-secondary-light text-white border-secondary shadow-2xl"
            : "bg-white dark:bg-[#071120] border-slate-200 dark:border-white/[0.06] text-primary dark:text-white"
        }
      `}
    >

      <div className={`
        w-12 h-12 rounded-2xl
        flex items-center justify-center
        ${
          highlight
            ? "bg-white/15"
            : "bg-secondary/10"
        }
      `}>

        <Icon
          size={22}
          className={
            highlight
              ? "text-white"
              : "text-secondary"
          }
        />

      </div>

      <span className="text-[10px] md:text-xs font-black text-center leading-tight">
        {label}
      </span>

    </motion.button>
  );
}

function ServiceCard({
  title,
  desc,
  icon: Icon,
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#071120] p-5 md:p-6">

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-secondary/10 via-transparent to-secondary/10" />

      <div className="relative z-10">

        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary/10 border border-secondary/10 flex items-center justify-center">

          <Icon
            size={22}
            className="text-secondary"
          />

        </div>

        <h3 className="mt-5 text-base md:text-lg font-black uppercase italic text-primary dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-white/40">
          {desc}
        </p>

      </div>
    </div>
  );
}

function PromoCard({
  title,
  desc,
  badge,
  glow,
}) {
  return (
    <div className={`
      relative min-w-[280px] md:min-w-[340px]
      overflow-hidden rounded-[2rem]
      bg-gradient-to-br from-[#071120] to-black
      border border-white/5 p-6
    `}>

      <div className={`absolute inset-0 bg-gradient-to-br ${glow} to-transparent`} />

      <div className="relative z-10">

        <span className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/10 text-secondary text-[10px] uppercase tracking-[0.18em] font-black">
          {badge}
        </span>

        <h3 className="mt-6 text-3xl font-black italic uppercase text-white leading-none">
          {title}
        </h3>

        <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-[220px]">
          {desc}
        </p>

        <button className="mt-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white">
          <ArrowRight size={18} />
        </button>

      </div>
    </div>
  );
}

function PartnerCard({
  name,
  category,
  image,
  fallbackImage,
}) {
  const bgImage = image || fallbackImage;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/[0.06] min-h-[220px]">

      <img
        src={bgImage}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-[#071120]/85 to-black/95" />

      <div className="relative z-10 h-full p-5 md:p-6 flex flex-col justify-end">

        <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/10 backdrop-blur-xl flex items-center justify-center">

          <Globe
            size={24}
            className="text-secondary"
          />

        </div>

        <h3 className="mt-5 text-lg font-black text-white italic uppercase">
          {name}
        </h3>

        <p className="mt-2 text-sm text-white/50">
          {category}
        </p>

      </div>
    </div>
  );
}

function TrackingItem({
  label,
  active,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className={`
        w-2.5 h-2.5 rounded-full
        ${active ? "bg-secondary" : "bg-white/20"}
      `} />

      <span className="text-white/70 text-sm font-medium">
        {label}
      </span>

    </div>
  );
}