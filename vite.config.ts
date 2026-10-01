import vinext from "vinext";
import { defineConfig } from "vite";

// Target-agnostic core. vinext auto-registers @vitejs/plugin-rsc for the app/
// router. For Cloudflare or Node/Nitro targets, see docs/deployment (add the
// relevant Vite plugin here).
export default defineConfig({
  // Match the port in NEXT_PUBLIC_SITE_URL / SITE_URL so auth callbacks and
  // trusted origins line up. `vite dev` otherwise defaults to 5173.
  server: { port: 3000 },
  preview: { port: 3000 },
  plugins: [vinext()],
});
