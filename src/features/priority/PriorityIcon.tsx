import { IconProps, IconStarFilled } from '@tabler/icons-react';
import { Priority } from './priority.types';

export interface PriorityIconProps extends IconProps {
    priority: Priority;
}

export function PriorityIcon({ priority, ...props }: PriorityIconProps) {
    if (priority === 'high') {
        return <IconStarFilled color="gold" {...props} />;
    }

    return null;
}
