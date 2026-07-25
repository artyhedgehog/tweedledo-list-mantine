import { IconPlaylistX, IconTrash } from '@tabler/icons-react';
import { Box, Button, Group } from '@mantine/core';
import { PriorityToggle } from '@/features/priority';
import { useI18n } from '@/utils/strings';
import { Priority } from '../priority';
import { MouseEventHandler } from 'react';

export function TodoItemMenu(props: {
  archived: boolean;
  priority: Priority;
  onDestroy: MouseEventHandler<HTMLButtonElement>;
  onArchive: MouseEventHandler<HTMLButtonElement>;
  onSetPriority: (priority: Priority) => void;
}) {
  const { t } = useI18n();

  return (
    <Group>
      <Button variant="subtle" leftSection={<IconTrash />} onClick={props.onDestroy}>
        {t('todoItem.delete')}
      </Button>

      <Box flex={1} />

      {props.archived || (
        <Button leftSection={<IconPlaylistX />} onClick={props.onArchive}>
          {t('todoItem.archive')}
        </Button>
      )}

      <PriorityToggle priority={props.priority} onSetPriority={props.onSetPriority} />
    </Group>
  );
}
