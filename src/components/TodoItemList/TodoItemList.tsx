import { useEffect, useState } from 'react';
import { Accordion } from '@mantine/core';
import { ITodo, ITodoModel, ListName } from '../TodoMvc/interfaces';
import { TodoModel } from '../TodoMvc/todoModel';
import { TodoItem } from './TodoItem';

export interface TodoItemListProps {
    todos: ITodo[];
    model: ITodoModel;
}

export function TodoItemList(props: TodoItemListProps) {
    const [editing, setEditing] = useState<string | null>(null);

    const handleSave =
        (todo: ITodo) => (text: string, finishEditing: boolean) => {
            props.model.save(todo, text);

            if (finishEditing) {
                setEditing(null);
            }
        };

    const handleChange = (value: string | null) => {
        if (value) {
            setEditing(value);
        }
    };

    /**
     * When search changes
     * - I want the editing closed
     * - otherwise when I clear the search bar
     * -- focus jumps to the editting item input
     */
    useEffect(() => {
        setEditing(null);
    }, [props.todos.length]);

    return (
        <Accordion
            value={editing}
            className="todo-list"
            variant="unstyled"
            onChange={handleChange}
            chevron={null}
        >
            {props.todos.map((todo) => {
                return (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={props.model.toggle.bind(props.model, todo)}
                        onArchive={props.model.archive.bind(props.model, todo)}
                        onUnarchive={props.model.unarchive.bind(
                            props.model,
                            todo
                        )}
                        onDestroy={props.model.destroy.bind(props.model, todo)}
                        onSetPriority={props.model.setPriority.bind(
                            props.model,
                            todo
                        )}
                        onEdit={setEditing.bind(undefined, todo.id)}
                        editing={editing === todo.id}
                        onSave={handleSave(todo)}
                        onCancel={setEditing.bind(undefined, null)}
                        onDuplicate={props.model.addTodo.bind(
                            props.model,
                            todo
                        )}
                        onCopyToList={(listName: ListName) => {
                            const destinationModel = TodoModel.getForList(
                                listName,
                                props.model.storePrefix
                            );

                            destinationModel.addTodo(todo);
                        }}
                        onMoveToList={(listName: ListName) => {
                            const destinationModel = TodoModel.getForList(
                                listName,
                                props.model.storePrefix
                            );

                            destinationModel.addTodo(todo);
                            props.model.destroy(todo);
                        }}
                    />
                );
            })}
        </Accordion>
    );
}
