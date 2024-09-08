import React, { useEffect, useState } from 'react';
import { getItems } from '../../services/api';
import { ISectionProps, Section } from '../Section/Section';
import { Button, Loader, TextInput } from '@mantine/core';
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

  // create section components
  const displayedSections = sections.map(section =>
    <Section
      key={section.name}
      name={section.name}
      items={section.items} />
  );

  return (
    <div>
      {loading ? 
        <Loader type='dots' className={classes.loader} />
        : <Button onClick={handleNewSectionClicked}>Add Section</Button>}
      {addingSection && <NewSectionInput addNewSection={addNewSection}/>}
      {displayedSections}
    </div>
  );
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
