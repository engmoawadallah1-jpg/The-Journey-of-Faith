// Static (no-server) build of the app, used by the Windows (Electron) and Android (Capacitor) wrappers.
// The web/Lovable build (vite.config.ts) is NOT touched by this file.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(here, "spa"),
  base: "./", // relative asset URLs: required for file:// (Electron) and the Capacitor WebView
  publicDir: path.resolve(here, "public"),
  envDir: here,
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
      routesDirectory: path.resolve(here, "src/routes"),
      generatedRouteTree: path.resolve(here, "src/routeTree.app.gen.ts"),
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { "@": path.resolve(here, "src") },
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
  build: {
    outDir: path.resolve(here, "dist-app"),
    emptyOutDir: true,
    target: "es2022",
    chunkSizeWarningLimit: 1500,
  },
  server: { port: 5174, strictPort: true },
});
