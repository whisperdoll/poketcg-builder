import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/poketcg-builder/",
  plugins: [react(), tsPaths(), tailwindcss()],
  server: {
    port: 5173,
  },
});
