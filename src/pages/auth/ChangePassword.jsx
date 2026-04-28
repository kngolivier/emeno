// FILE: src/pages/auth/ChangePassword.jsx

import { useState } from "react";
import { changePassword } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      return alert("Tous les champs sont obligatoires");
    }

    if (newPassword !== confirmPassword) {
      return alert("Les mots de passe ne correspondent pas");
    }

    if (newPassword.length < 6) {
      return alert("Minimum 6 caractères");
    }

    try {
      await changePassword({
        oldPassword,
        newPassword,
      });

      alert("Mot de passe modifié avec succès");

      // sécurité
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 bg-white shadow rounded-xl"
      >
        <h1 className="text-xl font-bold mb-4">
          Changer le mot de passe
        </h1>

        <input
          type="password"
          className="w-full border p-2 mb-3"
          placeholder="Ancien mot de passe"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Confirmer mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Valider
        </button>
      </form>
    </div>
  );
}