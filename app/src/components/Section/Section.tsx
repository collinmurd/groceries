import { IItem } from "@groceries/shared";
import React, { useState } from "react";
import { Item } from "../Item/Item";
import { ActionIcon, Flex, TextInput } from '@mantine/core';
import { createItem, deleteItem } from "../../services/api";
import { IconPlus } from "@tabler/icons-react";
import classes from './Section.module.css';
import { useExitOnEscape } from "../../hooks";

interface ISectionItem extends IItem {
  edit: boolean
}

export interface ISectionProps {
  name: string,
  items: IItem[]
}

export function Section(props: ISectionProps) {
  const [items, setItems] = useState<ISectionItem[]>(props.items.map(i => ({edit: false, ...i})));
  const [addingItem, setAddingItem] = useState(false);

  function handleAddItemClick() {
    if (!addingItem) {
      setAddingItem(true);
    }
  }

  function addNewItem(itemDescription: string) {
    setAddingItem(false);
    createItem({
      id: null,
      description: itemDescription,
      section: props.name,
      checked: false
    }).then(item => {
      items.push({edit: false, ...item});
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
    <Item key={item.id} item={item} removeItem={removeItem} edit={item.edit}/>
  );

  return (
    <div>
      <Flex align="center">
        <h3>{props.name}</h3>
        <ActionIcon variant="subtle" onClick={handleAddItemClick} className={classes.addButton}>
          <IconPlus />
        </ActionIcon>
      </Flex>
      { addingItem && <NewItemInput addNewItem={addNewItem} /> }
      <div>
        {sectionItems}
      </div>
    </div>
  );
}

function NewItemInput(props: {addNewItem: (name: string) => void}) {
  const [itemDescription, setItemDescription] = useState("");

  useExitOnEscape(() => props.addNewItem(itemDescription));

  return (
    <TextInput
      autoFocus
      value={itemDescription}
      onBlur={() => props.addNewItem(itemDescription)}
      onChange={e => setItemDescription(e.target.value)} />
  );
}
