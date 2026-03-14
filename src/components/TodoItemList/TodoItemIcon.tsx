import { IconCircle, IconCircleCheck, IconTextPlus } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { useI18n } from '@/utils/strings';

export interface TodoItemIconProps {
  archived: boolean;
  completed: boolean;
  onToggle: () => void;
  onUnarchive: () => void;
}

export function TodoItemIcon(props: TodoItemIconProps) {
  const { t } = useI18n();
  const { title, onClick, icon } = (props.archived && {
    title: t('todoItem.unarchive'),
    onClick: props.onUnarchive,
    icon: <IconTextPlus size={40} />,
  }) ||
    (!props.completed && {
      title: t('todoItem.check'),
      onClick: props.onToggle,
      icon: <IconCircle size={40} />,
    }) || {
      title: t('todoItem.uncheck'),
      onClick: props.onToggle,
      icon: <IconCircleCheck size={40} />,
    };

  return (
    <ActionIcon
      variant="transparent"
      size={42}
      m="auto 0"
      top={0}
      bottom={0}
      left="2px"
      onClick={onClick}
      display="block"
      pos="absolute"
      title={title}
      aria-label={title}
    >
      {icon}
    </ActionIcon>
  );
}
