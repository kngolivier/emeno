// FILE: src/pages/admins/NewAdminForm.jsx

import { useState } from "react";
import { createAdmin } from "../../api/users.api";

const AdminForm = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    password: "",
    email: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await createAdmin({
        ...form,
        role: "ADMIN"
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error("Erreur création admin", err);
    }
  };

  return (
    <div  className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
      <h3>Créer un admin</h3>

      <input
        name="nom"
        placeholder="Nom"
        onChange={handleChange}
      />

      <input
        name="prenom"
        placeholder="Prénom"
        onChange={handleChange}
      />

      <input
        name="telephone"
        placeholder="Téléphone"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="password"
        placeholder="Mot de passe"
        type="password"
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>
        Créer
      </button>

      <button onClick={onClose}>
        Annuler
      </button>
    </div>
  );
};

export default AdminForm;