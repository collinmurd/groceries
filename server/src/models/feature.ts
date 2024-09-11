import { IFeature } from "@groceries/shared";
import mongoose from "mongoose";

export interface FeatureData {
  name: string,
  enabled: boolean
};

interface FeatureMethods {
  dto(): IFeature & {id: string | null}
}

type FeatureModel = mongoose.Model<FeatureData, {}, FeatureMethods>;

const featureSchema = new mongoose.Schema<FeatureData, FeatureModel, FeatureMethods>({
  name: {type: String, required: true},
  enabled: {type: Boolean, required: true}
});

featureSchema.methods.dto = function dto(): IFeature {
  return {
    id: this._id.toString(),
    name: this.name,
    enabled: this.enabled
  }
}

export const Feature = mongoose.model<FeatureData, FeatureModel>('Feature', featureSchema);
