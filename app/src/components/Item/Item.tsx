import { IItem } from "@groceries/shared";
import React, { useEffect, useState } from "react";
import { updateItem } from '../../services/api';
import { Checkbox } from "@mantine/core";

export function Item(props: {item: IItem, removeItem: Function, edit: boolean}) {
  const [itemDescription, setItemDescription] = useState(props.item.description);
  const [checked, setChecked] = useState(props.item.checked);
  const [editing, setEditing] = useState(props.edit);

  useEffect(() => {
    const handleEscape = (e: any) => {
      if (editing && (e.key === "Escape" || e.key === "Enter")) {
        handleEditFinished();
      };
    }
    window.addEventListener('keydown', handleEscape);

    return () => {window.removeEventListener('keydown', handleEscape)}
  });

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
    props.item.description = itemDescription;
    setEditing(false);
    updateItem(props.item);
  }

  if (!editing) {
    return (
      <div className="Item">
        <Checkbox
          type="checkbox"
          checked={checked}
          onChange={handleChecked} />
        {props.item.description}
        <button aria-label={'Edit ' + props.item.description} onClick={handleEditClicked}>Edit</button>
        <button aria-label={'Delete ' + props.item.description} onClick={handleDeleteClicked}>[X]</button>
      </div>
    )
  } else {
    return (
      <div className="Item">
        <input
          type="checkbox"
          defaultChecked={props.item.checked}
          onChange={handleChecked} />
        <input
          type="text"
          value={itemDescription} 
          autoFocus
          onBlur={handleEditFinished}
          onChange={e => setItemDescription(e.target.value)} />
        <button aria-label={'Delete ' + props.item.description} onClick={handleDeleteClicked}>[X]</button>
      </div>
    )
  }
}