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

      //  SOURCE UNIQUE
      login({ user, token });

      // ======================
      // PRIORITÉ 1 → CHANGE PASSWORD
      // ======================
      if (mustChangePassword) {
        return navigate("/change-password", { replace: true });
      }

      if (!user?.role) {
        throw new Error("Rôle utilisateur manquant");
      }
      // ======================
      // PRIORITÉ 2 → ROLE
      // ======================
      switch (user?.role) {
        case "ADMIN":
          navigate("/", { replace: true });
          break;

        case "DRIVER":
          navigate("/driver", { replace: true });
          break;

        case "CLIENT":
          navigate("/client", { replace: true });
          break;

        default:
          navigate("/unauthorized", { replace: true });
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