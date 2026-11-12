import { authenticate, requireSameOrigin } from "../_lib/admin-auth.js";
import { readAppointments, readSection, writeSection } from "../_lib/blob-data.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedSections = new Set(["services", "posts", "settings"]);

function validContentItems(section, value) {
  if (!Array.isArray(value) || value.length > 100) return false;
  const fields = section === "services"
    ? { title: 200, description: 3000, price: 200, icon: 16 }
    : { title: 200, category: 100, date: 100, excerpt: 3000 };
  return value.every(item => item && typeof item === "object"
    && typeof item.id === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(item.id)
    && Object.entries(fields).every(([field, maxLength]) => (
      typeof item[field] === "string" && item[field].length <= maxLength
    )));
}

function validSettings(value) {
  return value && typeof value === "object"
    && typeof value.email === "string" && value.email.length <= 254 && emailPattern.test(value.email)
    && ["phone", "address", "hours", "instagram"].every(field => (
      typeof value[field] === "string" && value[field].length <= 300
    ));
}

export default async function handler(request, response) {
  if (!["GET", "PUT"].includes(request.method)) {
    response.setHeader("Allow", "GET, PUT");
    return response.status(405).json({ error: "Bu istek yöntemi desteklenmiyor." });
  }
  if (request.method === "PUT" && !requireSameOrigin(request, response)) return;
  if (!authenticate(request, response)) return;
  response.setHeader("Cache-Control", "no-store");

  try {
    if (request.method === "GET") {
      const [services, posts, settings, appointments] = await Promise.all([
        readSection("services"),
        readSection("posts"),
        readSection("settings"),
        readAppointments(),
      ]);
      return response.status(200).json({ services, posts, settings, appointments });
    }

    const { section, value } = request.body || {};
    if (!allowedSections.has(section)
      || (section === "settings" ? !validSettings(value) : !validContentItems(section, value))) {
      return response.status(400).json({ error: "Kaydedilecek içerik geçersiz." });
    }

    await writeSection(section, value);
    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Yönetim verisi Vercel Blob üzerinden okunamadı veya kaydedilemedi:", error);
    return response.status(503).json({ error: "Veri kaydedilemedi. Vercel Blob bağlantısını kontrol edin." });
  }
}
