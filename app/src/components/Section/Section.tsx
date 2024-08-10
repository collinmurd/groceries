import { IItem } from "@groceries/shared";
import React from "react";
import { Item } from "../Item/Item";

export function Section(props: {name: string, items: IItem[], removeItem: Function}) {
  const listItems = props.items.map(item => 
    <li key={item.id}>
      <Item item={item} removeItem={props.removeItem}/>
    </li>
  );

  return (
    <div>
      <h3>{props.name}</h3>
      <ul>
        {listItems}
      </ul>
    </div>
  )
}