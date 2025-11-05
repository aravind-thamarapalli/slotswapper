import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default ({ mode }) => {
  // Load env variables so dev server proxy can use VITE_API_URL if set.
  // Do NOT fall back to hardcoded production URLs here; if VITE_API_URL is not set, the proxy will be disabled.
  const env = loadEnv(mode, process.cwd())
  const rawApi = env.VITE_API_URL
  const apiTarget = rawApi ? rawApi.replace(/\/$/, '').replace(/\/api$/, '') : null

  const serverConfig = {}
  if (apiTarget) {
    serverConfig.proxy = {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    }
  }

  return defineConfig({
    plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: serverConfig,
  })
}
