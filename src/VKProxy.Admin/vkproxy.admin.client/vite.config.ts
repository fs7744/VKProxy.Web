import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { resolve, dirname } from 'node:path'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    }
  },
  server: {
    proxy: {
      '/api': {
        target: "http://127.0.0.1:5041"
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver(), IconsResolver({
        prefix: 'Icon',
      })],
    }),
    Components({
      resolvers: [IconsResolver({
        enabledCollections: ['ep'],
      }), ElementPlusResolver()],
    }),
    Icons({
      autoInstall: true,
    }),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
