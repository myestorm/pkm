import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    VitePWA({
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Totonoo - Personal Knowledge Management',
        short_name: 'Totonoo-PKM',
        description: 'Totonoo Personal Knowledge Management',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa/192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa/512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa/512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ]
      }
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-6': '#009844',
          'primary-5': '#23C343',
          'primary-7': '#009A29',
          'primary-4': '#4CD263',
          'primary-3': '#7BE188',
          'primary-2': '#AFF0B5',
          'primary-1': '#E8FFEA',
          'color-border-1': '#f2f3f5',
          'color-border-2': '#e5e6eb',
          'color-border-3': '#c9cdd4',
          'color-border-4': '#869C90',
          'arcoblue-6': '#009844',
        },
        javascriptEnabled: true,
      },
      scss: {
        additionalData: `
          @import "./src/assets/scss/var.scss";
          @import "./src/assets/scss/mixins.scss";
        `
      }
    }
  },
  server: {
    proxy: {
      '/api/': 'http://localhost:4000',
      '/admin/': 'http://localhost:4000',
      '/uploads/': 'http://localhost:4000'
    }
  }
})
