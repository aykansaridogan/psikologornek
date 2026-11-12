import { login, requireSameOrigin } from "../_lib/admin-auth.js";

export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Bu istek yöntemi desteklenmiyor." });
  }
  if (!requireSameOrigin(request, response)) return;

  try {
    if (!login(request, response)) {
      return response.status(401).json({ error: "Kullanıcı adı veya şifre hatalı." });
    }
    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Yönetici girişi yapılandırma hatası:", error);
    return response.status(503).json({ error: error.message });
  }
}
