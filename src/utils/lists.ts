import { ListConfig, ListName } from '@/components/TodoMvc/interfaces';
import { useConfig } from '@/hooks/use-config';

export function useLists() {
  const { config } = useConfig();

  const listConfigs: Array<ListConfig> = config.lists;

  const { lists, labels } = listConfigs.reduce(
    (acc, { id, label }) => {
      acc.lists.push(id);
      acc.labels[id] = label;

      return acc;
    },
    { lists: [] as ListName[], labels: {} as Record<ListName, string> }
  );

  const label = (list: ListName): string => {
    return labels[list];
  };

  return { lists, label, listConfigs };
}

export const path = (list: ListName) => `/${list}`;

export const addPrefixIfNonEmpty = (key: string, storePrefix: string | undefined) => {
  if (storePrefix) {
    return `${storePrefix}:${key}`;
  }

  return key;
};

export const getListNamespace = (list: ListName) => `shopping-list:${list}`;
