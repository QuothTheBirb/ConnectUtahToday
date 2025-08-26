import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {resolve} from 'path'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: [{
      find: '@',
      replacement: resolve(__dirname, './src/')
    }],
  },
})
