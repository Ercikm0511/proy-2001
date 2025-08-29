export default function Thanks() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold">¡Gracias por tu compra!</h1>
      <p className="mt-2 text-muted-foreground">Hemos recibido tu pago. Te enviaremos la confirmación y detalles a tu correo.</p>
      <a href="/" className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Volver al inicio</a>
    </div>
  );
}
