import fetch from "node-fetch";

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Missing product name or price" });
  }

  if (!XENDIT_SECRET_KEY) {
    console.error("XENDIT_SECRET_KEY is missing!");
    return res.status(500).json({ error: "Xendit secret key not set" });
  }

  try {
    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(XENDIT_SECRET_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: `product-${Date.now()}`,
        amount: Number(price),
        description: name,
        success_redirect_url: "https://my-digital-store.vercel.app/success.html"
      }),
    });

    const data = await response.json();
    console.log("Xendit response:", data);

    if (data.invoice_url) {
      res.status(200).json({ invoice_url: data.invoice_url });
    } else {
      res.status(500).json({ error: "Invoice creation failed", details: data });
    }
  } catch (err) {
    console.error("Xendit API error:", err);
    res.status(500).json({ error: "Server error creating invoice" });
  }
}
