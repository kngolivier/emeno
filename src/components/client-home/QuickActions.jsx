import { Bell, Package, Plus, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();
  const actions = [
    { label: "Nouvelle", icon: Plus, route: "/client/new-order", highlight: true },
    { label: "Colis", icon: Package, route: "/client/orders" },
    { label: "Notifications", icon: Bell, route: "/client/notifications" },
    { label: "Tableau de bord", icon: LayoutDashboard, route: "/client/dashboard" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(action.route)}
            className={`relative overflow-hidden rounded-[1.7rem] border p-5 min-h-[130px] flex flex-col justify-center items-center gap-3 ${
              action.highlight ? "bg-gradient-to-br from-secondary to-secondary-light text-white border-secondary" : "bg-white dark:bg-[#071120] border-slate-200 dark:border-white/[0.06]"
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex justify-center items-center ${action.highlight ? "bg-white/20" : "bg-secondary/10"}`}>
              <Icon size={24} className={action.highlight ? "text-white" : "text-secondary"} />
            </div>
            <p className="font-black text-xs text-center">{action.label}</p>
          </motion.button>
        );
      })}
    </div>
  );
}