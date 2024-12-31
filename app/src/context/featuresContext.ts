import { Context, createContext } from "react";

export type FeatureSet = {[feature: string]: boolean};
export const FeaturesContext: Context<{[feature: string]: boolean}> = createContext({});