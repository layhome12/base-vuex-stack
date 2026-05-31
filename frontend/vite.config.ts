import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split(".").pop()?.toLowerCase() || "";

          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return "assets/img/[name]-[hash][extname]";
          }

          if (/css/i.test(ext)) {
            return "assets/css/[name]-[hash][extname]";
          }

          return "assets/[ext]/[name]-[hash][extname]";
        },

        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },
});
