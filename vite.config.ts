import { TanStackRouterVite as router } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    router(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),
      "@shared": path.resolve(__dirname, "./supabase/functions/_shared/global"),
    },
  },
})
