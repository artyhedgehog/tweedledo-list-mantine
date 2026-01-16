import { useRef } from 'react';
import { IconBackspace, IconReload } from '@tabler/icons-react';
import * as yaml from 'yaml';
import { Anchor, AppShell, Button, Center, CopyButton, Group, Textarea } from '@mantine/core';
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
    mode: 'controlled',
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

  const handleSave = (data: Record<string, unknown>) => {
    try {
      Utils.saveAllData(data);
      form.resetTouched();
      form.resetDirty();
      notifications.show({ message: 'Data from the YAML is imported to the app' });
    } catch (e: any) {
      const message = e.message ?? 'Unknown error';
      form.setErrors({ data: message });
      notifications.show({ message, color: 'red' });
    }
  };

  const handleLoad = () => {
    form.reset();
    form.initialize({ data: yaml.stringify(Utils.getAllData(lists)) });
  };

  const handleClear = () => {
    form.setValues({ data: '' });
  };

  const dataInputProps = form.getInputProps('data');

  return (
    <AppShell padding="md" header={{ height: 36 }}>
      <HeaderSimple />
      <AppShell.Main>
        <form onSubmit={form.onSubmit(handleSave, handleError)}>
          <Textarea
            placeholder="Enter data YAML to use"
            label="Data YAML"
            autosize
            resize="vertical"
            minRows={3}
            maxRows={16}
            key={form.key('data')}
            {...dataInputProps}
          />
          <Group gap={5} mt={5}>
            <CopyButton value={dataInputProps.value}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? 'teal' : 'blue'}
                  onClick={copy}
                  disabled={!dataInputProps.value}
                >
                  {copied ? 'Copied!' : 'Copy YAML'}
                </Button>
              )}
            </CopyButton>

            <Button
              color="red"
              type="submit"
              disabled={!form.isDirty('data') || !dataInputProps.value}
              title="This will replace current app data with the YAML field content. All current app data will be lost."
            >
              Save
            </Button>
            <Button type="button" onClick={handleClear} leftSection={<IconBackspace />}>
              Clear
            </Button>
            <Button type="button" onClick={handleLoad} leftSection={<IconReload />}>
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
