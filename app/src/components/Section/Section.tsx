import { IItem } from "@groceries/shared";
import React from "react";
import { Item } from "../Item/Item";
import './Section.scss'

export function Section(props: {name: string, items: IItem[], removeItem: Function}) {
  const listItems = props.items.map(item => 
    <li key={item.id}>
      <Item item={item} removeItem={props.removeItem} edit={false}/>
    </li>
  );

  function handleAddItemClick(event: React.MouseEvent<HTMLButtonElement>) {

  }

  return (
    <div>
      <div className="sectionHeader">
        <h3>{props.name}</h3>
        <button onClick={handleAddItemClick}>Add Item</button>
      </div>
      <ul>
        {listItems}
      </ul>
    </div>
  )
}