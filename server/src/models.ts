import mongoose from "mongoose"
import { IItem } from '@groceries/shared'

export interface IItemDao {
    description: string,
    checked: boolean,
    section?: string
};

interface IItemMethods {
    dto(): IItem & {id: string | null}
};

type ItemModel = mongoose.Model<IItemDao, {}, IItemMethods>;

const itemSchema = new mongoose.Schema<IItemDao, ItemModel, IItemMethods>({
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

export const Item = mongoose.model<IItemDao, ItemModel>('Item', itemSchema);