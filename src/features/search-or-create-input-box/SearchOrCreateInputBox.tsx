import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, ReactNode, Ref } from 'react';
import { CloseButton, TextInput } from '@mantine/core';
import { useI18n } from '@/utils/strings';

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
    <TextInput
      ref={props.ref}
      disabled={props.disabled}
      variant="unstyled"
      className="search-bar"
      placeholder={t('searchBar.placeholder')}
      onKeyDown={props.onKeyDown}
      value={props.value}
      onChange={props.onChange}
      leftSection={props.leftSection}
      rightSection={props.value ? <CloseButton onClick={props.onClearInput} /> : undefined}
      size="xl"
      autoFocus
    />
  );
}
