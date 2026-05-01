// src/components/drivers/NewDriverForm.jsx

import { useState } from "react";

export default function NewDriverForm({ onSave, onCancel, driver }) {
  const [nom, setNom] = useState(driver?.nom || "");
  const [prenom, setPrenom] = useState(driver?.prenom || "");
  const [telephone, setTelephone] = useState(driver?.telephone || "");
  const [email, setEmail] = useState(driver?.email || "");
  const [adresse, setAdresse] = useState(driver?.adresse || "");
  const [status, setStatus] = useState(driver?.status || "ACTIVE");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ======================
  // VALIDATION FRONT
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
      await onSave({
        nom: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone.trim(),
        email: email.trim(),
        adresse: adresse.trim(),
        role: "DRIVER",
        status,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-xl p-3 text-sm outline-none transition-all
    ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-slate-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
    }`;

  const labelClass =
    "text-xs font-bold uppercase tracking-wider text-primary/70 mb-1 block";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">

      <h2 className="text-xl font-bold mb-6 text-primary">
        {driver ? "Modifier le livreur" : "Nouveau livreur"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* NOM / PRENOM */}
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className={labelClass}>
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={inputClass("nom")}
              placeholder="Doe"
            />
            {errors.nom && (
              <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className={inputClass("prenom")}
              placeholder="John"
            />
            {errors.prenom && (
              <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
            )}
          </div>

        </div>

        {/* TELEPHONE */}
        <div>
          <label className={labelClass}>
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className={inputClass("telephone")}
            placeholder="+241XXXXXXXX"
          />
          {errors.telephone && (
            <p className="text-red-500 text-xs mt-1">
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
            <p className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* ADRESSE */}
        <div>
          <label className={labelClass}>Adresse</label>
          <input
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className={inputClass("adresse")}
            placeholder="Libreville..."
          />
        </div>

        {/* STATUS */}
        <div>
          <label className={labelClass}>Statut</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none"
          >
            <option value="ACTIVE">Actif</option>
            <option value="INACTIVE">Inactif</option>
            <option value="BLOCKED">Bloqué</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-slate-500 font-medium hover:bg-slate-50"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {loading
              ? "Création..."
              : driver
              ? "Mettre à jour"
              : "Enregistrer"}
          </button>

        </div>

      </form>
    </div>
  );
}