import { IItem } from "@groceries/shared";
import React, { useEffect, useState } from "react";
import { Item } from "../Item/Item";
import { createItem, deleteItem } from "../../services/api";

interface ISectionItem extends IItem {
  edit: boolean
}

export interface ISectionProps {
  name: string,
  items: IItem[],
  edit: boolean
}

export function Section(props: ISectionProps) {
  const [items, setItems] = useState<ISectionItem[]>(props.items.map(i => ({edit: false, ...i})));
  const [editing, setEditing] = useState(props.edit);
  const [sectionName, setSectionName] = useState(props.name);

  useEffect(() => {
    const handleEscape = (e: any) => {
      if (editing && (e.key === "Escape" || e.key === "Enter")) {
        handleEditFinished();
      };
    }
    window.addEventListener('keydown', handleEscape);

    return () => {window.removeEventListener('keydown', handleEscape)}
  });


  function handleAddItemClick(event: React.MouseEvent<HTMLButtonElement>) {
    createItem({
      id: null,
      description: '',
      section: sectionName,
      checked: false
    }).then(item => {
      items.push({edit: true, ...item});
      setItems([...items]);
    });
  }

  function handleEditFinished() {
    setEditing(false);
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

  if (!editing) {
    return (
      <div>
        <div className="sectionHeader">
          <h3>{sectionName}</h3>
          <button onClick={handleAddItemClick}>Add Item</button>
        </div>
        <ul>
          {sectionItems}
        </ul>
      </div>
    );
  } else {
    return (
      <div>
        <input
          autoFocus
          onChange={e => setSectionName(e.target.value)}
          onBlur={_ => handleEditFinished()}
          type="text" />
      </div>
    );
  }
}