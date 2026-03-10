import { ReactNode } from 'react';
import * as icons from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { ActionIcon, Burger, Button, Container, Flex, Menu, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useConfig } from '@/hooks/use-config';
import { path, useLists } from '@/utils/lists';
import { useI18n } from '@/utils/strings';
import classes from './HeaderSimple.module.css';

const MENU_ICON_SIZE = 20;

const { IconArrowsLeftRight, IconExternalLink, IconList, IconShoppingBagEdit } = icons;

interface Item {
  list: string;
  label: string;
  title: string;
  icon: ReactNode;
  href: string;
  isActive: boolean;
}

export function HeaderSimple() {
  const { config } = useConfig();
  const { listConfigs } = useLists();
  const { t } = useI18n();

  const homeHref = path(listConfigs[0].id);
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const activeHref = location.pathname;

  const limit = config.menu?.topLevelItemsLimit;
  const { topLevelItems, burgerItems } = listConfigs.reduce(
    (acc, { id: list, label, icon }) => {
      const CustomIcon = icon && icons[icon];
      const IconComponent = (CustomIcon || IconList) as React.ComponentType<icons.IconProps>;
      const href = path(list);
      const isActive = activeHref === href;
      const item = {
        list,
        href,
        label: CustomIcon && !isActive ? '' : label,
        title: label,
        isActive,
        icon: <IconComponent size={MENU_ICON_SIZE} />,
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

        <ScrollArea w="100%" scrollbars="x" type="never" className={classes.scroll}>
          <Flex align="center" wrap="nowrap" justify="flex-start">
            {topLevelItems.map(({ list, href, isActive, label, icon, title }) => {
              if (!label) {
                return (
                  <ActionIcon
                    variant="transparent"
                    component="a"
                    key={list}
                    href={href}
                    data-active={isActive || undefined}
                    title={title}
                    aria-label={title}
                  >
                    {icon}
                  </ActionIcon>
                );
              }

              return (
                <Button
                  variant="transparent"
                  leftSection={icon}
                  component="a"
                  key={list}
                  href={href}
                  className={classes.link}
                  data-active={isActive || undefined}
                  title={title}
                >
                  {label}
                </Button>
              );
            })}
          </Flex>
        </ScrollArea>

        <Menu opened={opened} onChange={toggle} shadow="md" width={200}>
          <Menu.Target>
            <Burger opened={opened} onClick={toggle} size="sm" />
          </Menu.Target>
          <Menu.Dropdown>
            {burgerItems.map(({ list, href, label, icon }) => (
              <Menu.Item key={list} leftSection={icon} component="a" href={href}>
                {label}
              </Menu.Item>
            ))}

            {burgerItems.length > 0 && <Menu.Divider />}

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
