import { IItem } from "@groceries/shared";
import React from "react";
import { updateItem } from '../../services/api';

export function Item(props: {item: IItem, removeItem: Function}) {
  function handleChecked(event: React.ChangeEvent<HTMLInputElement>) {
    props.item.checked = !props.item.checked;
    updateItem(props.item)
      .catch(_ => props.item.checked = !props.item.checked); // if the call fails, switch back
  }

  function handleDeleteClicked (event: React.MouseEvent<HTMLButtonElement>) {
    props.removeItem(props.item);
  }

  return (
    <div>
      <input
        type="checkbox"
        defaultChecked={props.item.checked}
        onChange={handleChecked} />
      {props.item.description}
      <button aria-label={'Delete ' + props.item.description} onClick={handleDeleteClicked}>[X]</button>
    </div>
  )
}