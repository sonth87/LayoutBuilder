import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Watch for changes in the workspaces packages too
      ignored: ["!**/node_modules/preset-web/**"],
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // build: {
  //   rollupOptions: {
  //     // Externalize deps that shouldn't be bundled
  //     external: ["preset-web"],
  //   },
  // },
  optimizeDeps: {
    // Don't try to optimize these dependencies
    exclude: ["preset-web"],
  },
});
