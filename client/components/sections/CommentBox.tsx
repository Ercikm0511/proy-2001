import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

declare global { interface Window { google?: any } }

export default function CommentBox() {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const btnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scriptId = "google-gsi";
    if (document.getElementById(scriptId)) return;
    const s = document.createElement("script");
    s.id = scriptId;
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    const init = () => {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || "",
        callback: (resp: any) => {
          const token = resp.credential as string;
          setIdToken(token);
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser({ name: payload.name, email: payload.email });
          } catch {
            setUser({});
          }
        },
      });
      window.google.accounts.id.renderButton(btnRef.current, { theme: "outline", size: "large" });
    };
    const t = setInterval(() => { if (window.google) { clearInterval(t); init(); } }, 200);
    return () => clearInterval(t);
  }, []);

  const submit = async () => {
    if (!idToken || !text.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken, text }) });
      if (res.ok) {
        setText("");
        alert("Comentario enviado y publicado");
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j?.error || "No se pudo enviar el comentario");
      }
    } finally { setSubmitting(false); }
  };

  return (
    <div className="mt-3 space-y-2">
      {!idToken ? (
        <div className="flex items-center gap-3">
          <div ref={btnRef} />
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">Conectado como {user?.name || user?.email}</div>
      )}
      <textarea
        placeholder="Escribe tu comentario..."
        className="mt-1 h-28 w-full resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2 disabled:opacity-50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!idToken}
      />
      <div className="flex justify-end">
        <Button onClick={submit} disabled={!idToken || !text.trim() || submitting}>Publicar</Button>
      </div>
    </div>
  );
}
