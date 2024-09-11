import mongoose from "mongoose";


export interface FeatureData {
  name: string,
  enabled: boolean
};

const featureSchema = new mongoose.Schema<FeatureData>({
  name: {type: String, required: true},
  enabled: {type: Boolean, required: true}
});

export const Feature = mongoose.model('Feature', featureSchema);
