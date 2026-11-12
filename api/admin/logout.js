import { logout, requireSameOrigin } from "../_lib/admin-auth.js";

export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Bu istek yöntemi desteklenmiyor." });
  }
  if (!requireSameOrigin(request, response)) return;

  logout(response);
  return response.status(200).json({ success: true });
}
