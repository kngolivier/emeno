// FILE: src/pages/drivers/DriverDetails

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Activity, Truck, Package, ShieldOff, Trash2, Mail } from "lucide-react";

import { fetchDriverById, updateUserStatus } from "../../api/users.api";
import { notifyError, notifySuccess } from "../../utils/notify";

export default function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ======================
  // LOAD DRIVER
  // ======================
  const loadDriver = async () => {
    try {
      setLoading(true);

      const res = await fetchDriverById(id);
      const data = res?.data?.data || res?.data || res;

      setDriver(data);
    } catch (err) {
      notifyError("Impossible de charger le livreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriver();
  }, [id]);

  // ======================
  //   Fonction de suppression
  // ======================
  const handleDelete = async () => {
        try {
            setDeleting(true);

            await updateUserStatus(driver._id, "DELETED");

            setDriver((prev) => ({
            ...prev,
            status: "DELETED"
            }));

            notifySuccess("Livreur supprimé");
            setShowDeleteModal(false);

        } catch (err) {
            notifyError("Erreur lors de la suppression");
        } finally {
            setDeleting(false);
        }
    };
  // ======================
  // STATUS STYLE
  // ======================
  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-200";
      case "INACTIVE":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "BLOCKED":
        return "bg-red-50 text-red-600 border-red-200";
      case "DELETED":
        return "bg-black text-white";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ======================
  // BLOCK / UNBLOCK
  // ======================
  const handleBlockToggle = async () => {
    try {
      const newStatus = driver.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

      await updateUserStatus(driver._id, newStatus);

      setDriver((prev) => ({
        ...prev,
        status: newStatus,
      }));

      notifySuccess("Statut mis à jour");
    } catch (err) {
      notifyError("Erreur lors du changement de statut");
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Chargement...</div>;
  }

  if (!driver) {
    return <div className="p-6 text-red-500">Livreur introuvable</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="space-y-3">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#002E1B]"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {driver.nom} {driver.prenom}
            </h1>

            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(driver.status)}`}>
              {driver.status}
            </span>
          </div>

        </div>
      </div>

      {/* INFO CARD */}
      <div className="bg-white rounded-3xl border shadow-sm p-6 grid md:grid-cols-3 gap-6">

        <div className="space-y-3">
          <p className="text-slate-400 text-xs font-semibold">CONTACT</p>

          <div className="flex items-center gap-2 text-slate-700">
            <Phone size={16} />
            {driver.telephone}
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Mail size={16} />
            {driver.email || "—"}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-slate-400 text-xs font-semibold">STATUT COMPTE</p>
          <p className="text-slate-700 font-semibold">
            {driver.status}
          </p>

          <p className="text-slate-400 text-sm">
            Dernière mise à jour à brancher API
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-slate-400 text-xs font-semibold">ACTIVITÉ</p>
          <div className="flex items-center gap-2 text-slate-700">
            <Activity size={16} />
            Statistiques à venir
          </div>
        </div>

      </div>

      {/* ACTIONS */}
        <div className="bg-white border rounded-2xl p-4 flex items-center justify-between">

        <div className="text-sm text-slate-500">
            Actions sur le livreur
        </div>

        <div className="flex gap-3">

            {/* BLOCK / UNBLOCK */}
            <button
            onClick={handleBlockToggle}
            disabled={driver.status === "DELETED"}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition
                ${
                driver.status === "BLOCKED"
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                }
                ${driver.status === "DELETED" ? "opacity-40 cursor-not-allowed" : ""}
            `}
            >
            <ShieldOff size={16} />
            {driver.status === "BLOCKED" ? "Débloquer" : "Bloquer"}
            </button>

            {/* DELETE */}
            <button
            onClick={() => setShowDeleteModal(true)}
            disabled={driver.status === "DELETED"}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition
                bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white
                ${driver.status === "DELETED" ? "opacity-40 cursor-not-allowed" : ""}
            `}
            >
            <Trash2 size={16} />
            Supprimer
            </button>

        </div>
        </div>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Truck size={16} />
            Livraisons
          </div>
          <p className="text-3xl font-bold text-[#002E1B] mt-2">0</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Package size={16} />
            Livraisons réussies
          </div>
          <p className="text-3xl font-bold text-[#B08D3E] mt-2">0</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <p className="text-slate-500 text-sm">Dernière activité</p>
          <p className="text-2xl font-bold text-slate-700 mt-2">—</p>
        </div>

      </div>

      {showDeleteModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">

        <h2 className="text-xl font-bold text-slate-900">
            Supprimer le livreur ?
        </h2>

        <p className="text-slate-500 text-sm">
            Cette action est irréversible. Le compte sera désactivé définitivement.
        </p>

        <div className="flex justify-end gap-3 pt-4">

            <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
            Annuler
            </button>

            <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
            {deleting ? "Suppression..." : "Supprimer"}
            </button>

        </div>

        </div>

    </div>
    )}

    </div>
  );
}