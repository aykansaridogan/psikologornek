import { readSection } from "./_lib/blob-data.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Bu istek yöntemi desteklenmiyor." });
  }

  response.setHeader("Cache-Control", "no-store");
  try {
    const [services, posts, settings] = await Promise.all([
      readSection("services"),
      readSection("posts"),
      readSection("settings"),
    ]);
    return response.status(200).json({ services, posts, settings });
  } catch (error) {
    console.error("Site içerikleri Vercel Blob üzerinden okunamadı:", error);
    return response.status(503).json({ error: "Site içerikleri yüklenemedi. Vercel Blob bağlantısını kontrol edin." });
  }
}
