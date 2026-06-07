export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_SENDER  = process.env.BREVO_SENDER;

  if (!BREVO_API_KEY || !BREVO_SENDER) {
    console.error("send-email: BREVO_API_KEY or BREVO_SENDER not configured");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const { to, subject, htmlContent, replyTo } = req.body || {};

  if (!to || !subject || !htmlContent) {
    return res.status(400).json({ error: "Missing required fields: to, subject, htmlContent" });
  }

  const toArr = typeof to === "string" ? [{ email: to }] : to;
  const payload = {
    sender: { name: "Fonkiart", email: BREVO_SENDER },
    to: toArr,
    subject,
    htmlContent,
  };
  if (replyTo) payload.replyTo = { email: replyTo };

  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!brevoRes.ok) {
      const text = await brevoRes.text();
      console.error("Brevo error:", brevoRes.status, text);
      return res.status(502).json({ error: `Brevo ${brevoRes.status}`, detail: text });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("send-email handler:", e);
    return res.status(500).json({ error: e.message });
  }
}
