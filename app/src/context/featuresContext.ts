import { IFeature } from "@groceries/shared";
import { Context, createContext } from "react";

export class FeatureSet {
  private features: IFeature[] = [];

  constructor(features: IFeature[]) {
    this.features = features;
  }

  getAllFeatures(): IFeature[] {
    return this.features;
  }

  check(name: string): boolean {
    const feature = this.features.find(f => f.name === name);
    return feature ? feature.enabled : false;
  }
}

export const FeaturesContext: Context<FeatureSet> = createContext(new FeatureSet([]));
export const ToggleFeatureContext: Context<(feature: string) => void> = createContext((_: string) => {console.log("ToggleFeatureContext not provided")} );