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
import { ActionIcon, Flex, TextInput } from '@mantine/core';
import { IconPlus } from "@tabler/icons-react";
import classes from './Section.module.css';
import { useExitOnEscape } from "../../../hooks";
export function Section(props) {
    var _a = __read(useState(false), 2), addingItem = _a[0], setAddingItem = _a[1];
    function handleAddItemClick() {
        if (!addingItem) {
            setAddingItem(true);
        }
    }
    function addNewItem(itemDescription) {
        setAddingItem(false);
        if (itemDescription) {
            props.addNewItem(itemDescription, props.name);
        }
    }
    return (<div>
      <Flex align="center">
        <h3>{props.name}</h3>
        <ActionIcon variant="subtle" onClick={handleAddItemClick} className={classes.addButton}>
          <IconPlus />
        </ActionIcon>
      </Flex>
      {addingItem && <NewItemInput addNewItem={addNewItem}/>}
      <div>
        {props.children}
      </div>
    </div>);
}
function NewItemInput(props) {
    var _a = __read(useState(""), 2), itemDescription = _a[0], setItemDescription = _a[1];
    useExitOnEscape(function () { return props.addNewItem(itemDescription); });
    return (<TextInput autoFocus value={itemDescription} onBlur={function () { return props.addNewItem(itemDescription); }} onChange={function (e) { return setItemDescription(e.target.value); }}/>);
}
//# sourceMappingURL=Section.jsx.map