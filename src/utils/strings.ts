import { useConfig } from '@/hooks/use-config';

export function useI18n() {
  const { config } = useConfig();

  function t(id: string): string {
    return config.strings[id];
  }

  return { t };
}
