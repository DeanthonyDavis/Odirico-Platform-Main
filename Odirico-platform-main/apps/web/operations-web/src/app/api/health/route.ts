import { jsonOk } from "@odirico/api/response";

export async function GET() {
  return jsonOk({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
