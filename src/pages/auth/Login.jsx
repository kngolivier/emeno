// FILE: src/pages/auth/Login.jsx

import { useState } from "react";
import { login as loginApi } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ identifier, password });

      const token = res?.data.token;
      const user = res?.data.user;
      const mustChangePassword = res?.data.mustChangePassword;

      if (!token) throw new Error("Token manquant");

      login({ user, token });

      if (mustChangePassword) {
        return navigate("/change-password", { replace: true });
      }

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
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* ====================== */}
      {/* LEFT SIDE (BRANDING) */}
      {/* ====================== */}
      <div className="hidden md:flex flex-col justify-between bg-secondary-light text-white p-10 relative overflow-hidden">

        {/* BACKGROUND LOGO */}
        <img
          src="./logo-dark.png"
          alt="bg-logo"
          className="absolute inset-0 m-auto w-[400px] opacity-[0.7] pointer-events-none"
        />

        {/* TOP */}
        <div className="z-10">
          {/* <img src="./logo-dark.png" alt="logo" className="h-12 mb-6" /> */}
          <h1 className="text-3xl font-extrabold leading-tight">
            Plateforme de gestion
            <br /> de livraisons intelligente
          </h1>
{/* 
          <p className="mt-4 text-sm text-primary/80 max-w-sm">
            Suivez vos livraisons en temps réel, gérez vos livreurs,
            optimisez vos coûts et améliorez votre performance opérationnelle.
          </p> */}
        </div>

        {/* BOTTOM */}
        <div className="z-10 text-xs text-white/60">
          © {new Date().getFullYear()} EMENO
        </div>
      </div>

      {/* ====================== */}
      {/* RIGHT SIDE (FORM) */}
      {/* ====================== */}
      <div className="flex items-center justify-center bg-background px-6">

        <div className="w-full max-w-md bg-card p-8 rounded-3xl shadow-soft border">

          {/* LOGO (mobile) */}
          <div className="md:hidden flex justify-center mb-6">
            <img src="./logo.png" alt="logo" className="h-12" />
          </div>

          <h2 className="text-2xl font-bold text-primary mb-2">
            Connexion
          </h2>

          <p className="text-sm text-muted mb-6">
            Accédez à votre espace de gestion
          </p>

          {error && (
            <div className="mb-4 text-sm text-danger bg-danger/10 p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
              placeholder="Email ou téléphone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-slate-200 p-3 pr-12 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* TOGGLE BUTTON */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute inset-y-0 right-3 flex items-center transition ${
                  showPassword ? "text-primary" : "text-slate-400 hover:text-primary"
                }`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/light transition disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}