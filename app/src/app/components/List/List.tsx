import React, { useContext, useEffect, useState } from 'react';
import { batchDeleteItems, createItem, deleteItem, getItems } from '../../../services/api';
import { Section } from '../Section/Section';
import { Button, Loader, Menu, TextInput } from '@mantine/core';
import { useExitOnEscape } from '../../../hooks';
import { IItem } from '@groceries/shared';

import classes from './List.module.css';
import { Item } from '../Item/Item';
import { FeaturesContext } from '../../../context/featuresContext';
import { SetErrorContext } from '../../../context/errorContext';

const defaultSections = ['Produce', 'Meat', 'Dairy', 'Frozen', 'Shelved', 'Other'];

export function List() {
  const [items, setItems] = useState<IItem[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [addingSection, setAddingSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const features = useContext(FeaturesContext);
  const setError = useContext(SetErrorContext);

  useEffect(() => {
    getItems()
      .then(data => {
        setItems(data);

        var tempSections = new Set<string>();
        data.forEach(i => tempSections.add(i.section));
        if (features.check('default-sections')) {
          defaultSections.forEach(s => tempSections.add(s));
        }
        setSections([...tempSections]);

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to get grocery list... try paper");
      })
  }, [features]);

  function addNewSection(name: string) {
    setAddingSection(false);
    if (!sections.includes(name)) {
      sections.unshift(name);
      setSections([...sections]);
    }
  }

  function handleNewSectionClicked() {
    if (!addingSection) {
      setAddingSection(true);
    }
  }

  function addNewItem(itemDescription: string, section: string) {
    createItem({
      id: null,
      description: itemDescription,
      section: section,
      checked: false
    }).then(item => {
      items.push(item);
      setItems([...items]);
    });
  }

  function updateItem(item: IItem) {
    var itemToUpdate = items.find(i => i.id === item.id);
    if (itemToUpdate) {
      itemToUpdate = { ...item }
    }

    setItems([...items]);
  }

  function removeItem(item: IItem) {
    deleteItem(item)
      .then(_ => {
        setItems(items.filter(i => i.id !== item.id));
      });
  }

  function clearAllItems() {
    batchDeleteItems(items
      .filter(i => i.id)
      .map(i => i.id!))
      .then(() => {
        setItems([]);
      });
  }

  function clearCheckedItems() {
    batchDeleteItems(items
      .filter(i => i.checked)
      .map(i => i.id!))
      .then(() => {
        setItems([...items.filter(i => !i.checked)]);
      });
  }

  // create section components
  const displayedSections = sections.map(section =>
    <Section
      key={section}
      name={section}
      addNewItem={addNewItem}>
      {items
        .filter(i => i.section === section)
        .map(i => <Item key={i.id} item={i} removeItem={removeItem} updateItemState={updateItem} edit={false} />)}
    </Section>
  );

  if (loading) {
    return (
      <div>
        <Loader type='dots' className={classes.loader} />
      </div>
    );
  } else {
    return (
      <div>
        <div className={classes.headerButtons}>
          <Button onClick={handleNewSectionClicked}>Add Section</Button>
          <ClearItems clearAllItems={clearAllItems} clearCheckedItems={clearCheckedItems} />
        </div>
        {addingSection && <NewSectionInput addNewSection={addNewSection} />}
        {displayedSections}
      </div>
    );
  }
}

function NewSectionInput(props: { addNewSection: (name: string) => void }) {
  const [sectionName, setSectionName] = useState("");

  useExitOnEscape(() => props.addNewSection(sectionName));

  return (
    <TextInput
      autoFocus
      value={sectionName}
      onBlur={() => props.addNewSection(sectionName)}
      onChange={e => setSectionName(e.target.value)} />
  );
}

interface IClearItemsProps {
  clearAllItems: () => void,
  clearCheckedItems: () => void
}

function ClearItems(props: IClearItemsProps) {
  return (
    <Menu shadow='md' width={200}>
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
    </Menu>
  );
}
