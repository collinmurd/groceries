"use client";

import '@mantine/core/styles.css';
import { IFeature } from "@groceries/shared";
import { MantineProvider, Center, Loader } from "@mantine/core";
import { useState, useEffect } from "react";
import { FeaturesContext, FeatureSet, ToggleFeatureContext } from "../../context/featuresContext";
import { AuthProvider, useAuth } from "../../context/authContext";
import { getFeatures, updateFeature, GroceriesApiAuthError } from "../../services/api";
import ErrorHandler from "./ErrorHandler";
import { SetErrorContext } from "../../context/errorContext";
import { LockScreen } from "./LockScreen";

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GlobalProvidersInner>{children}</GlobalProvidersInner>
    </AuthProvider>
  );
}

function GlobalProvidersInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [error, setError] = useState<string | null>(null);

  let featureSet = new FeatureSet(features);

  function toggleFeature(name: string) {
    const feature = features.find(f => f.name === name);
    if (feature) {
      feature.enabled = !feature.enabled;
      updateFeature(feature)
        .then(_ => setFeatures([...features]))
        .catch(e => {
          if (e instanceof GroceriesApiAuthError) {
            // Auth errors are handled by showing lock screen
            return;
          }
          console.log(`Failed to update feature: ${e}`);
        });
    }
  }

  const loadFeatures = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await getFeatures();
      setFeatures(data);
      setError(null); // Clear any previous errors on success
    } catch (e) {
      if (e instanceof GroceriesApiAuthError) {
        // Auth errors are handled by showing lock screen
        return;
      }
      // For other errors (like CORS/network), show a more user-friendly message
      console.error('Failed to load features:', e);
      setError("Unable to connect to server. Please make sure the server is running and try refreshing the page.");
    }
  };

  // retrieve features and make them globally available to the app
  useEffect(() => {
    loadFeatures();
  }, [isAuthenticated]);

  return (
    <MantineProvider defaultColorScheme="auto" >
      {authLoading ? (
        <Center style={{ minHeight: '100vh' }}>
          <Loader size="lg" />
        </Center>
      ) : !isAuthenticated ? (
        <LockScreen />
      ) : (
        <ErrorHandler error={error}>
          <SetErrorContext.Provider value={setError}>
            <FeaturesContext.Provider value={featureSet}>
              <ToggleFeatureContext.Provider value={toggleFeature}>
                <div id="root">{children}</div>
              </ToggleFeatureContext.Provider>
            </FeaturesContext.Provider>
          </SetErrorContext.Provider>
        </ErrorHandler>
      )}
    </MantineProvider>
  );
}