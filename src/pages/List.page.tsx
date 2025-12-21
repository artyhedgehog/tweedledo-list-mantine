import { useLocation } from 'react-router-dom';
import {
  // Anchor,
  AppShell,
  // Center
} from '@mantine/core';
import { HeaderSimple } from '@/components/HeaderSimple/HeaderSimple';
import { ListName } from '@/components/TodoMvc/interfaces';
import { TodoApp } from '@/components/TodoMvc/TodoApp';

export function ListPage({ list }: { list: ListName }) {
  const location = useLocation();

  return (
    <AppShell padding="md" header={{ height: 36 }}>
      <HeaderSimple />
      <AppShell.Main>
        <TodoApp location={location} list={list} />
      </AppShell.Main>

      {/* FIXME overlaps TodoMVC footer on mobile layout
      <AppShell.Footer>
        <Center>
          Created by <Anchor href="https://github.com/artyhedgehog">@artyhedgehog</Anchor>
          in 2025.
        </Center>
      </AppShell.Footer> */}
    </AppShell>
  );
}
