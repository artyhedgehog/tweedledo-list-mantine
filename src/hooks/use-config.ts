import { useState } from 'react';
import configFromVite from 'virtual:vite-config';
import { z } from 'zod';
import { IAppConfig, ListConfig } from '@/components/TodoMvc/interfaces';
import { Utils } from '@/components/TodoMvc/utils';
import { addPrefixIfNonEmpty } from '@/utils/lists';

const NAMESPACE = 'config';

const IdentifierStringSchema = z.string().regex(/\w+/);

const AppConfigV1Schema = z.object({
  strings: z.record(IdentifierStringSchema, z.string()),
  lists: z.array(
    z.object({
      id: IdentifierStringSchema,
      icon: IdentifierStringSchema,
      label: z.string(),
    })
  ),
  states: z.array(
    z.object({
      id: IdentifierStringSchema,
      label: z.string(),
      filter: z.string(),
      hash: z.string(),
    })
  ),
  filters: z.object(),
});

const AppSettingsV1Schema = AppConfigV1Schema.extend({
  menu: z
    .object({
      topLevelItemsLimit: z.number().optional(),
    })
    .optional(),
});

export function useConfig(): {
  config: IAppConfig;
  reloadConfigFromStore: () => void;
  configNamespace: string;
} {
  const storePrefix = configFromVite.storePrefix || '';
  const namespace = addPrefixIfNonEmpty(NAMESPACE, storePrefix);

  const initializeConfig = () => {
    const validConfigFromVite = AppConfigV1Schema.parse(configFromVite);

    const { storePrefix: _storePrefix, ...configData } = Utils.getValue(namespace, {});

    const validSettingsFromStorage = AppSettingsV1Schema.parse(configData);

    return {
      strings: {
        ...validConfigFromVite.strings,
        ...validSettingsFromStorage.strings,
      },
      lists: (validSettingsFromStorage.lists || validConfigFromVite.lists) as ListConfig[],
      states: validSettingsFromStorage.states || validConfigFromVite.states,
      filters: {
        ...validConfigFromVite.filters,
        ...validSettingsFromStorage.filters,
      },
      menu: {
        ...validSettingsFromStorage.menu,
      },
    };
  };

  const [config, setConfig] = useState(initializeConfig());

  const reloadConfigFromStore = () => setConfig(initializeConfig());

  return { config, configNamespace: NAMESPACE, reloadConfigFromStore };
}
