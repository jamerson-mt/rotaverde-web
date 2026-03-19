const FALLBACK_WINDOW_URL =
  typeof window !== "undefined" ? `${window.location.origin}/api/` : "";

  // O código acima define uma constante `FALLBACK_WINDOW_URL` que tenta construir uma URL base para a API usando o `window.location.origin` se o objeto `window` estiver disponível (ou seja, se o código estiver sendo executado em um ambiente de navegador). Se o `window` não estiver disponível (por exemplo, em um ambiente de servidor), ele retorna uma string vazia.
const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_URL_DOCKER ||
  import.meta.env.VITE_API_URL_NO_DOCKER ||
  FALLBACK_WINDOW_URL;

function normalizeProtocol(url: string): string {
  if (!url) {
    return "";
  }

  let normalized = url.trim();

  if (!normalized) {
    return "";
  }

  if (normalized.startsWith("//")) {
    normalized = `https:${normalized}`;
  }

  if (!normalized.startsWith("http")) {
    normalized = `https://${normalized}`;
  }

  if (normalized.toLowerCase().startsWith("http://")) {
    normalized = normalized.replace(/^http:\/\//i, "https://");
  }

  if (!normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }

  return normalized;
}

export const API_BASE_URL = normalizeProtocol(RAW_API_URL);

export function buildApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (!API_BASE_URL) {
    throw new Error(
      "API_BASE_URL não está definido. Configure VITE_API_URL ou VITE_API_URL_NONE."
    );
  }

  return `${API_BASE_URL}${cleanPath}`;
}
