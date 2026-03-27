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
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  if (!response.ok) {
    throw new Error(typeof data.message === "string" ? data.message : `HTTP ${response.status}`);
  }
  return data as T;
}
