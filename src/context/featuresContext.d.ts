import { IFeature } from "@groceries/shared";
import { Context } from "react";
export declare class FeatureSet {
    private features;
    constructor(features: IFeature[]);
    getAllFeatures(): IFeature[];
    check(name: string): boolean;
}
export declare const FeaturesContext: Context<FeatureSet>;
export declare const ToggleFeatureContext: Context<(feature: string) => void>;
