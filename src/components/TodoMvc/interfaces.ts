import * as icons from '@tabler/icons-react';
import { Priority } from '@/features/priority/priority.types';

export interface ITodo {
    id: string;
    title: string;
    completed: boolean;
    archived?: boolean;
    priority?: Priority;
}

export interface ITodoItemProps {
    key: string;
    todo: ITodo;
    editing?: boolean;
    onSave: (val: any) => void;
    onDestroy: () => void;
    onSetPriority: (priority: Priority) => void;
    onEdit: () => void;
    onCancel: (event: any) => void;
    onToggle: () => void;
    onArchive: () => void;
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
    addTodo: (todo: Omit<ITodo, 'id'>) => void;
    toggleAll: (checked: boolean) => void;
    toggle: (todoToToggle: ITodo) => void;
    setPriority: (todo: ITodo, priority: Priority) => void;
    archive: (todo: ITodo) => void;
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

export type ListName = string;

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

export type IconComponentName = keyof typeof icons;

export interface ListConfig {
    id: ListName;
    icon?: IconComponentName;
    label: string;
}

export interface AppSettings {
    strings: Record<string, string>;
    lists: ListConfig[];
    menu?: {
        topLevelItemsLimit?: number;
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

export interface IAppConfig extends AppSettings {
    storePrefix?: string;
}
