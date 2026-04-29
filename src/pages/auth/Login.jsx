// FILE: src/pages/auth/Login.jsx

import { useState } from "react";
import { login as loginApi } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginApi({ identifier, password });

      const token = res?.data.token;
      const user = res?.data.user;
      const mustChangePassword = res?.data.mustChangePassword;

      if (!token) {
        throw new Error("Token manquant dans la réponse API");
      }

      // ======================
      // 🔥 IMPORTANT : SOURCE UNIQUE DE VÉRITÉ = CONTEXT
      // ======================
      login({ user, token });

      // ======================
      // REDIRECTION
      // ======================
      if (mustChangePassword) {
        navigate("/change-password", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-96 p-6 bg-white shadow rounded-xl"
      >
        <h1 className="text-xl font-bold mb-4">Connexion</h1>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email ou téléphone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Se connecter
        </button>
      </form>
    </div>
  );
}