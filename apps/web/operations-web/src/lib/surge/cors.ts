import { buildCorsHeaders } from "@odirico/api/cors";

function allowedExtensionOrigin(origin: string | null) {
  if (!origin?.startsWith("chrome-extension://")) {
    return null;
  }

  const configuredId = process.env.SURGE_EXTENSION_ID?.trim();
  if (configuredId) {
    const expected = `chrome-extension://${configuredId}`;
    return origin === expected ? origin : null;
  }

  return origin;
}

export function buildSurgeCorsHeaders(origin: string | null) {
  const extensionOrigin = allowedExtensionOrigin(origin);

  if (extensionOrigin) {
    return {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Origin": extensionOrigin,
      Vary: "Origin",
    };
  }

  return buildCorsHeaders(origin);
}

export function handleSurgeOptions(origin: string | null) {
  return new Response(null, {
    status: 204,
    headers: buildSurgeCorsHeaders(origin),
  });
}
