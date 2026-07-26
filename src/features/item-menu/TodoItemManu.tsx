import { MouseEventHandler } from 'react';
import {
    IconCopy,
    IconDots,
    IconFileArrowRight,
    IconFilePlus,
    IconPlaylistAdd,
    IconPlaylistX,
    IconTrash,
} from '@tabler/icons-react';
import { ActionIcon, Box, Button, Group, Menu } from '@mantine/core';
import { ListName } from '@/components/TodoMvc/interfaces';
import { Priority, PriorityToggle } from '@/features/priority';
import { useLists } from '@/utils/lists';
import { useI18n } from '@/utils/strings';
import { TablerIcon } from '../tabler-icon';

const MENU_ICON_SIZE = 20;
const MENU_OPEN_DELAY = 120;
const MENU_CLOSE_DELAY = 150;

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
              onDuplicate: () => void;
              onCopyToList: (list: ListName) => void;
              onMoveToList: (list: ListName) => void;
          }
    )
) {
    const { t } = useI18n();
    const existing = 'onDestroy' in props;
    const { listConfigs } = useLists();

    return (
        <Group>
            {existing && (
                <Menu position="bottom-start">
                    <Menu.Target>
                        <ActionIcon
                            aria-label={t('todoItem.actions')}
                            variant="subtle"
                            size="xl"
                        >
                            <IconDots />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconCopy />}
                            onClick={props.onDuplicate}
                        >
                            {t('todoItem.actions.duplicate')}
                        </Menu.Item>

                        <Menu.Sub
                            openDelay={MENU_OPEN_DELAY}
                            closeDelay={MENU_CLOSE_DELAY}
                        >
                            <Menu.Sub.Target>
                                <Menu.Sub.Item leftSection={<IconFilePlus />}>
                                    {t('todoItem.actions.copyToList')}
                                </Menu.Sub.Item>
                            </Menu.Sub.Target>

                            <Menu.Sub.Dropdown>
                                {listConfigs.map(({ id, label, icon }) => {
                                    return (
                                        <Menu.Item
                                            key={id}
                                            leftSection={
                                                <TablerIcon
                                                    icon={icon}
                                                    size={MENU_ICON_SIZE}
                                                />
                                            }
                                            onClick={props.onCopyToList.bind(
                                                undefined,
                                                id
                                            )}
                                        >
                                            {label}
                                        </Menu.Item>
                                    );
                                })}
                            </Menu.Sub.Dropdown>
                        </Menu.Sub>

                        <Menu.Sub
                            openDelay={MENU_OPEN_DELAY}
                            closeDelay={MENU_CLOSE_DELAY}
                        >
                            <Menu.Sub.Target>
                                <Menu.Sub.Item
                                    leftSection={<IconFileArrowRight />}
                                >
                                    {t('todoItem.actions.moveToList')}
                                </Menu.Sub.Item>
                            </Menu.Sub.Target>

                            <Menu.Sub.Dropdown>
                                {listConfigs.map(({ id, label, icon }) => {
                                    return (
                                        <Menu.Item
                                            key={id}
                                            leftSection={
                                                <TablerIcon
                                                    icon={icon}
                                                    size={MENU_ICON_SIZE}
                                                />
                                            }
                                            onClick={props.onMoveToList.bind(
                                                undefined,
                                                id
                                            )}
                                        >
                                            {label}
                                        </Menu.Item>
                                    );
                                })}
                            </Menu.Sub.Dropdown>
                        </Menu.Sub>

                        <Menu.Item
                            leftSection={<IconTrash />}
                            onClick={props.onDestroy}
                            color="red"
                        >
                            {t('todoItem.delete')}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
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
                    {t('todoItem.add')}
                </Button>
            )}

            <PriorityToggle
                priority={props.priority}
                onSetPriority={props.onSetPriority}
            />
        </Group>
    );
}
