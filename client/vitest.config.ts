import {fileURLToPath} from 'node:url'
import {configDefaults, defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'
import {loadEnv} from "vite";

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            env: loadEnv('testing', process.cwd(), ''),
            exclude: [...configDefaults.exclude, 'e2e/*'],
            root: fileURLToPath(new URL('./', import.meta.url)),
        }
    })
)
