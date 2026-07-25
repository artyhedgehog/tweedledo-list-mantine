import {
    ChangeEventHandler,
    KeyboardEventHandler,
    MouseEventHandler,
    ReactNode,
    Ref,
} from 'react';
import { CloseButton, TextInput } from '@mantine/core';
import { useI18n } from '@/utils/strings';
import { TodoItemMenu } from '../item-menu';

export function SearchOrCreateInputBox(props: {
    ref: Ref<HTMLInputElement>;
    disabled: boolean;
    onKeyDown: KeyboardEventHandler<HTMLInputElement>;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onClearInput: MouseEventHandler<HTMLButtonElement>;
    leftSection: ReactNode;
}) {
    const { t } = useI18n();

    return (
        <div className="header">
            <TextInput
                ref={props.ref}
                disabled={props.disabled}
                variant="unstyled"
                className="search-bar"
                placeholder={t('searchBar.placeholder')}
                onKeyDown={
                    // TODO move creation logic here
                    props.onKeyDown
                }
                value={props.value}
                onChange={props.onChange}
                leftSection={props.leftSection}
                rightSection={
                    props.value ? (
                        <CloseButton onClick={props.onClearInput} />
                    ) : undefined
                }
                size="xl"
                autoFocus
            />

            {props.value && (
                <TodoItemMenu
                    archived={false}
                    priority={undefined}
                    onDestroy={props.onClearInput}
                    onArchive={
                        // TODO create in archive
                        () => {}
                    }
                    onSetPriority={
                        // TODO create with priority: high
                        () => {}
                    }
                />
            )}
        </div>
    );
}
