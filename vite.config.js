import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'LEGO Set Audit',
        short_name: 'LEGO Audit',
        description: 'Audit and track your LEGO set builds',
        theme_color: '#ff0000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/lego-audit/',
        start_url: '/lego-audit/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache Rebrickable API responses
            urlPattern: /^https:\/\/rebrickable\.com\/api\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'rebrickable-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache part images from Rebrickable CDN
            urlPattern: /^https:\/\/cdn\.rebrickable\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'rebrickable-images-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Enable if you want to test PWA in dev mode
      }
    })
  ],
  base: '/lego-audit/', // GitHub Pages base path
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
