import { useState } from 'react';
import configFromVite from 'virtual:vite-config';
import { IAppConfig } from '@/components/TodoMvc/interfaces';

export function useConfig(): { config: IAppConfig } {
  // TODO validate;

  const [config] = useState(configFromVite as IAppConfig);

  return { config };
}
