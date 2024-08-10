import { IItem } from "@groceries/shared";
import React from "react";
import { Item } from "../Item/Item";

export function Section(props: {name: string, items: IItem[]}) {
  function removeItem(item: IItem) {
    props.items.splice(props.items.indexOf(item), 1);
  }
  const listItems = props.items.map(item => 
    <li key={item.id}>
      <Item item={item} removeItem={removeItem}/>
    </li>
  )
  return (
    <div>
      <h3>{props.name}</h3>
      <ul>
        {listItems}
      </ul>
    </div>
  )
}