import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/vl2/', // <-- Add this line for GitHub Pages
  plugins: [react()],
})
