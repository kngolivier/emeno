// FILE: src/pages/admins/NewAdminForm.jsx

import { useState } from "react";
import { createAdmin } from "../../api/users.api";

export default function NewAdminForm({ onClose, onCreated }) {

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ======================
  // VALIDATION
  // ======================
  const validate = () => {
    const newErrors = {};

    if (!nom.trim()) newErrors.nom = "Nom requis";
    if (!prenom.trim()) newErrors.prenom = "Prénom requis";

    if (!telephone.trim()) {
      newErrors.telephone = "Téléphone requis";
    } else if (!/^\+241[0-9]{8}$/.test(telephone)) {
      newErrors.telephone = "Format invalide (+241XXXXXXXX)";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Mot de passe min. 6 caractères";
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await createAdmin({
        nom: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        password,
        role: "ADMIN",
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error("Erreur création admin", err);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // STYLES
  // ======================
  const inputClass = (field) =>
    `w-full border rounded-xl p-3 text-sm outline-none transition
    ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-slate-200 focus:ring-2 focus:ring-primary/10 focus:border-primary"
    }`;

  const labelClass =
    "text-xs font-bold uppercase tracking-wider text-primary/70 mb-1 block";

  return (
    <div className="bg-card p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">

      {/* TITLE */}
      <h2 className="text-xl font-bold mb-6 text-primary">
        Nouvel administrateur
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NOM / PRENOM */}
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className={labelClass}>
              Nom <span className="text-danger">*</span>
            </label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={inputClass("nom")}
              placeholder="Doe"
            />
            {errors.nom && (
              <p className="text-danger text-xs mt-1">{errors.nom}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Prénom <span className="text-danger">*</span>
            </label>
            <input
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className={inputClass("prenom")}
              placeholder="John"
            />
            {errors.prenom && (
              <p className="text-danger text-xs mt-1">{errors.prenom}</p>
            )}
          </div>

        </div>

        {/* TELEPHONE */}
        <div>
          <label className={labelClass}>
            Téléphone <span className="text-danger">*</span>
          </label>
          <input
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className={inputClass("telephone")}
            placeholder="+241XXXXXXXX"
          />
          {errors.telephone && (
            <p className="text-danger text-xs mt-1">
              {errors.telephone}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass("email")}
            placeholder="email@exemple.com"
          />
          {errors.email && (
            <p className="text-danger text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className={labelClass}>
            Mot de passe <span className="text-danger">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass("password")}
            placeholder="******"
          />
          {errors.password && (
            <p className="text-danger text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-500 font-medium hover:bg-slate-50"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer admin"}
          </button>

        </div>

      </form>
    </div>
  );
}