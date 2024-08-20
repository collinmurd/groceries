import { IItem } from "@groceries/shared";
import React, { useEffect, useState } from "react";
import { Item } from "../Item/Item";
import { ActionIcon, Flex, TextInput } from '@mantine/core';
import { createItem, deleteItem } from "../../services/api";
import { IconPlus } from "@tabler/icons-react";

import classes from './Section.module.css';

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
    <Item key={item.id} item={item} removeItem={removeItem} edit={item.edit}/>
  );

  if (!editing) {
    return (
      <div>
        <Flex align="center">
          <h3>{sectionName}</h3>
          <ActionIcon variant="subtle" onClick={handleAddItemClick} className={classes.addButton}>
            <IconPlus />
          </ActionIcon>
        </Flex>
        <div>
          {sectionItems}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <TextInput
          placeholder="New Section"
          autoFocus
          onChange={e => setSectionName(e.target.value)}
          onBlur={_ => handleEditFinished()} />
      </div>
    );
  }
}