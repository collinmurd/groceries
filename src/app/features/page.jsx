"use client";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { ActionIcon, Switch } from "@mantine/core";
import { FeaturesContext, ToggleFeatureContext } from "../../context/featuresContext";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useContext, useState } from "react";
export default function Page() {
    var features = useContext(FeaturesContext);
    var toggleFeature = useContext(ToggleFeatureContext);
    return (<div>
      <ActionIcon variant="subtle" aria-label="back">
        <Link className="icon-link" href="/">
          <IconArrowLeft />
        </Link>
      </ActionIcon>
      <h2>Features</h2>
      <FeaturesMenu features={features} toggleFeature={toggleFeature}/>
    </div>);
}
function FeaturesMenu(props) {
    var menuItems = props.features.getAllFeatures().map(function (feature) {
        return <FeatureToggle key={feature.name} feature={feature} toggleFeature={props.toggleFeature}/>;
    });
    return (<div>
      {menuItems}
    </div>);
}
function FeatureToggle(props) {
    var _a = __read(useState(props.feature.enabled), 2), enabled = _a[0], setEnabled = _a[1];
    function handleToggle() {
        setEnabled(!enabled);
        props.toggleFeature(props.feature.name);
    }
    return (<Switch label={props.feature.name} checked={enabled} onChange={handleToggle}/>);
}
//# sourceMappingURL=page.jsx.map