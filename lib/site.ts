/**
 * Obtiene la URL canónica base del sitio de manera dinámica y resiliente.
 * Prioridad:
 * 1. NEXT_PUBLIC_SITE_URL (definida manualmente en variables de entorno de Vercel/producción)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (dominio principal de producción autoconfigurado por Vercel)
 * 3. VERCEL_URL (dominio de despliegue de Vercel)
 * 4. Dominio de despliegue en Vercel (https://bodyindex-fresh.vercel.app)
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }
  return "https://bodyindex-fresh.vercel.app";
}
