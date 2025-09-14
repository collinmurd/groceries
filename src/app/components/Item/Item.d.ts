import { IItem } from "@groceries/shared";
import React from "react";
export interface IItemProps {
    item: IItem;
    edit: boolean;
    removeItem: (item: IItem) => void;
    updateItemState: (item: IItem) => void;
}
export declare function Item(props: IItemProps): React.JSX.Element;
