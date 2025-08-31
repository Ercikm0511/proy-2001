import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X, ChevronDown, User, Mail, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

 type Msg = { role: "user" | "bot"; content: string; at: string };

export default function WhatsappFab() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, collapsed]);

  const startChat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name || !email) return;
    const r = await fetch("/api/chat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const j = await r.json();
    if (r.ok) {
      setSessionId(j.sessionId);
      setMessages(j.messages || []);
    }
  };

  const send = async (text: string, options?: { escalate?: boolean }) => {
    if (!sessionId) return;
    setSending(true);
    const userMsg: Msg = { role: "user", content: text, at: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    try {
      const r = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text, escalate: options?.escalate }),
      });
      const j = await r.json();
      if (r.ok) {
        const bot: Msg | undefined = j.bot;
        if (bot) setMessages((m) => [...m, bot]);
      }
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    await send(text);
  };

  const quicks = useMemo(
    () => [
      { label: "Horarios", text: "¿Cuáles son sus horarios?" },
      { label: "Dirección", text: "¿Cuál es la dirección de la tienda?" },
      { label: "Servicios", text: "¿Qué servicios ofrecen?" },
      { label: "Cotización", text: "Quiero una cotización rápida" },
    ],
    [],
  );

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chat"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="absolute bottom-16 right-0 w-[340px] overflow-hidden rounded-2xl border border-black/10 bg-background shadow-2xl md:w-[380px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-black px-3 py-2 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">M’E Store — Asistente</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="rounded p-1 hover:bg-white/10"
                aria-label="Minimizar"
              >
                <ChevronDown className={cn("h-4 w-4 transition", collapsed ? "rotate-180" : "")} />
              </button>
              <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-white/10" aria-label="Cerrar">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!collapsed && (
            <div className="flex h-[440px] flex-col">
              {/* Start form */}
              {!sessionId ? (
                <form onSubmit={startChat} className="p-3 space-y-3">
                  <div>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" /> Nombre y Apellido
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
                      placeholder="tucorreo@ejemplo.com"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                  >
                    Iniciar chat
                  </button>
                  <p className="text-[11px] text-muted-foreground">
                    Al iniciar aceptas que guardemos tu nombre, correo y mensajes para seguimiento del servicio.
                  </p>
                </form>
              ) : (
                <>
                  {/* Messages */}
                  <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3">
                    {messages.map((m, i) => (
                      <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start") }>
                        <div
                          className={cn(
                            "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm",
                            m.role === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground",
                          )}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div className="flex flex-wrap gap-2 px-3 pb-2">
                    {quicks.map((q) => (
                      <button
                        key={q.label}
                        onClick={() => send(q.text)}
                        className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
                      >
                        {q.label}
                      </button>
                    ))}
                    <button
                      onClick={() => send("Quiero hablar con un asesor humano", { escalate: true })}
                      className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
                    >
                      Asesor humano
                    </button>
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-3">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none ring-blue-300 focus:ring-2"
                    />
                    <button
                      type="submit"
                      disabled={sending || !input.trim()}
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 p-2 text-white shadow disabled:opacity-40"
                      aria-label="Enviar"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
