import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../atoms/input/input.tsx";
import { useAuth } from "../../../auth/AuthContext.tsx";


type AuthMode = "login" | "signup";

const API_URL = "http://localhost:5000/users/auth";

const AuthPage = () => {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Tous les champs requis ne sont pas remplis");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isLogin
            ? { email, password }
            : { name, email, password }
        ),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Identifiants invalides");
        if (res.status === 409) throw new Error("Utilisateur déjà existant");
        throw new Error("Erreur serveur");
      }

      const data = await res.json();

      if (data.token && data.user) {
        login(data.token, data.user); // <-- ICI on met à jour le context
        navigate("/home", { replace: true });
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Connexion" : "Inscription"}
        </h1>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              label="Nom"
              value={name}
              onChange={setName}
              placeholder="John Doe"
              className="mb-4"
            />
          )}

          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="user@mail.com"
            type="email"
            className="mb-4"
          />

          <Input
            label="Mot de passe"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            type="password"
            className="mb-4"
          />

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 rounded-md text-white font-medium
              bg-blue-600 hover:bg-blue-700 transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Chargement..."
              : isLogin
              ? "Se connecter"
              : "Créer un compte"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          {isLogin ? (
            <>
              Pas encore de compte ?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline"
              >
                S’inscrire
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline"
              >
                Se connecter
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
