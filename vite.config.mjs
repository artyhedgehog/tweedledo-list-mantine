import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import yaml from 'js-yaml';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const configId = env.CONFIG_ID || 'shopping-list';

  // Load YAML config
  const yamlPath = path.resolve(process.cwd(), 'config', configId + '.yaml');
  const yamlContent = fs.readFileSync(yamlPath, 'utf8');
  const yamlData = yaml.load(yamlContent);
  const strings = yamlData.strings;

  const configPlugin = {
    name: 'vite-config-module',
    resolveId(id) {
      if (id === 'virtual:vite-config') return id;
    },
    load(id) {
      if (id === 'virtual:vite-config') {
        return `export default ${JSON.stringify(yamlData)}`;
      }
    },
  };

  const { title, appName, description } = strings;

  return {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: [
          'assets/favicon.ico',
          'assets/icon.png',
          'assets/pwa-192x192.png',
          'assets/pwa-512x512.png',
        ],
        manifest: {
          short_name: appName,
          name: title,
          description,
          theme_color: '#033f63',
          icons: [
            {
              src: 'assets/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'assets/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'assets/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'assets/icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          background_color: '#033f63',
        },
      }),
      react(),
      tsconfigPaths(),
      createHtmlPlugin({
        inject: {
          data: {
            title,
          },
        },
      }),
      configPlugin,
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.mjs',
    },
  };
});
