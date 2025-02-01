import React, { useState } from "react";
import { ActionIcon, Flex, TextInput } from '@mantine/core';
import { IconPlus } from "@tabler/icons-react";
import classes from './Section.module.css';
import { useExitOnEscape } from "../../../hooks";

export interface ISectionProps {
  name: string,
  addNewItem: (itemDescription: string, section: string) => void,
  children?: React.ReactNode
}

export function Section(props: ISectionProps) {
  const [addingItem, setAddingItem] = useState(false);

  function handleAddItemClick() {
    if (!addingItem) {
      setAddingItem(true);
    }
  }

  function addNewItem(itemDescription: string) {
    setAddingItem(false);
    if (itemDescription) {
      props.addNewItem(itemDescription, props.name);
    }
  }

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
        {props.children}
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
