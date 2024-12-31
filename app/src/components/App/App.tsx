"use client";

import React, { useEffect, useState } from 'react';
import { List } from '../List/List';

import classes from './App.module.css';
import { ActionIcon, Menu } from '@mantine/core';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { FeaturesContext, FeatureSet } from '../../context/featuresContext';
import { getFeatures } from '../../services/api';
import { IFeature } from '@groceries/shared';

export function App() {
  const [error, setError] = useState<string>("");
  const [features, setFeatures] = useState<FeatureSet>({});

  useEffect(() => {
    getFeatures()
      .then(data => {
        // turn array of features into a map
        setFeatures(data.reduce((acc: FeatureSet, f: IFeature) => {
          acc[f.name] = f.enabled;
          return acc;
        }, {}));
      })
      .catch(_ => setError("Failed to get features... try again later"));
  }, []);

  if (error) {
    return (
      <div className={classes.app}>
        <ErrorPage message={error} />
      </div>
    )
  }

  return (
    <div className={classes.app}>
      <FeaturesContext.Provider value={features}>
        <List setError={(error: string) => setError(error)}/>
      </FeaturesContext.Provider>
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
