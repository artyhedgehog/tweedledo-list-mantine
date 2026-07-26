import { useEffect, useRef, useState } from 'react';
import { IconChevronUp } from '@tabler/icons-react';
import { Accordion, ActionIcon, Center, TextInput } from '@mantine/core';
import { ENTER_KEY, ESCAPE_KEY } from '../TodoMvc/constants';
import { ITodoItemProps } from '../TodoMvc/interfaces';
import { TodoItemIcon } from './TodoItemIcon';
import { TodoItemMenu } from '@/features/item-menu';
import { PriorityIcon } from '@/features/priority';
import { useI18n } from '@/utils/strings';

export function TodoItem({
    key,
    todo,
    editing,
    ...handlerProps
}: ITodoItemProps) {
    const { t } = useI18n();

    const editFieldRef = useRef<HTMLInputElement | null>(null);

    const [state, setState] = useState({ editText: todo.title });

    function handleSubmit(finishEditing: boolean) {
        const val = state.editText.trim();

        if (val) {
            handlerProps.onSave(val, finishEditing);
            setState({ editText: val });
        } else {
            handlerProps.onDestroy();
        }
    }

    function handleCancel() {
        setState({ editText: todo.title });
        handlerProps.onCancel(event);
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.keyCode === ESCAPE_KEY) {
            handleCancel();
        } else if (event.keyCode === ENTER_KEY) {
            handleSubmit(true);
        }
    }

    function handleChange(event: React.FormEvent) {
        const input: any = event.target;

        setState({ editText: input.value });
    }

    /**
     * Safely manipulate the DOM after updating the state when invoking
     * `props.onEdit()` in the `handleEdit` method above.
     * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
     * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
     */
    useEffect(() => {
        // run when `editing` changes from false -> true
        if (!editing) {
            return;
        }

        const node = editFieldRef.current;
        if (!node) {
            return;
        }

        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
    }, [editing]);

    return (
        <Accordion.Item value={todo.id} component="li">
            <TodoItemIcon
                archived={todo.archived ?? false}
                completed={todo.completed}
                onToggle={handlerProps.onToggle}
                onUnarchive={handlerProps.onUnarchive}
            />

            <Center>
                <Accordion.Control pl={56} component="span">
                    <TextInput
                        ref={editFieldRef}
                        value={state.editText}
                        onChange={(e) => handleChange(e)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSubmit.bind(undefined, false)}
                        size="sm"
                        variant="unstyled"
                        readOnly={!editing}
                        mr={editing ? 20 : 0}
                    />

                    <ActionIcon
                        variant="transparent"
                        size={32}
                        m="9 0"
                        pos="absolute"
                        right={0}
                        top={5}
                        display="block"
                        onClick={
                            editing
                                ? handleSubmit.bind(undefined, true)
                                : undefined
                        }
                        title={
                            editing ? t('todoItem.save') : t('todoItem.edit')
                        }
                        aria-label={
                            editing ? t('todoItem.save') : t('todoItem.edit')
                        }
                    >
                        {editing ? (
                            <IconChevronUp />
                        ) : (
                            <PriorityIcon priority={todo.priority} />
                        )}
                    </ActionIcon>
                </Accordion.Control>
            </Center>

            <Accordion.Panel mr={-16}>
                <TodoItemMenu
                    archived={todo.archived}
                    priority={todo.priority}
                    {...handlerProps}
                />
            </Accordion.Panel>
        </Accordion.Item>
    );
}
