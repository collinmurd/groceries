import { IItem } from "@groceries/shared";
import React, { useState } from "react";
import { Item } from "../Item/Item";
import { ActionIcon, Flex } from '@mantine/core';
import { createItem, deleteItem } from "../../services/api";
import { IconPlus } from "@tabler/icons-react";
import classes from './Section.module.css';

interface ISectionItem extends IItem {
  edit: boolean
}

export interface ISectionProps {
  name: string,
  items: IItem[]
}

export function Section(props: ISectionProps) {
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
      <div>
        {sectionItems}
      </div>
    </div>
  );
}