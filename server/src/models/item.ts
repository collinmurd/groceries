import mongoose from "mongoose"
import { IItem } from '@groceries/shared'

export interface ItemData {
  description: string,
  checked: boolean,
  section: string
};

interface ItemMethods {
  dto(): IItem & {id: string | null}
};

type ItemModel = mongoose.Model<ItemData, {}, ItemMethods>;

const itemSchema = new mongoose.Schema<ItemData, ItemModel, ItemMethods>({
  description: {type: String, required: true},
  section: String,
  checked: Boolean
});

itemSchema.methods.dto = function dto(): IItem {
  return {
    id: this._id.toString(),
    description: this.description,
    section: this.section,
    checked: this.checked
  }
}

export const Item = mongoose.model<ItemData, ItemModel>('Item', itemSchema);