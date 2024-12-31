import { Menu, ActionIcon } from "@mantine/core";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { FeatureSet } from "../../context/featuresContext";

export default function Page() {
  return (
    <div>
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