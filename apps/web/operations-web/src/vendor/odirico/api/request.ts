export type RequestLike = {
  headers: Pick<Headers, "get">;
};

export function getRequestIdentity(request: RequestLike) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp || "anonymous";
}
