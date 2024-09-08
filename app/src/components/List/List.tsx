import React, { useEffect, useState } from 'react';
import { getItems } from '../../services/api';
import { ISectionProps, Section } from '../Section/Section';
import { Button, Loader, Menu, TextInput } from '@mantine/core';
import { useExitOnEscape } from '../../hooks';

import classes from './List.module.css';

export function List(props: {setError: Function}) {
  const [sections, setSections] = useState<ISectionProps[]>([]);
  const [addingSection, setAddingSection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems()
      .then(data => {
        // split items into sections
        const initialSections: {[key: string]: ISectionProps} = {}
        data.forEach(item => {
          if (Object.keys(initialSections).includes(item.section)) {
            initialSections[item.section].items.push(item);
          } else {
            initialSections[item.section] = {
              name: item.section,
              items: [item],
            };
          }
        });

        setSections(Object.values(initialSections));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        props.setError("Failed to get grocery list... try paper");
      })
  }, []);

  function addNewSection(name: string) {
    setAddingSection(false);
    if (!sections.some(s => s.name === name)) {
      sections.unshift({
        name: name,
        items: []
      });
      setSections([...sections]);
    }
  }

  function handleNewSectionClicked() {
    if (!addingSection) {
      setAddingSection(true);
    }
  }

  function clearAllItems() {
    sections.forEach(s => s.items = []);
    console.log(sections)
    setSections([...sections]);
  }

  function clearCheckedItems() {
    sections.forEach(s => s.items = s.items.filter(i => !i.checked));
    setSections([...sections]);
  }

  // create section components
  const displayedSections = sections.map(section =>
    <Section
      key={section.name}
      name={section.name}
      items={section.items} />
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
        {addingSection && <NewSectionInput addNewSection={addNewSection}/>}
        {displayedSections}
      </div>
    );
  }
}

function NewSectionInput(props: {addNewSection: (name: string) => void}) {
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
  )
}
