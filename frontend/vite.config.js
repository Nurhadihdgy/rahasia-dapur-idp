import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Diperlukan agar Docker di Windows/WSL bisa mendeteksi perubahan
    },
    host: true, // Agar bisa diakses dari luar kontainer
    port: 5173,
  },
});
