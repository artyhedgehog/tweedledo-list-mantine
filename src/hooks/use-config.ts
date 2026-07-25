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
  lists: z
    .array(
      z.object({
        id: IdentifierStringSchema,
        icon: IdentifierStringSchema,
        label: z.string(),
      })
    )
    .nonempty(),
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

const AppSettingsV1Schema = AppConfigV1Schema.partial()
  .extend({
    menu: z
      .object({
        topLevelItemsLimit: z.number().optional(),
      })
      .optional(),
  })
  .optional()
  .default({} as any);

export function useConfig(): {
  config: IAppConfig;
  reloadConfigFromStore: () => void;
  configNamespace: string;
} {
  const storePrefix = configFromVite.storePrefix || '';
  const namespace = addPrefixIfNonEmpty(NAMESPACE, storePrefix);

  const initializeConfig = () => {
    let validConfigFromVite;
    try {
      validConfigFromVite = AppConfigV1Schema.parse(configFromVite);
    } catch (error) {
      console.error('configFromVite is not a valid AppConfigV1Schema', error, configFromVite);

      validConfigFromVite = {};
    }

    const { storePrefix: _storePrefix, ...configData } = Utils.getValue(namespace, {});

    let validSettingsFromStorage;
    try {
      validSettingsFromStorage = AppSettingsV1Schema.parse(configData);
    } catch (error) {
      console.error('configData is not a valid AppSettingsV1Schema', error, configData);

      validSettingsFromStorage = {};
    }

    return {
      strings: {
        ...validConfigFromVite.strings,
        ...validSettingsFromStorage.strings,
      },
      lists: (validSettingsFromStorage.lists || validConfigFromVite.lists) as ListConfig[],
      states: validSettingsFromStorage.states || validConfigFromVite.states || [],
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
