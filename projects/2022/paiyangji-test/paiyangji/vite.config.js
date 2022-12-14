import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    port: 8080,
  },
  base: "./",
  build: {
    target: ["edge90", "chrome90", "firefox90", "safari15"],
  },
});
