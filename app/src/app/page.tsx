"use client";

import classes from './page.module.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { IFeature } from '@groceries/shared';
import { useState, useEffect } from 'react';
import { FeatureSet, FeaturesContext } from '../context/featuresContext';
import { getFeatures } from '../services/api';
import { List } from './components/List/List';

export default function Page() {
  return (
    <MantineProvider defaultColorScheme="auto" >
      <App />
    </MantineProvider>
  );
}

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

