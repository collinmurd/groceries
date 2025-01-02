"use client";

import { IFeature } from "@groceries/shared";
import { MantineProvider } from "@mantine/core";
import { useState, useEffect } from "react";
import { FeaturesContext, FeatureSet, SetFeaturesContext } from "../../context/featuresContext";
import { getFeatures } from "../../services/api";
import ErrorHandler from "./ErrorHandler";
import { SetErrorContext } from "../../context/errorContext";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [features, setFeatures] = useState<FeatureSet>({});
  const [error, setError] = useState<string | null>(null); // central error state

  // retrieve features and make them globally available to the app
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

  return (
    <MantineProvider defaultColorScheme="auto" >
      <ErrorHandler error={error}>
        <SetErrorContext.Provider value={setError}>
          <FeaturesContext.Provider value={features}>
            <SetFeaturesContext.Provider value={setFeatures}>
              <div id="root">{children}</div>
            </SetFeaturesContext.Provider>
          </FeaturesContext.Provider>
        </SetErrorContext.Provider>
      </ErrorHandler>
    </MantineProvider>
  );
}