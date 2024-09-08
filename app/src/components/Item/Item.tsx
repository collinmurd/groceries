import { IItem } from "@groceries/shared";
import React, { useState } from "react";
import { updateItem } from '../../services/api';
import { ActionIcon, Checkbox, Flex, TextInput } from "@mantine/core";
import classes from './Item.module.css'
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useExitOnEscape } from "../../hooks";

export interface IItemProps {
  item: IItem,
  edit: boolean,
  removeItem: (item: IItem) => void,
  updateItemState: (item: IItem) => void
}

export function Item(props: IItemProps) {
  const [editing, setEditing] = useState(props.edit);

  useExitOnEscape(handleEditFinished);

  function handleChecked(event: React.ChangeEvent<HTMLInputElement>) {
    props.item.checked = event.target.checked;
    updateItem(props.item);
    props.updateItemState(props.item);
  }

  function handleDelete() {
    props.removeItem(props.item);
  }

  function handleEditClicked(event: React.MouseEvent<HTMLButtonElement>) {
    setEditing(true);
  }

  function handleDescriptionChanged(event: React.ChangeEvent<HTMLInputElement>) {
    props.item.description = event.target.value;
    props.updateItemState(props.item);
  }

  function handleEditFinished() {
    if (editing) {
      if (!props.item.description) {
        // empty input, delete the item
        handleDelete();
      } else {
        props.item.description = props.item.description;
        setEditing(false);
        console.log('here?')
        console.log(props.item.id)
        updateItem(props.item);
      }
    }
  }

  var descriptionContent = <span className={classes.itemDescription}>{props.item.description}</span>;
  var editButtons = (
    <div>
      <ActionIcon variant="subtle" aria-label={'Edit ' + props.item.description} onClick={handleEditClicked}>
        <IconPencil />
      </ActionIcon>
      <ActionIcon variant="subtle" aria-label={'Delete ' + props.item.description} onClick={handleDelete}>
        <IconTrash />
      </ActionIcon>
    </div>
  );

  if (editing) {
    descriptionContent = (
      <TextInput
        className={classes.itemDescription}
        value={props.item.description} 
        autoFocus
        onBlur={handleEditFinished}
        onChange={handleDescriptionChanged} />
    );

    editButtons = (
      <div>
        <ActionIcon variant="subtle" aria-label={'Delete ' + props.item.description} onClick={handleDelete}>
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
          checked={props.item.checked}
          onChange={handleChecked} />
        {descriptionContent}
      </Flex>
      {editButtons}
    </Flex>
  )
}
