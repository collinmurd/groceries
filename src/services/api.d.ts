import { IFeature, IItem, IngredientParserResult } from "@groceries/shared";
export declare class GroceriesApiError extends Error {
    constructor(msg: string);
}
export declare class GroceriesApiAuthError extends GroceriesApiError {
    constructor(msg: string);
}
export declare function getItems(): Promise<IItem[]>;
export declare function createItem(item: IItem): Promise<IItem>;
export declare function updateItem(item: IItem): Promise<IItem>;
export declare function deleteItem(item: IItem): Promise<any>;
export declare function batchDeleteItems(ids: string[]): Promise<any>;
export declare function getFeatures(): Promise<any>;
export declare function updateFeature(feature: IFeature): Promise<any>;
export declare function parseIngredientsWithText(recipeText: string): Promise<IngredientParserResult[]>;
export declare function parseIngredientsWithUrl(recipeUrl: string): Promise<IngredientParserResult[]>;
