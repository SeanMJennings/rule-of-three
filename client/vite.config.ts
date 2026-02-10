import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
export default defineConfig(async ({mode}) => ({
    plugins: [
        vue(),
        vueJsx(),
        ...(mode !== 'production' ? [(await import('vite-plugin-vue-devtools')).default()] : [])
    ],
    server: {
        watch: {
            usePolling: true
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
}))
