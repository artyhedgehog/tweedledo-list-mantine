import {
    ChangeEventHandler,
    MouseEvent,
    MouseEventHandler,
    ReactNode,
    Ref,
    useState,
} from 'react';
import { Box, CloseButton, TextInput } from '@mantine/core';
import { ENTER_KEY } from '@/components/TodoMvc/constants';
import { ITodo } from '@/components/TodoMvc/interfaces';
import { useI18n } from '@/utils/strings';
import { TodoItemMenu } from '../item-menu';
import { getToggledPriority } from '../priority';

const defaultState = {
    completed: false,
    archived: false,
    priority: undefined,
};

export function SearchOrCreateInputBox(props: {
    ref: Ref<HTMLInputElement>;
    disabled: boolean;
    value: string;
    onCreate: (todo: Omit<ITodo, 'id'>) => void;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onClearInput: MouseEventHandler<HTMLButtonElement>;
    leftSection: ReactNode;
}) {
    const { t } = useI18n();

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

    return (
        <div className="header">
            <TextInput
                ref={props.ref}
                disabled={props.disabled}
                variant="unstyled"
                className="search-bar"
                placeholder={t('searchBar.placeholder')}
                onKeyDown={handleNewTodoKeyDown}
                value={props.value}
                onChange={props.onChange}
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
