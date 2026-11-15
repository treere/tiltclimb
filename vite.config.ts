import { defineConfig } from 'vite';

// Dev server tuned for phone testing through a cloudflared quick tunnel:
// - allowedHosts: the tunnel hostname is random, so allow the whole domain
// - hmr over wss on 443: otherwise the HMR client reconnects to :5173 and dies
export default defineConfig({
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app'],
    hmr: {
      protocol: 'wss',
      clientPort: 443
    }
  },
  build: {
    target: 'es2022',
    sourcemap: true
  }
});
