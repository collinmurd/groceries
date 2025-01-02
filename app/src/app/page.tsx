"use client";

import '@mantine/core/styles.css';
import { ActionIcon } from '@mantine/core';
import { List } from './components/List/List';
import Link from 'next/link';
import { IconSettings } from '@tabler/icons-react';

export default function Page() {
  return <App />;
}

export function App() {
  return (
    <div>
      <List />
      <div>
        <ActionIcon variant="subtle" aria-label="features">
          <Link href="/features">
            <IconSettings />
          </Link>
        </ActionIcon>
      </div>
    </div>
  );
}
