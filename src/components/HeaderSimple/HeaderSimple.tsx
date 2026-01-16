import {
  IconArrowsLeftRight,
  IconExternalLink,
  IconList,
  IconShoppingBagEdit,
} from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import config from 'virtual:vite-config';
import { Burger, Button, Container, Group, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { label, lists, path } from '@/utils/lists';
import { t } from '@/utils/strings';
import classes from './HeaderSimple.module.css';

const MENU_ICON_SIZE = 14;

interface Item {
  list: string;
  label: string;
  href: string;
  isActive: boolean;
}

export function HeaderSimple() {
  const homeHref = path(lists[0]);
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const activeHref = location.pathname;

  const limit = config.menu?.topLevelItemsLimit;
  const { topLevelItems, burgerItems } = lists.reduce(
    (acc, list) => {
      const href = path(list);
      const isActive = activeHref === href;
      const item = {
        list,
        href,
        label: label(list),
        isActive,
      };

      const isFull = limit && acc.topLevelItems.length >= limit;

      if (isFull && !isActive) {
        acc.burgerItems.push(item);
      } else {
        if (isFull) {
          const replacedItem = acc.topLevelItems.pop() as Item;

          acc.burgerItems.unshift(replacedItem);
        }

        acc.topLevelItems.push(item);
      }

      return acc;
    },
    {
      topLevelItems: [] as Item[],
      burgerItems: [] as Item[],
    }
  );

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <a href={homeHref}>
          <IconShoppingBagEdit size={28} title="Shopping list" />
        </a>

        <Group gap={5}>
          {topLevelItems.map(({ list, href, isActive, label }) => (
            <Button
              variant="transparent"
              leftSection={<IconList size={MENU_ICON_SIZE} />}
              component="a"
              key={list}
              href={href}
              className={classes.link}
              data-active={isActive || undefined}
            >
              {label}
            </Button>
          ))}
        </Group>

        <Menu opened={opened} onChange={toggle} shadow="md" width={200}>
          <Menu.Target>
            <Burger opened={opened} onClick={toggle} size="sm" />
          </Menu.Target>
          <Menu.Dropdown>
            {burgerItems.map(({ list, href, label }) => (
              <Menu.Item
                key={list}
                leftSection={<IconList size={MENU_ICON_SIZE} />}
                component="a"
                href={href}
              >
                {label}
              </Menu.Item>
            ))}

            {burgerItems.length && <Menu.Divider />}

            <Menu.Item
              leftSection={<IconArrowsLeftRight size={MENU_ICON_SIZE} />}
              component="a"
              href="/data"
            >
              {t('menu.data')}
            </Menu.Item>

            <Menu.Item
              leftSection={<IconExternalLink size={MENU_ICON_SIZE} />}
              component="a"
              href="https://tweedledo.online"
              target="__blank"
            >
              {t('menu.tweedledo')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Container>
    </header>
  );
}
