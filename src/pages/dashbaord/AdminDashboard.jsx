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
import { fetchAdminDeliveries } from "../../api/deliveries.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState("TODAY");
  const [recentDeliveries, setRecentDeliveries] = useState([]);

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

  
  // =========== Load Recent ===========
  const loadRecent = async () => {
    try {
      const res = await fetchAdminDeliveries();

      const data = res?.data?.data || res?.data || res;

      const sorted = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentDeliveries(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    loadRecent();

    const interval = setInterval(() => {
      load();
      loadRecent();
    }, 30000);

    return () => clearInterval(interval);
  }, [period]);

  if (!stats) {
    return <PageLoader />;
  }

  // ================= PIE COLORS =================
  const COLORS = ["#10b981", "#3b82f6", "#ef4444"];

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
                  ? "bg-primary text-white"
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

        {/* LINE CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-soft hover:shadow-card transition">
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              Activité des livraisons
            </h3>

            <span className="text-xs bg-primary text-white px-2 py-1 rounded-lg">
              Live
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.deliveriesOverTime || []}>

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#94A3B8"
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                }}
              />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

       {/* PIE CHART */}
        <div className="bg-white p-6 rounded-3xl border shadow-soft hover:shadow-card transition">

            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PackageCheck size={18} className="text-secondary" />
              Répartition des livraisons
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

              {/* PIE */}
              <PieChart width={240} height={240}>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  stroke="white"
                  strokeWidth={2}
                  isAnimationActive={true}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>

                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  contentStyle={{
                    borderRadius: "14px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.10)"
                  }}
                  formatter={(value, name) => [`${value}`, name]}
                />
              </PieChart>

              {/* LEGEND PRO */}
              <div className="w-full space-y-3">

                {statusData.map((item, i) => {
                  const percent = total ? Math.round((item.value / total) * 100) : 0;

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center gap-3">

                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[i] }}
                        />

                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {percent}% du total
                          </p>
                        </div>
                      </div>

                      <div className="text-sm font-bold text-slate-800">
                        {item.value}
                      </div>
                    </div>
                  );
                })}

              </div>

            </div>

            {/* FOOTER */}
            <div className="mt-5 text-xs text-slate-400">
              Survole le graphique pour voir les détails
            </div>

          </div>

      </div>

      {/* ================= PERFORMANCE + ALERTES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROGRESS */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex justify-between mb-6">
            <h3 className="font-bold">Performance livraisons</h3>
            <div className="flex items-center gap-3 bg-white border shadow-sm px-4 py-2 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <PackageCheck size={16} className="text-primary" />
              </div>

              <div className="leading-tight">
                <p className="text-xs text-slate-500">Total livraisons</p>
                <p className="text-lg font-bold text-slate-900">{total}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ProgressRow label="Livrées" value={deliveryStats.livree} total={total} colorClass="bg-emerald-500" />
            <ProgressRow label="En cours" value={deliveryStats.enCours} total={total} colorClass="bg-blue-500" />
            <ProgressRow label="En attente" value={deliveryStats.enAttente} total={total} colorClass="bg-amber-400" />
            <ProgressRow label="Annulées" value={deliveryStats.annulee} total={total} colorClass="bg-rose-500" />
          </div>
        </div>

        {/* ================= INSIGHTS & ALERTES ================= */}
        <div className="bg-white p-6 rounded-3xl border shadow-soft">

          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle size={18} className="text-primary" />
              Insights & alertes système
            </h3>

            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
              temps réel
            </span>
          </div>

          <div className="space-y-3">

            {/* ALERTES SYSTEME (priorité haute) */}
            {stats.alerts?.length > 0 && (
              <div className="space-y-2">
                {stats.alerts.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100"
                  >
                    <AlertCircle size={16} />
                    <span>{a.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* INSIGHTS */}
            <div className="space-y-2">

              {insights.map((i, index) =>
                i && (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100"
                  >
                    <CheckCircle size={16} className="text-amber-500" />
                    <span>{i}</span>
                  </div>
                )
              )}

              {insights.every(Boolean) === false && stats.alerts?.length === 0 && (
                <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl">
                  Aucun signal critique détecté
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* ================= RECENT ================= */}
      <div className="bg-white p-6 rounded-3xl border shadow-soft mt-6">

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <PackageCheck size={18} className="text-primary" />
            Dernières livraisons
          </h3>

          <button
            onClick={() => navigate("/deliveries")}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Voir tout
          </button>
        </div>

        <div className="space-y-2">

          {recentDeliveries.map((d) => (
            <div
              key={d._id}
              onClick={() => navigate(`/deliveries/${d._id}`)}
              className="flex justify-between items-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition border border-transparent hover:border-slate-200"
            >

              <div>
                <p className="font-medium text-slate-800">{d.pickupContact.name}</p>
                <p className="text-xs text-slate-400">Commande #{d.orderNumber || "—"}</p>
              </div>

              <span className="text-xs px-2 py-1 rounded-lg bg-white border text-slate-600">
                {d.status}
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}