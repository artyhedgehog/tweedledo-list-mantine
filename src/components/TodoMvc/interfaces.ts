export interface ITodo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ITodoItemProps {
  key: string;
  todo: ITodo;
  editing?: boolean;
  onSave: (val: any) => void;
  onDestroy: () => void;
  onEdit: () => void;
  onCancel: (event: any) => void;
  onToggle: () => void;
}

export interface ITodoItemState {
  editText: string;
}

export interface ITodoFooterProps {
  completedCount: number;
  onClearCompleted: any;
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
  destroy: (todo: ITodo) => void;
  save: (todoToSave: ITodo, text: string) => void;
  clearCompleted: () => void;
}

export interface ILocation {
  pathname: string;
  search: string;
  key: string;
  /** @example "#/active" */
  hash: string;
}

export type ListName = 'groceries';

export interface IAppProps {
  location: ILocation;
  list: ListName;
}

export interface IAppState {
  editing?: string;
  nowShowing?: string;
}
