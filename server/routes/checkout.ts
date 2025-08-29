import { RequestHandler } from "express";

export const handleCheckout: RequestHandler = async (req, res) => {
  try {
    const { cart } = req.body as {
      cart: {
        id: string;
        name: string;
        price: number;
        qty: number;
        image?: string;
      }[];
    };
    if (!Array.isArray(cart) || cart.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    const amountInCents = Math.round(total * 100);

    const pub = process.env.WOMPI_PUBLIC_KEY;
    const redirect =
      process.env.WOMPI_REDIRECT_URL ||
      `${req.protocol}://${req.get("host")}/thanks`;

    if (!pub)
      return res.status(400).json({ error: "Missing WOMPI_PUBLIC_KEY env" });

    const reference = `MESTORE-${Date.now()}`;

    const params = new URLSearchParams({
      "public-key": pub,
      currency: "COP",
      "amount-in-cents": String(amountInCents),
      reference,
      "redirect-url": redirect,
    });

    const checkoutUrl = `https://checkout.wompi.co/p/?${params.toString()}`;
    res.json({ checkoutUrl, reference });
  } catch (e) {
    res.status(500).json({ error: "Checkout error" });
  }
};
