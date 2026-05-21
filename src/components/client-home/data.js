import { Zap, MapPin, HeartHandshake } from "lucide-react";

export const heroSlides = [
  {
    id: 1,
    tag: "Livraison premium",
    title: "Livrez",
    accent: "Partout",
    description: "Expédiez vos colis rapidement avec suivi temps réel.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1800",
    cta: "Nouvelle commande",
    route: "/client/new-order",
  },
  {
    id: 2,
    tag: "Programme fidélité",
    title: "Cumulez",
    accent: "Des points",
    description: "Recevez des récompenses.",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1800",
    cta: "Mes avantages",
    route: "/client/dashboard",
  },
  {
    id: 3,
    tag: "Tracking intelligent",
    title: "Suivi",
    accent: "Temps réel",
    description: "Suivez vos colis instantanément.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1800",
    cta: "Mes livraisons",
    route: "/client/orders",
  },
];

export const services = [
  { title: "Express", desc: "Livraison rapide", icon: Zap },
  { title: "Tracking GPS", desc: "Suivi temps réel", icon: MapPin },
  { title: "Support", desc: "Équipe réactive", icon: HeartHandshake },
];