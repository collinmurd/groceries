"use client";

import { ActionIcon, Switch } from "@mantine/core";
import { FeaturesContext, FeatureSet, SetFeaturesContext } from "../../context/featuresContext";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useContext, useState } from "react";

export default function Page() {
  const features = useContext(FeaturesContext);
  const setFeatures = useContext(SetFeaturesContext);

  return (
    <div>
      <ActionIcon variant="subtle" aria-label="back">
        <Link href="/">
          <IconArrowLeft />
        </Link>
      </ActionIcon>
      <h2>Features</h2>
      <FeaturesMenu features={features} setFeatures={setFeatures} />
    </div>
  )
}

function FeaturesMenu(props: {features: FeatureSet, setFeatures: (features: FeatureSet) => void}) {

  const menuItems = Object.keys(props.features).map((featureName) => {
    const toggleFeature = (name: string) => {
      const newFeatures = {...props.features};
      newFeatures[name] = !newFeatures[name];
      props.setFeatures(newFeatures);
    }

    return <FeatureToggle key={featureName} name={featureName} enabled={props.features[featureName]} toggleFeature={toggleFeature} />
  });

  return (
    <div>
      {menuItems}
    </div>
  );
}

function FeatureToggle(props: {name: string, enabled: boolean, toggleFeature: (name: string) => void}) {
  const [enabled, setEnabled] = useState(props.enabled);

  function handleToggle() {
    setEnabled(!enabled);
    props.toggleFeature(props.name);
  }

  return (
    <Switch
      label={props.name}
      checked={props.enabled}
      onChange={handleToggle} />
  );
}