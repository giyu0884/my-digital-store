import fetch from "node-fetch";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, price } = req.body;

  // Validate input
  if (!name || !price || isNaN(price)) {
    return res.status(400).json({ error: "Missing or invalid product name/price" });
  }

  // Get secret key from environment variable
  const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;

  if (!XENDIT_SECRET_KEY) {
    return res.status(500).json({ error: "Xendit secret key not set" });
  }

  try {
    // Create invoice via Xendit API
    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(XENDIT_SECRET_KEY + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: `product-${Date.now()}`,  // Unique ID
        amount: Number(price),                 // Must be a number
        description: name,
        success_redirect_url: "https://my-digital-store.vercel.app/success.html" // Redirect after payment
      }),
    });

    const data = await response.json();

    if (data.invoice_url) {
      // Send invoice URL to frontend
      res.status(200).json(data);
    } else {
      // Return Xendit error response
      res.status(500).json({ error: "Invoice creation failed", details: data });
    }
  } catch (err) {
    console.error("Xendit API error:", err);
    res.status(500).json({ error: "Server error creating invoice" });
  }
}
