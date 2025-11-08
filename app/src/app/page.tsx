"use client";

import '@mantine/core/styles.css';
import { ActionIcon, Drawer, Group } from '@mantine/core';
import { List } from './components/List/List';
import Link from 'next/link';
import { IconAi, IconSettings } from '@tabler/icons-react';
import { LogoutButton } from './components/LogoutButton';
import { IngredientParser } from './components/IngredientParser';
import { useDisclosure } from '@mantine/hooks';

export default function Page() {
  return <App />;
}

function App() {
  const [drawerOpened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <List />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
        <Group gap="md">
          <ActionIcon variant="subtle" size="xl" aria-label="features">
            <Link className="icon-link" href="/features">
              <IconSettings />
            </Link>
          </ActionIcon>
          <LogoutButton />
          <ActionIcon variant="subtle" size="xl" aria-label="ai">
            <IconAi onClick={open} />
          </ActionIcon>
        </Group>
      </div>
      <Drawer opened={drawerOpened} onClose={close} padding="xl" size="xl">
        <IngredientParser />
      </Drawer>
    </div>
  );
}
