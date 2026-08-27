export function safeInternalPath(value: string | null | undefined, fallback = "/chat") {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.includes("\\") || value.includes("://")) return fallback;
  if (value.length > 200) return fallback;
  return value;
}
