import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { loginUser } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser({ email, password }).catch(() => ({}));
      // store token if provided
      if ((data as any)?.token) localStorage.setItem("token", (data as any).token);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 lg:p-8">
      <div className="relative grid w-full max-w-6xl grid-cols-1 lg:grid-cols-5 bg-white dark:bg-secondary/30 rounded-2xl shadow-2xl shadow-primary/10 dark:shadow-primary/20 overflow-hidden border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <div className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-between order-2 lg:order-1 bg-secondary/5 dark:bg-secondary/20">
          <div>
            <div className="w-16 h-16 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">login</span>
            </div>
            <h1 className="font-display text-slate-900 dark:text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter">
              Bienvenue de retour.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed mt-4">
              Connectez-vous pour continuer et accéder à votre tableau de bord.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              Pas encore de compte ?
              <Link className="font-medium text-primary hover:underline ml-2" to="/register">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 p-8 md:p-12 order-1 lg:order-2">
          <form onSubmit={onSubmit} className="flex flex-col gap-6 h-full">
            <h2 className="font-display text-slate-900 dark:text-white text-3xl font-bold mb-4">Connexion</h2>

            <div className="relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer h-12 w-full border-b-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white placeholder-transparent focus:outline-none focus:border-primary"
                id="email"
                placeholder="Adresse e-mail"
                type="email"
                required
              />
              <label className="absolute left-0 -top-3.5 text-slate-500 dark:text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-sm" htmlFor="email">
                Adresse e-mail
              </label>
            </div>

            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer h-12 w-full border-b-2 border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white placeholder-transparent focus:outline-none focus:border-primary"
                id="password"
                placeholder="Mot de passe"
                type="password"
                required
              />
              <label className="absolute left-0 -top-3.5 text-slate-500 dark:text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-sm" htmlFor="password">
                Mot de passe
              </label>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="mt-auto pt-6">
              <button
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg h-14 px-6 text-lg font-medium transition-all duration-300 bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                type="submit"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
