import { authenticate, requireSameOrigin } from "../_lib/admin-auth.js";
import { deleteJson, readJson, writeJson } from "../_lib/blob-data.js";

const allowedStatuses = new Set(["Beklemede", "Onaylandı", "Tamamlandı"]);
const appointmentIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(request, response) {
  if (!["PUT", "DELETE"].includes(request.method)) {
    response.setHeader("Allow", "PUT, DELETE");
    return response.status(405).json({ error: "Bu istek yöntemi desteklenmiyor." });
  }
  if (!requireSameOrigin(request, response)) return;
  if (!authenticate(request, response)) return;

  const { id } = request.body || {};
  if (typeof id !== "string" || !appointmentIdPattern.test(id)) {
    return response.status(400).json({ error: "Randevu kaydı geçersiz." });
  }

  const pathname = `admin/appointments/${id}.json`;
  try {
    const appointment = await readJson(pathname);
    if (!appointment) return response.status(404).json({ error: "Randevu kaydı bulunamadı." });

    if (request.method === "DELETE") {
      await deleteJson(pathname);
      return response.status(200).json({ success: true });
    }

    const { status } = request.body;
    if (!allowedStatuses.has(status)) {
      return response.status(400).json({ error: "Randevu durumu geçersiz." });
    }
    const updatedAppointment = { ...appointment, status };
    await writeJson(pathname, updatedAppointment);
    return response.status(200).json({ success: true, appointment: updatedAppointment });
  } catch (error) {
    console.error("Randevu kaydı Vercel Blob üzerinden güncellenemedi:", error);
    return response.status(503).json({ error: "Randevu kaydedilemedi. Vercel Blob bağlantısını kontrol edin." });
  }
}
