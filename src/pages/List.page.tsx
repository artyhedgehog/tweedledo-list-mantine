import { useLocation } from 'react-router-dom';
import { Anchor, AppShell, Center } from '@mantine/core';
import { HeaderSimple } from '@/components/HeaderSimple/HeaderSimple';
import { ListName } from '@/components/TodoMvc/interfaces';
import { TodoApp } from '@/components/TodoMvc/TodoApp';
import { useConfig } from '@/hooks/use-config';
import { useI18n } from '@/utils/strings';

export function ListPage({ list }: { list: ListName }) {
  const location = useLocation();
  const { config } = useConfig();
  const { t } = useI18n();

  return (
    <AppShell padding="md" header={{ height: 36 }}>
      <HeaderSimple />
      <AppShell.Main>
        <TodoApp location={location} list={list} config={config} t={t} />
      </AppShell.Main>

      <AppShell.Footer>
        <Center>
          Created by <Anchor href="https://github.com/artyhedgehog">@artyhedgehog</Anchor>
          in 2025.
        </Center>
      </AppShell.Footer>
    </AppShell>
  );
}
