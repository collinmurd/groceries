import { Menu, ActionIcon } from "@mantine/core";
import { FeatureSet } from "../../context/featuresContext";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <ActionIcon variant="subtle" aria-label="back">
        <Link href="/">
          <IconArrowLeft />
        </Link>
      </ActionIcon>
      <h2>Features</h2>
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
    <h2>Features</h2>
  );
}