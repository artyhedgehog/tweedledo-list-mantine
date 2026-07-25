import { IconPlaylistX, IconTrash } from '@tabler/icons-react';
import { Box, Button, Group } from '@mantine/core';
import { ITodoItemProps } from '@/components/TodoMvc/interfaces';
import { PriorityToggle } from '@/features/priority';
import { useI18n } from '@/utils/strings';

export function TodoItemMenu(props: ITodoItemProps) {
  const { t } = useI18n();

  return (
    <Group>
      <Button variant="subtle" leftSection={<IconTrash />} onClick={props.onDestroy}>
        {t('todoItem.delete')}
      </Button>

      <Box flex={1} />

      {props.todo.archived || (
        <Button leftSection={<IconPlaylistX />} onClick={props.onArchive}>
          {t('todoItem.archive')}
        </Button>
      )}

      <PriorityToggle priority={props.todo.priority} onSetPriority={props.onSetPriority} />
    </Group>
  );
}
