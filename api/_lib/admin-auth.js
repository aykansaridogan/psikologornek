import { createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "admin_session";
const sessionDuration = 8 * 60 * 60;

function authConfig() {
  const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12
    || !ADMIN_SESSION_SECRET || ADMIN_SESSION_SECRET.length < 32) {
    throw new Error("Yönetici hesabı yapılandırılmamış.");
  }
  return { username: ADMIN_USERNAME, password: ADMIN_PASSWORD, secret: ADMIN_SESSION_SECRET };
}

function signature(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest();
}

function readCookie(request) {
  const cookieHeader = request.headers.cookie || "";
  const cookie = cookieHeader.split(";").map(value => value.trim()).find(value => value.startsWith(`${cookieName}=`));
  if (!cookie) return "";
  try {
    return decodeURIComponent(cookie.slice(cookieName.length + 1));
  } catch {
    return "";
  }
}

function validSession(request, config) {
  const [payload, providedSignature, ...extra] = readCookie(request).split(".");
  if (!payload || !providedSignature || extra.length) return false;

  let actualSignature;
  try {
    actualSignature = Buffer.from(providedSignature, "base64url");
  } catch {
    return false;
  }
  const expectedSignature = signature(payload, config.secret);
  if (actualSignature.length !== expectedSignature.length || !timingSafeEqual(actualSignature, expectedSignature)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.sub === config.username && Number.isInteger(session.exp) && session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function requireSameOrigin(request, response) {
  const origin = request.headers.origin;
  const host = request.headers.host;
  if (!origin || !host) {
    response.status(403).json({ error: "Bu istek kaynağı doğrulanamadı." });
    return false;
  }

  try {
    if (new URL(origin).host !== host) {
      response.status(403).json({ error: "Bu istek kaynağı doğrulanamadı." });
      return false;
    }
  } catch {
    response.status(403).json({ error: "Bu istek kaynağı doğrulanamadı." });
    return false;
  }
  return true;
}

export function authenticate(request, response) {
  let config;
  try {
    config = authConfig();
  } catch (error) {
    response.status(503).json({ error: error.message });
    return false;
  }

  if (!validSession(request, config)) {
    response.status(401).json({ error: "Yönetici girişi gerekli." });
    return false;
  }
  return true;
}

export function login(request, response) {
  const config = authConfig();
  const { username, password } = request.body || {};
  if (typeof username !== "string" || typeof password !== "string"
    || username.length > 200 || password.length > 200) {
    return false;
  }

  const usernameMatches = timingSafeEqual(
    createHmac("sha256", config.secret).update(username).digest(),
    createHmac("sha256", config.secret).update(config.username).digest(),
  );
  const passwordMatches = timingSafeEqual(
    createHmac("sha256", config.secret).update(password).digest(),
    createHmac("sha256", config.secret).update(config.password).digest(),
  );
  if (!usernameMatches || !passwordMatches) return false;

  const payload = Buffer.from(JSON.stringify({
    sub: config.username,
    exp: Math.floor(Date.now() / 1000) + sessionDuration,
  })).toString("base64url");
  const token = `${payload}.${signature(payload, config.secret).toString("base64url")}`;
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1" ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionDuration}${secure}`);
  return true;
}

export function logout(response) {
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1" ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`);
}

export function isAuthenticated(request) {
  return validSession(request, authConfig());
}

export function isConfigured() {
  authConfig();
}
