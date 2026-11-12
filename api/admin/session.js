import { isAuthenticated, isConfigured } from "../_lib/admin-auth.js";

export default function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Bu istek yöntemi desteklenmiyor." });
  }

  try {
    isConfigured();
    return response.status(200).json({ authenticated: isAuthenticated(request) });
  } catch (error) {
    console.error("Yönetici oturumu doğrulanamadı:", error);
    return response.status(503).json({ error: error.message });
  }
}
