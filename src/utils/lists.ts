import { ListName } from '@/components/TodoMvc/interfaces';

export const lists: ListName[] = ['groceries', 'pharmacy', 'misc'];

const labels: Record<ListName, string> = {
  groceries: 'Groceries',
  pharmacy: 'Pharmacy',
  misc: 'Misc',
};

export const label = (list: ListName): string => {
  return labels[list];
};

export const path = (list: ListName) => `/${list}`;

export const getListNamespace = (list: ListName) => `shopping-list:${list}`;
