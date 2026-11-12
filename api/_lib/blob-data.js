import { del, get, list, put } from "@vercel/blob";
import { initialData } from "../../src/data.js";

const access = "private";

export async function readJson(pathname, fallback = null) {
  const blob = await get(pathname, { access, useCache: false });
  if (!blob) return fallback;

  try {
    return JSON.parse(await new Response(blob.stream).text());
  } catch (error) {
    console.error(`Vercel Blob JSON verisi okunamadı (${pathname}):`, error);
    throw new Error("Kayıtlı veriler okunamadı.");
  }
}

export async function writeJson(pathname, value) {
  await put(pathname, JSON.stringify(value), {
    access,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });
}

export async function deleteJson(pathname) {
  await del(pathname, { access });
}

export async function readSection(section) {
  return readJson(`admin/${section}.json`, structuredClone(initialData[section]));
}

export async function writeSection(section, value) {
  await writeJson(`admin/${section}.json`, value);
}

export async function readAppointments() {
  const paths = [];
  let cursor;

  do {
    const result = await list({
      access,
      prefix: "admin/appointments/",
      limit: 1000,
      ...(cursor ? { cursor } : {}),
    });
    paths.push(...result.blobs.map(blob => blob.pathname));
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  const appointments = [];
  for (let index = 0; index < paths.length; index += 20) {
    const batch = await Promise.all(paths.slice(index, index + 20).map(pathname => readJson(pathname)));
    appointments.push(...batch.filter(Boolean));
  }

  return appointments.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createAppointment(appointment) {
  await writeJson(`admin/appointments/${appointment.id}.json`, appointment);
}
