import { useLocation } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import { FooterSimple } from '@/components/FooterSimple';
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

      <FooterSimple />
    </AppShell>
  );
}
