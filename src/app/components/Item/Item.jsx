var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useState } from "react";
import { updateItem } from '../../../services/api';
import { ActionIcon, Checkbox, Flex, TextInput } from "@mantine/core";
import classes from './Item.module.css';
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useExitOnEscape } from "../../../hooks";
export function Item(props) {
    var _a = __read(useState(props.edit), 2), editing = _a[0], setEditing = _a[1];
    useExitOnEscape(handleEditFinished);
    function handleChecked(event) {
        props.item.checked = event.target.checked;
        updateItem(props.item);
        props.updateItemState(props.item);
    }
    function handleDelete() {
        props.removeItem(props.item);
    }
    function handleEditClicked(event) {
        setEditing(true);
    }
    function handleDescriptionChanged(event) {
        props.item.description = event.target.value;
        props.updateItemState(props.item);
    }
    function handleEditFinished() {
        if (editing) {
            if (!props.item.description) {
                // empty input, delete the item
                handleDelete();
            }
            else {
                props.item.description = props.item.description;
                setEditing(false);
                updateItem(props.item);
            }
        }
    }
    var descriptionContent = <span className={classes.itemDescription}>{props.item.description}</span>;
    var editButtons = (<div>
      <ActionIcon variant="subtle" aria-label={'Edit ' + props.item.description} onClick={handleEditClicked}>
        <IconPencil />
      </ActionIcon>
      <ActionIcon variant="subtle" aria-label={'Delete ' + props.item.description} onClick={handleDelete}>
        <IconTrash />
      </ActionIcon>
    </div>);
    if (editing) {
        descriptionContent = (<TextInput className={classes.itemDescription} value={props.item.description} autoFocus onBlur={handleEditFinished} onChange={handleDescriptionChanged}/>);
        editButtons = (<div>
        <ActionIcon variant="subtle" aria-label={'Delete ' + props.item.description} onClick={handleDelete}>
          <IconTrash />
        </ActionIcon>
      </div>);
    }
    return (<Flex align="center" justify="space-between" className={classes.item}>
      <Flex align="center">
        <Checkbox type="checkbox" checked={props.item.checked} onChange={handleChecked}/>
        {descriptionContent}
      </Flex>
      {editButtons}
    </Flex>);
}
//# sourceMappingURL=Item.jsx.map