import {
    ChangeEvent,
    MouseEvent,
    MouseEventHandler,
    ReactNode,
    Ref,
    useCallback,
    useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Box, CloseButton, TextInput } from '@mantine/core';
import { ENTER_KEY } from '@/components/TodoMvc/constants';
import { ITodo } from '@/components/TodoMvc/interfaces';
import { TodoItemMenu } from '@/features/item-menu';
import { getToggledPriority } from '@/features/priority';
import { useI18n } from '@/utils/strings';

const defaultState = {
    completed: false,
    archived: false,
    priority: undefined,
};

export function SearchOrCreateInputBox(props: Readonly<{
    ref: Ref<HTMLInputElement>;
    disabled: boolean;
    value: string;
    onCreate: (todo: Omit<ITodo, 'id'>) => void;
    onSearch: (value: string) => void;
    onClearInput: MouseEventHandler<HTMLButtonElement>;
    leftSection: ReactNode;
}>) {
    const { t } = useI18n();

    const [value, setValue] = useState(props.value);

    const [state, setState] =
        useState<Omit<ITodo, 'id' | 'title'>>(defaultState);

    const trimmedValue = props.value.trim();

    function handleNewTodoKeyDown(event: React.KeyboardEvent) {
        if (event.keyCode !== ENTER_KEY) {
            return;
        }

        event.preventDefault();

        if (trimmedValue) {
            props.onCreate({
                title: trimmedValue,
                ...state,
            });
        }
    }

    function handleClearInput(event: MouseEvent<HTMLButtonElement>) {
        setState(defaultState);
        props.onClearInput(event);
    }

    const debouncedSearch = useDebouncedCallback(props.onSearch, 300);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        setValue(nextValue)

        debouncedSearch(nextValue);
    }, [])

    return (
        <div className="header">
            <TextInput
                ref={props.ref}
                disabled={props.disabled}
                variant="unstyled"
                className="search-bar"
                placeholder={t('searchBar.placeholder')}
                onKeyDown={handleNewTodoKeyDown}
                value={value}
                onChange={handleChange}
                leftSection={props.leftSection}
                rightSection={
                    props.value ? (
                        <CloseButton onClick={handleClearInput} />
                    ) : undefined
                }
                size="xl"
                autoFocus
            />

            {trimmedValue && (
                <Box mr={-16} pt="xs" p="md">
                    <TodoItemMenu
                        archived={state.archived}
                        priority={state.priority}
                        onCreate={() => {
                            props.onCreate({
                                title: trimmedValue,
                                ...state,
                            });
                        }}
                        onArchive={() => {
                            props.onCreate({
                                title: trimmedValue,
                                ...state,
                                archived: true,
                            });
                        }}
                        onSetPriority={() => {
                            setState((previous) => {
                                return {
                                    ...previous,
                                    priority: getToggledPriority(
                                        previous.priority
                                    ),
                                };
                            });
                        }}
                    />
                </Box>
            )}
        </div>
    );
}
