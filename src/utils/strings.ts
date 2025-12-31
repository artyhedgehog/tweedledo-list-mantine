import config from 'virtual:vite-config';

export function t(id: string): string {
  return config.strings[id];
}
