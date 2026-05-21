import { Package, Star, Boxes } from "lucide-react";
import StatCard from "../dashboard/StatCard";

export default function StatsCards({ stats }) {
  // Calcul de la satisfaction sécurisé
  const successRate = stats?.totalOrders > 0 
    ? Math.round((stats.completedOrders / stats.totalOrders) * 100) 
    : 0;

  // Définition des données avec les couleurs correspondantes
  const cards = [
    { 
      title: "Livraisons", 
      value: stats?.completedOrders || 0, 
      icon: Package, 
      color: "bg-blue-500", 
      to: "/client/orders" 
    },
    { 
      title: "Commandes", 
      value: stats?.totalOrders || 0, 
      icon: Boxes, 
      color: "bg-purple-500", 
      to: "/client/orders" 
    },
    { 
      title: "Satisfaction", 
      value: successRate + "%", 
      icon: Star, 
      color: "bg-amber-500", 
      to: null // Pas de navigation pour la stat de satisfaction
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
      {cards.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
          to={item.to} // Si 'to' est null, le clic sera désactivé via le composant StatCard
        />
      ))}
    </div>
  );
}