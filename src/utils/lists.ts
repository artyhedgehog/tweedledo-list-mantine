import { ListName } from '@/components/TodoMvc/interfaces';
import { useConfig } from '@/hooks/use-config';

export function useLists() {
  const { config } = useConfig();

  const listsConfig: Array<{ id: ListName; label: string }> = config.lists;

  const { lists, labels } = listsConfig.reduce(
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

  return { lists, label };
}

export const path = (list: ListName) => `/${list}`;

export const getListNamespace = (list: ListName) => `shopping-list:${list}`;
