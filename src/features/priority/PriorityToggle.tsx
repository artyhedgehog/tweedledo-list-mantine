import { useCallback } from 'react';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { useI18n } from '@/utils/strings';
import { getToggledPriority } from './get-toggled-priority';
import { Priority } from './priority.types';

export interface PriorityToggleProps {
    priority: Priority;
    onSetPriority: (priority: Priority) => void;
}

export function PriorityToggle(props: PriorityToggleProps) {
    const { t } = useI18n();

    const togglePriority = useCallback(() => {
        props.onSetPriority(getToggledPriority(props.priority));
    }, [props.priority, props.onSetPriority]);

    return (
        <ActionIcon
            variant="transparent"
            size={32}
            onClick={togglePriority}
            title={t('todoItem.togglePriority')}
            aria-label={t('todoItem.togglePriority')}
        >
            {props.priority === 'high' ? (
                <IconStarFilled color="gold" />
            ) : (
                <IconStar />
            )}
        </ActionIcon>
    );
}
