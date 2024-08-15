import { IItem } from "@groceries/shared";
import React, { useState } from "react";
import { Item } from "../Item/Item";
import './Section.scss'
import { createItem } from "../../services/api";

interface ISectionItem extends IItem {
  edit: boolean
}

export function Section(props: {name: string, items: IItem[], removeItem: Function}) {
  const [items, updateItems] = useState<ISectionItem[]>(props.items.map(i => ({edit: false, ...i})));

  const sectionItems = items.map(item => 
    <li key={item.id}>
      <Item item={item} removeItem={props.removeItem} edit={item.edit}/>
    </li>
  );

  function handleAddItemClick(event: React.MouseEvent<HTMLButtonElement>) {
    createItem({
      id: null,
      description: '',
      section: props.name,
      checked: false
    }).then(item => {
      items.push({edit: true, ...item});
      updateItems([...items]);
    });
  }

  return (
    <div>
      <div className="sectionHeader">
        <h3>{props.name}</h3>
        <button onClick={handleAddItemClick}>Add Item</button>
      </div>
      <ul>
        {sectionItems}
      </ul>
    </div>
  )
}