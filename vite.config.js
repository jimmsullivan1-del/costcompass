import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CostCompass",
        short_name: "CostCompass",
        description: "AI-powered logistics cost savings analysis",
        theme_color: "#1d4ed8",
        background_color: "#f0f4ff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      }
    })
  ],
  server: {
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true }
    }
  },
  build: { outDir: "dist" }
});
