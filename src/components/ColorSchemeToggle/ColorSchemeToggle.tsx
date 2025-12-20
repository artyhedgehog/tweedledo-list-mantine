import { Button, Group, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Group justify="right" mr="xs">
      <Button size="compact-xs" onClick={() => setColorScheme('light')}>
        Light
      </Button>
      <Button size="compact-xs" onClick={() => setColorScheme('dark')}>
        Dark
      </Button>
      <Button size="compact-xs" onClick={() => setColorScheme('auto')}>
        Auto
      </Button>
    </Group>
  );
}
