import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/feedback': {
        target:
          'https://script.google.com/macros/s/AKfycbzdqpD7HznhP6BApYb1AEzGACg2rdgvTwcAymnA-trrXv-Z2IO9Fn2SCYSxZAYj4aFZ6A/exec',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/feedback/, ''),
      },
    },
  },
})
