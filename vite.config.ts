import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), {
      name: 'static-estimator-entry',
      enforce: 'post',
      generateBundle: {
        order: 'post',
        handler(_options, bundle) {
          const entry = bundle['index.html'];
          if (!entry || entry.type !== 'asset') {
            this.error('Missing built index.html for the cost estimator entry.');
          }
          // Apache can serve this directory directly without an SPA rewrite.
          this.emitFile({ type: 'asset', fileName: 'cost-estimator/index.html', source: entry.source });
        },
      },
    }],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '127.0.0.1',
      port: 3000,
      strictPort: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
