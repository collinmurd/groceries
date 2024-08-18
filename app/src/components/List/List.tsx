import React, { useEffect, useState } from 'react';
import './List.css';
import { getItems } from '../../services/api';
import { ISectionProps, Section } from '../Section/Section';

export function List(props: {setError: Function}) {
  const [sections, setSections] = useState<ISectionProps[]>([]);

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
              edit: false
            };
          }
        });

        setSections(Object.values(initialSections));
      })
      .catch(err => {
        console.log(err);
        props.setError("Failed to get grocery list... try paper");
      })
  }, []);

  function handleNewSectionClicked() {
    sections.push({
      name: '',
      items: [],
      edit: true
    });
    setSections([...sections]);
  }

  // create section components
  const displayedSections = sections.map(section =>
    <Section key={section.name} name={section.name} items={section.items} edit={section.edit}/>
  );

  return (
    <div>
      <button onClick={handleNewSectionClicked}>Add Section</button>
      {displayedSections}
    </div>
  )
}



