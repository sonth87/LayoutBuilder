import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "::",
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "preset-web": path.resolve(__dirname, "../../packages/builder-preset/dist/preset-web.min.js"),
    },
  },
  // build: {
  //   rollupOptions: {
  //     // Externalize deps that shouldn't be bundled into the library
  //     // external: ["preset-web"], // Đã bỏ external preset-web để bundle vào build
  //   },
  // },
  optimizeDeps: {
    exclude: ["preset-web"], // Đã bỏ exclude preset-web để bundle vào build
  },
}));
