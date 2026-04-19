export function jsonOk<T>(data: T, init?: ResponseInit) {
  return Response.json(data, { status: 200, ...init });
}

export function jsonError(
  message: string,
  status = 400,
  init?: ResponseInit,
  extra?: Record<string, unknown>,
) {
  return Response.json(
    {
      error: message,
      ...extra,
    },
    { status, ...init },
  );
}
