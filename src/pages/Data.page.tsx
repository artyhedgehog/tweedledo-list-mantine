import { useRef } from 'react';
import * as yaml from 'yaml';
import { Anchor, AppShell, Button, Center, Group, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { HeaderSimple } from '@/components/HeaderSimple/HeaderSimple';
import { Utils } from '@/components/TodoMvc/utils';
import { lists } from '@/utils/lists';

export function DataPage() {
  const yamlRef = useRef<
    { value: string; parsed: unknown } | { value: undefined; parsed: undefined }
  >({ value: undefined, parsed: undefined });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      data: yaml.stringify(Utils.getAllData(lists)),
    },

    validate: {
      data: (value) => {
        try {
          yamlRef.current = { parsed: yaml.parse(value), value };
          return null;
        } catch (error) {
          const message = error instanceof yaml.YAMLError ? error.message : JSON.stringify(error);

          return `Invalid YAML: ${message}`;
        }
      },
    },
    transformValues: ({ data }) =>
      data === yamlRef.current.value ? yamlRef.current.parsed : yaml.parse(data),
  });

  const handleError = (errors: typeof form.errors) => {
    if (errors.data) {
      notifications.show({ message: errors.data, color: 'red' });
    }
  };

  const handleLoad = () => {
    form.setValues({ data: yaml.stringify(Utils.getAllData(lists)) });
  };

  return (
    <AppShell padding="md" header={{ height: 36 }}>
      <HeaderSimple />
      <AppShell.Main>
        <form onSubmit={form.onSubmit(Utils.saveAllData, handleError)}>
          <Textarea
            placeholder="Enter data YAML to use"
            label="Data YAML"
            autosize
            minRows={3}
            key={form.key('data')}
            {...form.getInputProps('data')}
          />
          <Group>
            <Button type="submit" mt="sm">
              Save
            </Button>
            <Button type="button" mt="sm" onClick={handleLoad}>
              Load
            </Button>
          </Group>
        </form>
      </AppShell.Main>

      {/* TODO: Refactor into <FooterSimple /> */}
      <AppShell.Footer>
        <Center>
          Created by <Anchor href="https://github.com/artyhedgehog">@artyhedgehog</Anchor>
          in 2025.
        </Center>
      </AppShell.Footer>
    </AppShell>
  );
}
