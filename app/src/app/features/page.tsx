"use client";

import { ActionIcon, Switch } from "@mantine/core";
import { FeaturesContext, FeatureSet, ToggleFeatureContext } from "../../context/featuresContext";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { IFeature } from "@groceries/shared";

export default function Page() {
  const features = useContext(FeaturesContext);
  const toggleFeature = useContext(ToggleFeatureContext);

  return (
    <div>
      <ActionIcon variant="subtle" aria-label="back">
        <Link className="icon-link" href="/">
          <IconArrowLeft />
        </Link>
      </ActionIcon>
      <h2>Features</h2>
      <FeaturesMenu features={features} toggleFeature={toggleFeature} />
    </div>
  )
}

function FeaturesMenu(props: {features: FeatureSet, toggleFeature: (feature: string) => void}) {

  const menuItems = props.features.getAllFeatures().map(feature => {
    return <FeatureToggle
      key={feature.name}
      feature={feature}
      toggleFeature={props.toggleFeature} />
  });

  return (
    <div>
      {menuItems}
    </div>
  );
}

function FeatureToggle(props: {feature: IFeature, toggleFeature: (name: string) => void}) {
  const [enabled, setEnabled] = useState(props.feature.enabled);

  function handleToggle() {
    setEnabled(!enabled);
    props.toggleFeature(props.feature.name);
  }

  return (
    <Switch
      label={props.feature.name}
      checked={enabled}
      onChange={handleToggle} />
  );
}