// FILE: src/pages/auth/ChangePassword.jsx

import { useState } from "react";
import { changePassword } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError("Tous les champs sont obligatoires");
    }

    if (newPassword !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas");
    }

    if (newPassword.length < 6) {
      return setError("Minimum 6 caractères");
    }

    setLoading(true);

    try {
      await changePassword({
        oldPassword,
        newPassword,
      });

      // sécurité
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });

    } catch (err) {
      setError(err.message || "Erreur lors du changement");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full border rounded-xl p-3 text-sm outline-none transition
    ${
      hasError
        ? "border-danger focus:ring-2 focus:ring-danger/20"
        : "border-slate-200 focus:ring-2 focus:ring-primary/10 focus:border-primary"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-card p-8 rounded-3xl shadow-soft border border-slate-100">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img src="./logo.png" alt="logo" className="h-14 mb-3" />

          <h1 className="text-2xl font-black text-primary">
            Changer mot de passe
          </h1>

          <p className="text-sm text-muted mt-1 text-center">
            Sécurisez votre compte en mettant à jour votre mot de passe
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 text-danger text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-xs font-bold uppercase text-primary/70 mb-1 block">
              Ancien mot de passe
            </label>
            <input
              type="password"
              className={inputClass(error && !oldPassword)}
              placeholder="******"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-primary/70 mb-1 block">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className={inputClass(error && !newPassword)}
              placeholder="******"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-primary/70 mb-1 block">
              Confirmer mot de passe
            </label>
            <input
              type="password"
              className={inputClass(error && !confirmPassword)}
              placeholder="******"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Modification..." : "Valider"}
          </button>

          {/* BACK */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full text-sm text-muted hover:text-primary transition"
          >
            Retour
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-xs text-muted">
          EMENO • Sécurité compte
        </div>

      </div>
    </div>
  );
}