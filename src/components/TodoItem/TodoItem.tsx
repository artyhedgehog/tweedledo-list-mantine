import { useEffect, useRef, useState } from 'react';
import { IconTextPlus } from '@tabler/icons-react';
import classNames from 'classnames';
import { ActionIcon } from '@mantine/core';
import { ENTER_KEY, ESCAPE_KEY } from '../TodoMvc/constants';
import { ITodoItemProps } from '../TodoMvc/interfaces';

export function TodoItem(props: ITodoItemProps) {
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

  function handleEdit() {
    props.onEdit();
    setState({ editText: props.todo.title });
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      setState({ editText: props.todo.title });
      props.onCancel(event);
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
    <li
      className={classNames({
        completed: props.todo.completed,
        editing: props.editing,
      })}
    >
      <div className="view">
        {props.todo.archived ? (
          <ActionIcon
            className="unarchive"
            onClick={props.onUnarchive}
            display="block"
            pos="absolute"
            title={props.t('todoItem.unarchive')}
          >
            <IconTextPlus />
          </ActionIcon>
        ) : (
          <input
            className="toggle"
            type="checkbox"
            checked={props.todo.completed}
            onChange={props.onToggle}
          />
        )}

        <label onDoubleClick={() => handleEdit()}>{props.todo.title}</label>

        <button type="button" className="edit-item" onClick={props.onEdit} />
        <button type="button" className="destroy" onClick={props.onDestroy} />
      </div>
      <input
        ref={editFieldRef}
        className="edit"
        value={state.editText}
        onBlur={() => handleSubmit()}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </li>
  );
}
