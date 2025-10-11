"use client";

import '@mantine/core/styles.css';
import { ActionIcon, Group } from '@mantine/core';
import { List } from './components/List/List';
import Link from 'next/link';
import { IconSettings } from '@tabler/icons-react';
import { LogoutButton } from './components/LogoutButton';

export default function Page() {
  return <App />;
}

function App() {
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
        </Group>
      </div>
    </div>
  );
}
