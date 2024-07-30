import mongoose from "mongoose"

export interface IItem {
    description: string,
    section?: string,
    checked?: boolean
};

interface IItemMethods {
    dto(): IItem & {id: string}
};

type ItemModel = mongoose.Model<IItem, {}, IItemMethods>;

const itemSchema = new mongoose.Schema<IItem, ItemModel, IItemMethods>({
    description: {type: String, required: true},
    section: String,
    checked: Boolean
});

itemSchema.methods.dto = function dto() {
    return {
        id: this._id.toString(),
        description: this.description,
        section: this.section,
        checked: this.checked
    }
}

export const Item = mongoose.model<IItem, ItemModel>('Item', itemSchema);