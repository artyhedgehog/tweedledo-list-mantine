import { MouseEventHandler } from 'react';
import { IconPlaylistAdd, IconPlaylistX, IconTrash } from '@tabler/icons-react';
import { Box, Button, Group } from '@mantine/core';
import { PriorityToggle } from '@/features/priority';
import { useI18n } from '@/utils/strings';
import { Priority } from '../priority';

export function TodoItemMenu(
    props: {
        archived: boolean | undefined;
        priority: Priority;
        onArchive: MouseEventHandler<HTMLButtonElement>;
        onSetPriority: (priority: Priority) => void;
    } & (
        | {
              onCreate: MouseEventHandler<HTMLButtonElement>;
          }
        | {
              onDestroy: MouseEventHandler<HTMLButtonElement>;
          }
    )
) {
    const { t } = useI18n();

    const existing = 'onDestroy' in props;
    return (
        <Group>
            {existing && (
                <Button
                    variant="subtle"
                    leftSection={<IconTrash />}
                    onClick={props.onDestroy}
                >
                    {t('todoItem.delete')}
                </Button>
            )}

            <Box flex={1} />

            {props.archived || (
                <Button
                    variant={existing ? 'filled' : 'subtle'}
                    leftSection={<IconPlaylistX />}
                    onClick={props.onArchive}
                >
                    {t('todoItem.archive')}
                </Button>
            )}

            {!existing && (
                <Button
                    variant="filled"
                    leftSection={<IconPlaylistAdd />}
                    onClick={props.onCreate}
                >
                    {t('todoItem.save')}
                </Button>
            )}

            <PriorityToggle
                priority={props.priority}
                onSetPriority={props.onSetPriority}
            />
        </Group>
    );
}
