import { IconExternalLink, IconShoppingBagEdit } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { Burger, Container, Group, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { label, lists, path } from '@/utils/lists';
import classes from './HeaderSimple.module.css';

export function HeaderSimple() {
  const homeHref = path(lists[0]);
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const active = location.pathname;

  const items = lists.map((list) => (
    <a
      key={list}
      href={path(list)}
      className={classes.link}
      data-active={active === list || undefined}
    >
      {label(list)}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <a href={homeHref}>
          <IconShoppingBagEdit size={28} title="Shopping list" />
        </a>

        <Group gap={5}>{items}</Group>

        <Menu opened={opened} onChange={toggle} shadow="md" width={200}>
          <Menu.Target>
            <Burger opened={opened} onClick={toggle} size="sm" />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconExternalLink size={14} />}
              component="a"
              href="https://tweedledo.online"
              target="__blank"
            >
              TweedleDo Home
            </Menu.Item>
            <Menu.Item component="a" href="/data" target="__blank">
              Data export/import
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Container>
    </header>
  );
}
