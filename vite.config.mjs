import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import yaml from 'js-yaml';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
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
      if (id === 'virtual:vite-config') return id
    },
    load(id) {
      if (id === 'virtual:vite-config') {
        return `export default ${JSON.stringify(yamlData)}`
      }
    }
  }
  
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      createHtmlPlugin({
        inject: {
          data: {
            title: strings.title,
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
