// FILE: src/pages/clients/ClientDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Activity } from "lucide-react";

import { fetchClientById, deleteUser, updateUserStatus } from "../../api/users.api";
import { notifyError } from "../../utils/notify";

import { notifySuccess } from "../../utils/notify";
import { ShieldOff, Trash2 } from "lucide-react";
import PageLoader from "../../components/ui/PageLoader";

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadClient = async () => {
    try {
      setLoading(true);

      const res = await fetchClientById(id);
      const data = res?.data?.data || res?.data || res;

      setClient(data);

    } catch (err) {
      notifyError("Impossible de charger le client");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async () => {
        try {
            let newStatus = client.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

            await updateUserStatus(client._id, newStatus);

            setClient((prev) => ({
            ...prev,
            status: newStatus
            }));

            notifySuccess("Statut mis à jour");
        } catch (err) {
            notifyError("Erreur lors de la mise à jour du statut");
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);

            await deleteUser(client._id);
            notifySuccess("Client supprimé");
            setShowDeleteModal(false);
        } catch (err) {
            notifyError("Erreur lors de la suppression");
        } finally {
            setDeleting(false);
        }
    };

  useEffect(() => {
    loadClient();
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  if (!client) {
    return <div className="p-6 text-red-500">Client introuvable</div>;
  }

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

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-start justify-between">

        <div className="space-y-3">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition"
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {client.nom} {client.prenom}
            </h1>

            <div className="flex items-center gap-3 mt-2">

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(client.status)}`}>
                {client.status}
              </span>

              <span className="text-slate-400 text-sm">
                Client ID: {client._id}
              </span>

            </div>
          </div>

        </div>

      </div>

    {/* ACTIONS */}
    <div className="bg-white border rounded-2xl p-4 flex items-center justify-between">

    <div className="text-sm text-slate-500">
        Actions sur le compte client
    </div>

    <div className="flex gap-3">

        {/* BLOCK / UNBLOCK */}
        <button
            onClick={handleBlockToggle}
            disabled={client.status === "DELETED"}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition
                ${
                client.status === "BLOCKED"
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                }
                ${client.status === "DELETED" ? "opacity-40 cursor-not-allowed" : ""}
            `}
        >
        <ShieldOff size={16} />
        {client.status === "BLOCKED" ? "Débloquer" : "Bloquer"}
        </button>

        {/* DELETE */}
        <button
            onClick={() => setShowDeleteModal(true)}
            disabled={client.status === "DELETED"}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition
                bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white
                ${client.status === "DELETED" ? "opacity-40 cursor-not-allowed" : ""}
            `}
        >
        <Trash2 size={16} />
        Supprimer
        </button>

    </div>
    </div>
      {/* INFO CARD */}
      <div className="bg-white rounded-3xl border shadow-sm p-6 grid md:grid-cols-3 gap-6">

        <div className="space-y-3">
          <p className="text-slate-400 text-xs font-semibold">CONTACT</p>

          <div className="flex items-center gap-2 text-slate-700">
            <Phone size={16} />
            {client.telephone}
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Mail size={16} />
            {client.email || "—"}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-slate-400 text-xs font-semibold">STATUT COMPTE</p>
          <p className="text-slate-700 font-semibold">
            {client.status}
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

      {/* STATS GRID */}
      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
          <p className="text-slate-500 text-sm">Commandes</p>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-xs text-slate-400 mt-1">Total des livraisons</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
          <p className="text-slate-500 text-sm">Dépenses</p>
          <p className="text-3xl font-bold text-secondary">0 FCFA</p>
          <p className="text-xs text-slate-400 mt-1">Montant total payé</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
          <p className="text-slate-500 text-sm">Dernière activité</p>
          <p className="text-2xl font-bold text-slate-700">—</p>
          <p className="text-xs text-slate-400 mt-1">Dernière commande</p>
        </div>

      </div>

      {/* FUTURE SECTION */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Historique des commandes
        </h2>

        <p className="text-slate-400 text-sm">
          (Section prête pour affichage des livraisons du client)
        </p>
      </div>

        {/* DELETE MODAL */}
        {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">

            <h2 className="text-xl font-bold text-slate-900">
                Supprimer le client ?
            </h2>

            <p className="text-slate-500 text-sm">
                Cette action est irréversible. Le client sera désactivé définitivement.
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