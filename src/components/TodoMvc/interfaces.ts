export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
  archived?: boolean;
}

export interface ITodoItemProps {
  t: (id: string) => string;
  key: string;
  todo: ITodo;
  editing?: boolean;
  onSave: (val: any) => void;
  onDestroy: () => void;
  onEdit: () => void;
  onCancel: (event: any) => void;
  onToggle: () => void;
  onUnarchive: () => void;
}

export interface ITodoItemState {
  editText: string;
}

export interface ITodoFooterProps {
  completedCount: number;
  onArchiveCompleted: NotificationCallback;
  nowShowing: string | undefined;
  count: number;
}

export type NotificationCallback = () => void;

export interface ITodoModel {
  key: string;
  todos: Array<ITodo>;
  onChanges: Array<NotificationCallback>;
  subscribe: (onChange: NotificationCallback) => void;
  inform: () => void;
  addTodo: (title: string) => void;
  toggleAll: (checked: boolean) => void;
  toggle: (todoToToggle: ITodo) => void;
  unarchive: (todo: ITodo) => void;
  destroy: (todo: ITodo) => void;
  save: (todoToSave: ITodo, text: string) => void;
  archiveCompleted: () => void;
  destroyCompleted: () => void;
  destroyArchived: () => void;
}

export interface ILocation {
  pathname: string;
  search: string;
  key: string;
  /** @example "#/active" */
  hash: string;
}

export type ListName = 'groceries' | 'pharmacy' | 'misc';

export interface IAppProps {
  config: IAppConfig;
  location: ILocation;
  list: ListName;
  t: (id: string) => string;
}

export interface IAppState {
  editing?: string;
  nowShowing?: string;
  searching: string;
  adding?: boolean;
}

export interface IAppConfig {
  strings: Record<string, string>;
  lists: Array<{ id: ListName; label: string }>;
  menu: {
    topLevelItemsLimit: number;
  };
  states: Array<{
    id: string;
    label: string;
    filter: string;
    hash: string;
  }>;
  filters: Record<
    string,
    {
      value: string;
    }
  >;
}
