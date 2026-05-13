import { useEffect, useRef, useState } from 'react';
import { IconChevronUp, IconPlaylistX, IconTrash } from '@tabler/icons-react';
import { Accordion, ActionIcon, Box, Button, Center, Group, TextInput } from '@mantine/core';
import { PriorityIcon } from '@/features/priority/PriorityIcon';
import { PriorityToggle } from '@/features/priority/PriorityToggle';
import { useI18n } from '@/utils/strings';
import { ENTER_KEY, ESCAPE_KEY } from '../TodoMvc/constants';
import { ITodoItemProps } from '../TodoMvc/interfaces';
import { TodoItemIcon } from './TodoItemIcon';

export function TodoItem(props: ITodoItemProps) {
  const { t } = useI18n();

  const editFieldRef = useRef<HTMLInputElement | null>(null);

  const [state, setState] = useState({ editText: props.todo.title });

  function handleSubmit() {
    const val = state.editText.trim();
    if (val) {
      props.onSave(val);
      setState({ editText: val });
    } else {
      props.onDestroy();
    }
  }

  function handleCancel() {
    setState({ editText: props.todo.title });
    props.onCancel(event);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      handleCancel();
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit();
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
    if (!props.editing) {
      return;
    }

    const node = editFieldRef.current;
    if (!node) {
      return;
    }

    node.focus();
    node.setSelectionRange(node.value.length, node.value.length);
  }, [props.editing]);

  return (
    <Accordion.Item value={props.todo.id} component="li">
      <TodoItemIcon
        archived={props.todo.archived ?? false}
        completed={props.todo.completed}
        onToggle={props.onToggle}
        onUnarchive={props.onUnarchive}
      />

      <Center>
        <Accordion.Control pl={56}>
          <TextInput
            ref={editFieldRef}
            value={state.editText}
            onChange={(e) => handleChange(e)}
            onKeyDown={handleKeyDown}
            size="sm"
            variant="unstyled"
            readOnly={!props.editing}
            mr={props.editing ? 20 : 0}
          />

          <ActionIcon
            variant="transparent"
            size={32}
            m="9 0"
            pos="absolute"
            right={0}
            top={5}
            display="block"
            onClick={props.editing ? handleSubmit : undefined}
            title={props.editing ? t('todoItem.save') : t('todoItem.edit')}
            aria-label={props.editing ? t('todoItem.save') : t('todoItem.edit')}
          >
            {props.editing ? <IconChevronUp /> : <PriorityIcon priority={props.todo.priority} />}
          </ActionIcon>
        </Accordion.Control>
      </Center>
      <Accordion.Panel mr={-16}>
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
      </Accordion.Panel>
    </Accordion.Item>
  );
}
