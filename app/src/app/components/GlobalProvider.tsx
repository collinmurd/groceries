"use client";

import { IFeature } from "@groceries/shared";
import { MantineProvider } from "@mantine/core";
import { useState, useEffect } from "react";
import { FeaturesContext, FeatureSet, ToggleFeatureContext } from "../../context/featuresContext";
import { getFeatures, updateFeature } from "../../services/api";
import ErrorHandler from "./ErrorHandler";
import { SetErrorContext } from "../../context/errorContext";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [error, setError] = useState<string | null>(null); // central error state

  let featureSet = new FeatureSet(features);

  function toggleFeature(name: string) {
    const feature = features.find(f => f.name === name);
    if (feature) {
      feature.enabled = !feature.enabled;
      updateFeature(feature)
        .then(_ => setFeatures([...features]))
        .catch(e => console.log(`Failed to update feature: ${e}`));
    }
  }

  // retrieve features and make them globally available to the app
  useEffect(() => {
    getFeatures()
      .then(data => {
        setFeatures(data);
      })
      .catch(_ => setError("Failed to get features... try again later"));
  }, []);

  return (
    <MantineProvider defaultColorScheme="auto" >
      <ErrorHandler error={error}>
        <SetErrorContext.Provider value={setError}>
          <FeaturesContext.Provider value={featureSet}>
            <ToggleFeatureContext.Provider value={toggleFeature}>
              <div id="root">{children}</div>
            </ToggleFeatureContext.Provider>
          </FeaturesContext.Provider>
        </SetErrorContext.Provider>
      </ErrorHandler>
    </MantineProvider>
  );
}