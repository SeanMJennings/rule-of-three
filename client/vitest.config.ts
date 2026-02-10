import {fileURLToPath, URL} from 'node:url'
import {configDefaults, defineConfig} from 'vitest/config'
import {loadEnv} from "vite";

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    test: {
        environment: 'jsdom',
        env: loadEnv('testing', process.cwd(), ''),
        exclude: [...configDefaults.exclude, 'e2e/*'],
        root: fileURLToPath(new URL('./', import.meta.url)),
    }
})
