import React from "react";
export interface ISectionProps {
    name: string;
    addNewItem: (itemDescription: string, section: string) => void;
    children?: React.ReactNode;
}
export declare function Section(props: ISectionProps): React.JSX.Element;
