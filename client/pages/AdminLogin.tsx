import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border bg-muted/50 p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Iniciar Sesión (Administración)</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email === "Mestore1204@gmail.com" && pass === "St0r3.1204") {
              localStorage.setItem("isAdmin", "true");
              setError(null);
              navigate("/admin");
            } else {
              setError("Credenciales inválidas");
            }
          }}
          className="space-y-3"
        >
          <div>
            <label className="text-sm">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              required
            />
          </div>
          <div>
            <label className="text-sm">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <p className="text-xs text-muted-foreground">Acceso administrativo. No compartas estas credenciales.</p>
        </form>
      </div>
    </div>
  );
}
