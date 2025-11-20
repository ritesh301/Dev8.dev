export function sanitizeVsCodeUrl(raw?: string | null): string | null | undefined {
  if (!raw) return raw ?? null;

  try {
    const cleaned = new URL(raw);
    if (cleaned.port === '8080') {
      cleaned.port = '';
    }
    return cleaned.toString();
  } catch (error) {
    // Fallback: best-effort removal if URL constructor fails
    return raw.replace(':8080', '');
  }
}
