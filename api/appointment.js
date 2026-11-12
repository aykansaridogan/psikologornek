import nodemailer from "nodemailer";

const recipient = "info@psikologbusecoskun.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Bu istek yöntemi desteklenmiyor." });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_SECURE, SMTP_FROM_EMAIL } = process.env;
  const port = Number(SMTP_PORT);
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !Number.isInteger(port) || port < 1 || port > 65535
    || !["true", "false"].includes(SMTP_SECURE)) {
    console.error("Randevu formu için SMTP ortam değişkenleri eksik veya geçersiz.");
    return response.status(503).json({ error: "E-posta gönderimi henüz yapılandırılmamış. Lütfen daha sonra tekrar deneyin." });
  }

  const { name, email, phone, message = "", website = "" } = request.body || {};
  if (typeof website !== "string" || website.trim()) {
    return response.status(400).json({ error: "Form gönderilemedi. Lütfen tekrar deneyin." });
  }
  if (typeof name !== "string" || !name.trim() || name.trim().length > 120
    || typeof email !== "string" || email.length > 254 || !emailPattern.test(email)
    || typeof phone !== "string" || !phone.trim() || phone.trim().length > 40
    || typeof message !== "string" || message.length > 2000) {
    return response.status(400).json({ error: "Lütfen form alanlarını kontrol edip tekrar deneyin." });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: SMTP_FROM_EMAIL || SMTP_USER,
      to: recipient,
      replyTo: email.trim(),
      subject: "Yeni randevu görüşme talebi",
      text: [
        `Ad soyad: ${name.trim()}`,
        `E-posta: ${email.trim()}`,
        `Telefon: ${phone.trim()}`,
        `Paylaşmak istedikleriniz: ${message.trim() || "Belirtilmedi"}`,
      ].join("\n"),
    });
    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Randevu e-postası SMTP üzerinden gönderilemedi:", error);
    return response.status(502).json({ error: "Talebiniz gönderilemedi. Lütfen daha sonra tekrar deneyin." });
  }
}
