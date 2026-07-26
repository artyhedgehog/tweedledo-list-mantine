import * as icons from '@tabler/icons-react';

export type IconComponentName = keyof typeof icons;

export function TablerIcon(props: {
    icon: IconComponentName | undefined;
    size: icons.IconProps['size'];
}) {
    const CustomIcon = props.icon && icons[props.icon];
    const IconComponent = (CustomIcon ||
        icons.IconList) as React.ComponentType<icons.IconProps>;

    return <IconComponent size={props.size} />;
}
