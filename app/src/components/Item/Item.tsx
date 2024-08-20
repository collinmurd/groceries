import { IItem } from "@groceries/shared";
import React, { useState } from "react";
import { updateItem } from '../../services/api';
import { ActionIcon, Checkbox, Flex, TextInput } from "@mantine/core";
import classes from './Item.module.css'
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useExitOnEscape } from "../../hooks";

export function Item(props: {item: IItem, removeItem: Function, edit: boolean}) {
  const [itemDescription, setItemDescription] = useState(props.item.description);
  const [checked, setChecked] = useState(props.item.checked);
  const [editing, setEditing] = useState(props.edit);

  useExitOnEscape(handleEditFinished);

  function handleChecked(event: React.ChangeEvent<HTMLInputElement>) {
    updateItem({
      checked: event.target.checked,
      description: itemDescription,
      id: props.item.id,
      section: props.item.section
    });
    setChecked(!checked)
  }

  function handleDeleteClicked(event: React.MouseEvent<HTMLButtonElement>) {
    props.removeItem(props.item);
  }

  function handleEditClicked(event: React.MouseEvent<HTMLButtonElement>) {
    setEditing(true);
  }

  function handleEditFinished() {
    if (editing) {
      props.item.description = itemDescription;
      setEditing(false);
      updateItem(props.item);
    }
  }

  var descriptionContent = <span className={classes.itemDescription}>{itemDescription}</span>;
  var editButtons = (
    <div>
      <ActionIcon variant="subtle" aria-label={'Edit ' + itemDescription} onClick={handleEditClicked}>
        <IconPencil />
      </ActionIcon>
      <ActionIcon variant="subtle" aria-label={'Delete ' + itemDescription} onClick={handleDeleteClicked}>
        <IconTrash />
      </ActionIcon>
    </div>
  );

  if (editing) {
    descriptionContent = (
      <TextInput
        className={classes.itemDescription}
        value={itemDescription} 
        autoFocus
        onBlur={handleEditFinished}
        onChange={e => setItemDescription(e.target.value)} />
    );

    editButtons = (
      <div>
        <ActionIcon variant="subtle" aria-label={'Delete ' + itemDescription} onClick={handleDeleteClicked}>
          <IconTrash />
        </ActionIcon>
      </div>
    );
  }

  return (
    <Flex align="center" justify="space-between" className={classes.item}>
      <Flex align="center">
        <Checkbox
          type="checkbox"
          checked={checked}
          onChange={handleChecked} />
        {descriptionContent}
      </Flex>
      {editButtons}
    </Flex>
  )
}
