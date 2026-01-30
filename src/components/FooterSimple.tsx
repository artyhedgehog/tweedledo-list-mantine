import { Anchor, AppShell, Center } from '@mantine/core';

export function FooterSimple() {
  return (
    <AppShell.Footer>
      <Center>
        Created by&nbsp;<Anchor href="https://github.com/artyhedgehog">@artyhedgehog</Anchor>
        &nbsp;in 2025&mdash;2026.
      </Center>
    </AppShell.Footer>
  );
}
