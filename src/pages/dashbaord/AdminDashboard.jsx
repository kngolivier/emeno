// FILE: src/pages/dashboard/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { fetchAdminStats } from "../../api/stats.api";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/ui/PageLoader";
import {
  Truck,
  CreditCard,
  PackageCheck,
  Activity,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import StatCard from "../../components/dashbord/StatCard";
import ProgressRow from "../../components/dashbord/ProgressRow";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("TODAY");

  const navigate = useNavigate();

  // ======================
  // FETCH
  // ======================
  const load = async () => {
    try {
      const res = await fetchAdminStats({ period });
      setStats(res?.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();

    // AUTO REFRESH (toutes les 30s)
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [period]);

  if (!stats) {
    return <PageLoader />;
  }

  // ======================
  // DATA
  // ======================
  const deliveryStats = stats?.deliveries || {};
  const userStats = stats?.users || {};

  const total = deliveryStats.total || 0;

  // ======================
  // KPI CALCULÉS
  // ======================
  const successRate = total
    ? Math.round((deliveryStats.livree / total) * 100)
    : 0;

  // ======================
  // DATA GRAPH
  // ======================
  const statusData = [
    { name: "Livrées", value: deliveryStats.livree || 0 },
    { name: "En cours", value: deliveryStats.enCours || 0 },
    { name: "Annulées", value: deliveryStats.annulee || 0 }
  ];

  // ======================
  // INSIGHTS
  // ======================
  const insights = [
    deliveryStats.annulee > 10 && "⚠️ Taux d'annulation élevé",
    userStats.driversActive < 5 && "🚨 Peu de livreurs disponibles",
    successRate < 70 && "📉 Performance de livraison faible"
  ];

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Dashboard Admin
          </h1>
          <p className="text-slate-500">
            Pilotage global de la plateforme
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2">
          {["TODAY", "WEEK", "MONTH"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                period === p
                  ? "bg-[#002E1B] text-white"
                  : "bg-white border text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="En attente"
          value={deliveryStats.enAttente || 0}
          icon={PackageCheck}
          color="bg-amber-50 text-amber-600"
          to="/deliveries?status=PENDING"
        />
        <StatCard
          title="En cours"
          value={deliveryStats.enCours || 0}
          icon={Activity}
          color="bg-blue-50 text-blue-600"
          to="/deliveries?status=IN_PROGRESS"
        />
        <StatCard
          title="Livreurs actifs"
          value={userStats.driversActive || 0}
          icon={Truck}
          color="bg-emerald-50 text-emerald-600"
          to="/drivers?status=ACTIVE"
        />
        <StatCard
          title="Revenus"
          value={stats?.revenue || 0}
          icon={CreditCard}
          color="bg-slate-900 text-white"
        />
        <StatCard
          title="Succès %"
          value={`${successRate}%`}
          icon={CheckCircle}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* ================= ACTIONS RAPIDES ================= */}
      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <h3 className="font-bold mb-4">Actions rapides</h3>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate("/deliveries")} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm">
            Voir commandes
          </button>

          <button onClick={() => navigate("/drivers")} className="px-4 py-2 border rounded-xl text-sm">
            Gérer livreurs
          </button>

          <button onClick={() => navigate("/clients")} className="px-4 py-2 border rounded-xl text-sm">
            Voir clients
          </button>
        </div>
      </div>

      {/* ================= GRAPHS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LINE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-sm">
          <h3 className="font-bold mb-4">Activité des livraisons</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={stats.deliveriesOverTime || []}
              onClick={(e) => {
                if (!e?.activeLabel) return;
                navigate(`/deliveries?date=${e.activeLabel}`);
              }}
            >
              <XAxis dataKey="date" />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col items-center">
          <h3 className="font-bold mb-4">Répartition</h3>

          <PieChart width={250} height={250}>
            <Pie data={statusData} dataKey="value" outerRadius={80}>
              {statusData.map((_, i) => (
                <Cell key={i} fill={["#10b981", "#3b82f6", "#ef4444"][i]} />
              ))}
            </Pie>
          </PieChart>
        </div>

      </div>

      {/* ================= PERFORMANCE + ALERTES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROGRESS */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex justify-between mb-6">
            <h3 className="font-bold">Performance livraisons</h3>
            <span className="text-xs bg-[#B08D3E] text-white px-2 py-1 rounded">
              Total: {total}
            </span>
          </div>

          <div className="space-y-4">
            <ProgressRow label="Livrées" value={deliveryStats.livree} total={total} colorClass="bg-emerald-500" />
            <ProgressRow label="En cours" value={deliveryStats.enCours} total={total} colorClass="bg-blue-500" />
            <ProgressRow label="En attente" value={deliveryStats.enAttente} total={total} colorClass="bg-amber-400" />
            <ProgressRow label="Annulées" value={deliveryStats.annulee} total={total} colorClass="bg-rose-500" />
          </div>
        </div>

        {/* INSIGHTS + ALERTS */}
        <div className="space-y-4">

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <h3 className="font-bold mb-4">Insights</h3>

            <div className="space-y-3">
              {insights.map((i, index) =>
                i && (
                  <div key={index} className="text-sm text-red-500 flex gap-2">
                    <AlertCircle size={16} />
                    {i}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
            <h3 className="text-red-600 font-bold mb-2">Alertes système</h3>

            {stats.alerts?.length === 0 && (
              <p className="text-sm text-slate-500">Aucune alerte</p>
            )}

            {stats.alerts?.map((a, i) => (
              <div key={i} className="text-sm text-red-600">
                • {a.message}
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ================= RECENT ================= */}
      <div className="bg-white p-6 rounded-3xl border shadow-sm">
        <h3 className="font-bold mb-4">Dernières livraisons</h3>

        <div className="space-y-2">
          {stats.recentDeliveries?.map((d) => (
            <div
              key={d.id}
              onClick={() => navigate(`/deliveries/${d.id}`)}
              className="flex justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition"
            >
              <span className="font-medium">{d.client}</span>
              <span className="text-sm text-slate-500">{d.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}