export function backendUrl(): string {
  const cfg = (window as any).__APP_CONFIG__;
  if (cfg && cfg.BACKEND_URL) return cfg.BACKEND_URL;
  return "https://actividad3-backend-537174375411.us-central1.run.app";
}
