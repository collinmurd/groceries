import { Context, createContext } from "react";

export type FeatureSet = {[feature: string]: boolean};
export const FeaturesContext: Context<{[feature: string]: boolean}> = createContext({});
export const SetFeaturesContext: Context<(features: FeatureSet) => void> = createContext((_: FeatureSet) => {console.log("SetFeaturesContext not provided")} );