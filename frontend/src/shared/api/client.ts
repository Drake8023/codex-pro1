export async function apiRequest<T>(input: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      throw new Error("Invalid JSON response");
    }
  }
  if (!response.ok) {
    throw new Error(typeof data.message === "string" ? data.message : `HTTP ${response.status}`);
  }
  return data as T;
}
