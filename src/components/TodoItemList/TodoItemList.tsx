import { useState } from 'react';
import { List } from '@mantine/core';
import { ITodo, ITodoModel } from '../TodoMvc/interfaces';
import { TodoItem } from './TodoItem';

export interface TodoItemListProps {
  todos: ITodo[];
  model: ITodoModel;
}

export function TodoItemList(props: TodoItemListProps) {
  const [editing, setEditing] = useState<string | undefined>(undefined);

  const handleSave = (todo: ITodo) => (text: string) => {
    props.model.save(todo, text);
    setEditing(undefined);
  };

  return (
    <List className="todo-list" spacing={0}>
      {props.todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={props.model.toggle.bind(props.model, todo)}
            onUnarchive={props.model.unarchive.bind(props.model, todo)}
            onDestroy={props.model.destroy.bind(props.model, todo)}
            onEdit={setEditing.bind(undefined, todo.id)}
            editing={editing === todo.id}
            onSave={handleSave(todo)}
            onCancel={setEditing.bind(undefined, undefined)}
          />
        );
      })}
    </List>
  );
}
