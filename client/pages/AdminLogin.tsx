import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/state/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(username, password);
    setLoading(false);
    if (res.ok) {
      const dest = location.state?.from?.pathname || "/admin";
      navigate(dest, { replace: true });
    } else {
      setError(res.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Acceso administrativo</h1>
      <p className="text-sm text-muted-foreground mt-1">Ingresa con tu usuario y contraseña</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm" htmlFor="username">Usuario</label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </div>
        <div>
          <label className="text-sm" htmlFor="password">Contraseña</label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Ingresando…" : "Ingresar"}</Button>
      </form>
    </div>
  );
}
