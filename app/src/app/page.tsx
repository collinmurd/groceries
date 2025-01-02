"use client";

import classes from './page.module.css';
import '@mantine/core/styles.css';
import { ActionIcon, MantineProvider } from '@mantine/core';
import { IFeature } from '@groceries/shared';
import { useState, useEffect } from 'react';
import { FeatureSet, FeaturesContext } from '../context/featuresContext';
import { getFeatures } from '../services/api';
import { List } from './components/List/List';
import Link from 'next/link';
import { IconSettings } from '@tabler/icons-react';

export default function Page() {
  return <App />;
}

export function App() {
  return (
    <div className={classes.app}>
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
