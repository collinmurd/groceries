"use client";

import React, { useState } from 'react';
import { List } from '../List/List';

import classes from './App.module.css';
import { ActionIcon, Button, Menu } from '@mantine/core';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';

type FeatureSet = {[feature: string]: boolean};

export function App() {
  const [error, setError] = useState<string>("");
  const [features, setFeatures] = useState<FeatureSet>({});

  if (error) {
    return (
      <div className={classes.app}>
        <ErrorPage message={error} />
      </div>
    )
  }

  return (
    <div className={classes.app}>
      <List setError={(error: string) => setError(error)}/>
    </div>
  );
}

function ErrorPage(props: {message: string}) {
  return (
    <div>
      <h2>{props.message}</h2>
    </div>
  )
}

function FeaturesMenu(props: {features: FeatureSet, setFeatures: (features: FeatureSet) => void}) {

  const featureOptions = Object.entries(props.features).map(f => {
    const feature = f[0]
    const enabled = f[1]

    return (
      <Menu.Item>
      </Menu.Item>
    )
  });

  return (
    <Menu shadow='md' width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label="features menu">
          <IconAdjustmentsHorizontal />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {featureOptions}
      </Menu.Dropdown>
    </Menu>
  );
}
