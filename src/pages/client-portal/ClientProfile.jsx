// FILE: src/pages/client-portal/ClientProfile.jsx

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../api/users.api";
import { User, Mail, Pencil, Check, X } from "lucide-react";

export default function ClientProfile() {

  const { user, login } = useAuth();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    telephone: user?.telephone || "",
    email: user?.email || "",
    adresse: user?.adresse || "",
  });

  // ======================
  // OPEN MODAL
  // ======================
  const handleOpen = () => {
    setForm({
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone || "",
      email: user.email || "",
      adresse: user.adresse || "",
    });
    setOpenModal(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ======================
  // SAVE PROFILE (/me)
  // ======================
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateMyProfile(form);
      const updatedUser = res.data;

      login({
        user: updatedUser,
        token: localStorage.getItem("token")
      });

      setOpenModal(false);

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // STYLE INPUT (copié de ton form client)
  // ======================
  const inputClass =
    "w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500";

  const labelClass =
    "text-xs font-bold uppercase tracking-wider text-blue-600/70 mb-1 block";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <User size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {user.nom} {user.prenom}
            </h1>

            <p className="text-sm text-slate-500">
              {user.email}
            </p>
          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleOpen}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700"
        >
          <Pencil size={16} />
          Modifier
        </button>

      </div>

      {/* INFOS (read only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <User size={18} />
            Informations personnelles
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-500">Nom</span>
              <span className="font-medium">{user.nom}</span>
            </div>

            <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-500">Prénom</span>
              <span className="font-medium">{user.prenom}</span>
            </div>

            <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-500">Téléphone</span>
              <span className="font-medium">{user.telephone || "-"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Mail size={18} />
            Compte
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-500">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>

            <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-500">Rôle</span>
              <span className="font-medium text-blue-600 uppercase">
                {user.role}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================
          MODAL
      ====================== */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">

          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">

            <h2 className="text-xl font-bold mb-6 text-blue-600">
              Modifier mon profil
            </h2>

            <form onSubmit={handleSave} className="space-y-5">

              {/* NOM / PRENOM */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className={labelClass}>Nom</label>
                  <input
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Prénom</label>
                  <input
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

              </div>

              {/* TELEPHONE */}
              <div>
                <label className={labelClass}>Téléphone</label>
                <input
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className={labelClass}>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* ADRESSE */}
              <div>
                <label className={labelClass}>Adresse</label>
                <input
                  name="adresse"
                  value={form.adresse}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 mt-8">

                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-6 py-2.5 rounded-xl text-slate-500 font-medium hover:bg-slate-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Sauvegarde..." : "Mettre à jour"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}