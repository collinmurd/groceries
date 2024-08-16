import { IItem } from "@groceries/shared";
import React, { useState } from "react";
import { Item } from "../Item/Item";
import './Section.scss'
import { createItem, deleteItem } from "../../services/api";

interface ISectionItem extends IItem {
  edit: boolean
}

export function Section(props: {name: string, items: IItem[]}) {
  const [items, setItems] = useState<ISectionItem[]>(props.items.map(i => ({edit: false, ...i})));

  function handleAddItemClick(event: React.MouseEvent<HTMLButtonElement>) {
    createItem({
      id: null,
      description: '',
      section: props.name,
      checked: false
    }).then(item => {
      items.push({edit: true, ...item});
      setItems([...items]);
    });
  }

  function removeItem(item: IItem) {
    deleteItem(item)
      .then(_ => {
        setItems(items.filter(i => i.id !== item.id));
      });
  }

  const sectionItems = items.map(item => 
    <li key={item.id}>
      <Item item={item} removeItem={removeItem} edit={item.edit}/>
    </li>
  );

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