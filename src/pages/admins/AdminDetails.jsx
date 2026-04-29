// FILE: src/pages/admins/AdminDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Phone, Mail, Activity, Trash2, ShieldOff } from "lucide-react";

import {
  fetchClientById,
  updateUserStatus,
  deleteUser
} from "../../api/users.api";

import { notifyError, notifySuccess } from "../../utils/notify";

export default function AdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadAdmin = async () => {
    try {
      setLoading(true);
      const res = await fetchClientById(id);
      setAdmin(res.data);
    } catch (err) {
      notifyError("Erreur chargement admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, [id]);

  const handleDelete = async () => {
        try {
            setDeleting(true);

            await deleteUser(id);

            notifySuccess("Administrateur supprimé");

            setShowDeleteModal(false);

            // refresh + retour (optionnel mais propre pour UX admin)
            navigate("/admins");

        } catch (err) {
            notifyError("Erreur lors de la suppression");
        } finally {
            setDeleting(false);
        }
    };

  const handleStatus = async (status) => {
    try {
      await updateUserStatus(id, status);
      loadAdmin();
      notifySuccess("Statut mis à jour");
    } catch (err) {
      notifyError("Erreur mise à jour statut");
    }
  };

  if (loading) return <div className="p-6 text-slate-500">Chargement...</div>;
  if (!admin) return <div className="p-6 text-red-500">Admin introuvable</div>;

  const getStatusStyle = (status) => {
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

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* ===================== */}
      {/* HEADER */}
      {/* ===================== */}
      <div className="flex items-start justify-between">

        <div className="space-y-2">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#002E1B]"
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          <h1 className="text-3xl font-extrabold text-slate-900">
            {admin.nom} {admin.prenom}
          </h1>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(admin.status)}`}>
              {admin.status}
            </span>

            <span className="text-xs text-slate-400">
              ADMIN ID: {admin._id}
            </span>
          </div>

        </div>

        <div className="flex gap-2">

        <button
            onClick={() => handleStatus("ACTIVE")}
            className="px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm"
        >
            Activer
        </button>

        <button
            onClick={() => handleStatus("BLOCKED")}
            className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm"
        >
            Bloquer
        </button>

        <button
            onClick={() => handleStatus("INACTIVE")}
            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm"
        >
            Désactiver
        </button>

        {/* DELETE BUTTON */}
        <button
            onClick={() => setShowDeleteModal(true)}
            disabled={admin.status === "DELETED"}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm hover:bg-red-600 hover:text-white transition"
        >
            <Trash2 size={16} />
            Supprimer
        </button>

        </div>
      </div>

      {/* ===================== */}
      {/* BLOCK 1 - IDENTITY */}
      {/* ===================== */}
      <div className="bg-white border rounded-3xl shadow-sm p-6 grid md:grid-cols-3 gap-6">

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">IDENTITÉ</p>

          <div className="flex items-center gap-2 text-slate-700">
            <Shield size={16} />
            {admin.role}
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Phone size={16} />
            {admin.telephone}
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Mail size={16} />
            {admin.email || "—"}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">STATUT COMPTE</p>
          <p className="font-semibold text-slate-700">
            {admin.status}
          </p>

          <p className="text-xs text-slate-400">
            Bloc prêt pour permissions / rôles avancés
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">ACTIVITÉ</p>

          <div className="flex items-center gap-2 text-slate-700">
            <Activity size={16} />
            Logs système à venir
          </div>
        </div>

      </div>

      {/* ===================== */}
      {/* BLOCK 2 - SYSTEM INFO */}
      {/* ===================== */}
      <div className="bg-white border rounded-3xl shadow-sm p-6 grid md:grid-cols-2 gap-6">

        <div>
          <p className="text-xs font-bold text-slate-400 mb-2">SYSTÈME</p>

          <p className="text-slate-700">
            Créé le :{" "}
            {new Date(admin.createdAt).toLocaleString()}
          </p>

          <p className="text-slate-700 mt-2">
            Dernière connexion :{" "}
            {admin.lastLogin
              ? new Date(admin.lastLogin).toLocaleString()
              : "Jamais"}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 mb-2">SÉCURITÉ</p>

          <p className="text-slate-500 text-sm">
            Section prête pour : logs login, IP, device tracking
          </p>
        </div>

      </div>

      {/* ===================== */}
      {/* BLOCK 3 - STATS */}
      {/* ===================== */}
      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white border rounded-2xl p-6">
          <p className="text-slate-500 text-sm">Actions effectuées</p>
          <p className="text-3xl font-bold text-[#002E1B]">0</p>
          <p className="text-xs text-slate-400">à brancher logs</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <p className="text-slate-500 text-sm">Connexions</p>
          <p className="text-3xl font-bold text-[#B08D3E]">0</p>
          <p className="text-xs text-slate-400">historique login</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <p className="text-slate-500 text-sm">Niveau d'activité</p>
          <p className="text-2xl font-bold text-slate-700">—</p>
          <p className="text-xs text-slate-400">score futur</p>
        </div>

      </div>

      {/* ===================== */}
      {/* BLOCK 4 - LOGS (FUTURE) */}
      {/* ===================== */}
      <div className="bg-white border rounded-2xl p-6">

        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Logs & Activités
        </h2>

        <p className="text-slate-400 text-sm">
          Section prête pour audit system (actions admin, sécurité, modifications)
        </p>

      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">

            <h2 className="text-xl font-bold text-slate-900">
                Supprimer l’administrateur ?
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