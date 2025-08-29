import { Button } from "@/components/ui/button";
import { useAuth } from "@/state/auth";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Panel administrativo</h1>
      <p className="mt-2 text-muted-foreground">Bienvenido {user?.username}</p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={logout} variant="outline">Cerrar sesión</Button>
        <a href="/" className="text-sm underline">Ver sitio</a>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Gestión de contenido</h2>
          <p className="text-sm text-muted-foreground">Próximamente podrás editar secciones de la página.</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Tienda</h2>
          <p className="text-sm text-muted-foreground">Administración de productos y pedidos.</p>
        </div>
      </div>
    </div>
  );
}
