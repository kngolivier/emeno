import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroTrackingWidget from "./HeroTrackingWidget";

const heroSlides = [
  {
    id: 1,
    tag: "Livraison premium",
    title: "Livrez",
    accent: "Partout",
    description: "Expédiez vos colis rapidement avec suivi temps réel et notifications.",
    image: "https://res.cloudinary.com/dgjxccbzt/image/upload/q_auto/f_auto/v1780589294/IMG-20260521-WA0037_be9wlt.jpg",
    cta: "Nouvelle commande",
    route: "/client/new-order",
  },
  {
    id: 2,
    tag: "Faites-vous",
    title: "Livrer",
    accent: "Facilement",
    description: "Facilitez-vous la vie avec nos services",
    image: "https://res.cloudinary.com/dgjxccbzt/image/upload/v1780589294/IMG-20260521-WA0045_o0dy9d.jpg",
    cta: "Nouvelle commande",
    route: "/client/new-order",
  },
  {
    id: 3,
    tag: "Tracking intelligent",
    title: "Suivi",
    accent: "Temps réel",
    description: "Suivez vos colis directement depuis EMENO.",
    image: "https://res.cloudinary.com/dgjxccbzt/image/upload/q_auto/f_auto/v1780589295/IMG-20260521-WA0044_qtayrv.jpg",
    cta: "Mes livraisons",
    route: "/client/orders",
  },
];

export default function HeroSection({ activeDelivery }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slide = useMemo(() => heroSlides[currentSlide], [currentSlide]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] min-h-[350px] md:min-h-[560px] mx-4 border border-slate-200/70 dark:border-white/[0.06]">
      <AnimatePresence mode="wait">
        <motion.div key={slide.id} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
          <img src={slide.image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_30%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 w-full px-6 md:px-10 py-8">
          <div className="max-w-xl flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full border border-secondary/20 bg-secondary/10 backdrop-blur-xl text-secondary text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} /> {slide.tag}
            </span>
            <h1 className="mt-6 text-[2.5rem] md:text-[6rem] font-black italic uppercase leading-[0.9] tracking-[-0.08em] text-white">
              {slide.title} <br /> <span className="text-secondary">{slide.accent}</span>
            </h1>
            <p className="mt-5 text-sm md:text-lg text-white/70 max-w-md leading-relaxed">{slide.description}</p>
            <button onClick={() => navigate(slide.route)} className="group mt-8 h-12 px-6 rounded-2xl bg-secondary hover:bg-secondary-light text-white font-black flex items-center gap-2 w-fit">
              {slide.cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="hidden lg:flex justify-end items-center">
            <HeroTrackingWidget activeDelivery={activeDelivery} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, idx) => (
          <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all ${currentSlide === idx ? "w-8 bg-secondary" : "w-2 bg-white/30"}`} />
        ))}
      </div>
    </section>
  );
}