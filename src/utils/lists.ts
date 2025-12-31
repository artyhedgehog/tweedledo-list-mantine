import config from 'virtual:vite-config';
import { ListName } from '@/components/TodoMvc/interfaces';

const listsConfig: Array<{ id: ListName; label: string }> = config.lists;

const { lists, labels } = listsConfig.reduce(
  (acc, { id, label }) => {
    acc.lists.push(id);
    acc.labels[id] = label;

    return acc;
  },
  { lists: [] as ListName[], labels: {} as Record<ListName, string> }
);

export { lists };

export const label = (list: ListName): string => {
  return labels[list];
};

export const path = (list: ListName) => `/${list}`;

export const getListNamespace = (list: ListName) => `shopping-list:${list}`;
