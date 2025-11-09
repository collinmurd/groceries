var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useContext, useEffect, useState } from 'react';
import { batchDeleteItems, createItem, deleteItem, getItems } from '../../../services/api';
import { Section } from '../Section/Section';
import { Button, Loader, Menu, TextInput } from '@mantine/core';
import { useExitOnEscape } from '../../../hooks';
import { DEFAULT_SECTIONS } from '@groceries/shared/constants';
import classes from './List.module.css';
import { Item } from '../Item/Item';
import { FeaturesContext } from '../../../context/featuresContext';
import { SetErrorContext } from '../../../context/errorContext';
export function List() {
    var _a = __read(useState([]), 2), items = _a[0], setItems = _a[1];
    var _b = __read(useState([]), 2), sections = _b[0], setSections = _b[1];
    var _c = __read(useState(false), 2), addingSection = _c[0], setAddingSection = _c[1];
    var _d = __read(useState(true), 2), loading = _d[0], setLoading = _d[1];
    var features = useContext(FeaturesContext);
    var setError = useContext(SetErrorContext);
    useEffect(function () {
        getItems()
            .then(function (data) {
            setItems(data);
            var tempSections = new Set();
            data.forEach(function (i) { return tempSections.add(i.section); });
            if (features.check('default-sections')) {
                DEFAULT_SECTIONS.forEach(function (s) { return tempSections.add(s); });
            }
            setSections(__spreadArray([], __read(tempSections), false));
            setLoading(false);
        })
            .catch(function (err) {
            console.log(err);
            setError("Failed to get grocery list... try paper");
        });
    }, [features]);
    function addNewSection(name) {
        setAddingSection(false);
        if (!sections.includes(name)) {
            sections.unshift(name);
            setSections(__spreadArray([], __read(sections), false));
        }
    }
    function handleNewSectionClicked() {
        if (!addingSection) {
            setAddingSection(true);
        }
    }
    function addNewItem(itemDescription, section) {
        createItem({
            id: null,
            description: itemDescription,
            section: section,
            checked: false
        }).then(function (item) {
            items.push(item);
            setItems(__spreadArray([], __read(items), false));
        });
    }
    function updateItem(item) {
        var itemToUpdate = items.find(function (i) { return i.id === item.id; });
        if (itemToUpdate) {
            itemToUpdate = __assign({}, item);
        }
        setItems(__spreadArray([], __read(items), false));
    }
    function removeItem(item) {
        deleteItem(item)
            .then(function (_) {
            setItems(items.filter(function (i) { return i.id !== item.id; }));
        });
    }
    function clearAllItems() {
        batchDeleteItems(items
            .filter(function (i) { return i.id; })
            .map(function (i) { return i.id; }))
            .then(function () {
            setItems([]);
        });
    }
    function clearCheckedItems() {
        batchDeleteItems(items
            .filter(function (i) { return i.checked; })
            .map(function (i) { return i.id; }))
            .then(function () {
            setItems(__spreadArray([], __read(items.filter(function (i) { return !i.checked; })), false));
        });
    }
    // create section components
    var displayedSections = sections.map(function (section) {
        return <Section key={section} name={section} addNewItem={addNewItem}>
      {items
                .filter(function (i) { return i.section === section; })
                .map(function (i) { return <Item key={i.id} item={i} removeItem={removeItem} updateItemState={updateItem} edit={false}/>; })}
    </Section>;
    });
    if (loading) {
        return (<div>
        <Loader type='dots' className={classes.loader}/>
      </div>);
    }
    else {
        return (<div>
        <div className={classes.headerButtons}>
          <Button onClick={handleNewSectionClicked}>Add Section</Button>
          <ClearItems clearAllItems={clearAllItems} clearCheckedItems={clearCheckedItems}/>
        </div>
        {addingSection && <NewSectionInput addNewSection={addNewSection}/>}
        {displayedSections}
      </div>);
    }
}
function NewSectionInput(props) {
    var _a = __read(useState(""), 2), sectionName = _a[0], setSectionName = _a[1];
    useExitOnEscape(function () { return props.addNewSection(sectionName); });
    return (<TextInput autoFocus value={sectionName} onBlur={function () { return props.addNewSection(sectionName); }} onChange={function (e) { return setSectionName(e.target.value); }}/>);
}
function ClearItems(props) {
    return (<Menu shadow='md' width={200}>
      <Menu.Target>
        <Button>Clear</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={props.clearAllItems}>
          Clear All
        </Menu.Item>
        <Menu.Item onClick={props.clearCheckedItems}>
          Clear Checked
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>);
}
//# sourceMappingURL=List.jsx.map