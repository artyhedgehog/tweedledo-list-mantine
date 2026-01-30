import { useState } from 'react';
import configFromVite from 'virtual:vite-config';
import { IAppConfig } from '@/components/TodoMvc/interfaces';
import { Utils } from '@/components/TodoMvc/utils';
import { addPrefixIfNonEmpty } from '@/utils/lists';

const NAMESPACE = 'config';

export function useConfig(): {
  config: IAppConfig;
  reloadConfigFromStore: () => void;
  configNamespace: string;
} {
  const storePrefix = configFromVite.storePrefix || '';
  const namespace = addPrefixIfNonEmpty(NAMESPACE, storePrefix);

  const initializeConfig = () => {
    const { storePrefix: _storePrefix, ...configData } = Utils.getValue(namespace, {});

    return {
      ...configFromVite,
      ...configData,
    };
  };

  const [config, setConfig] = useState(initializeConfig());

  const reloadConfigFromStore = () => setConfig(initializeConfig());

  return { config, configNamespace: NAMESPACE, reloadConfigFromStore };
}
