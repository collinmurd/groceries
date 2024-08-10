import React, { useEffect, useState } from 'react';
import './List.css';
import { IItem } from '@groceries/shared'
import { getItems } from '../../services/api';
import { Section } from '../Section/Section';

export function List(props: {setError: Function}) {
  const [items, setItems] = useState<IItem[]>([]);

  useEffect(() => {
    getItems()
      .then(data => setItems(data))
      .catch(err => {
        console.log(err);
        props.setError("Failed to get grocery list... try paper");
      })
  }, []);

  // split items into sections
  const noSection: IItem[] = [];
  const sectionedItems: {[key: string]: IItem[]} = {}
  items.forEach(item => {
    if (!item.section) {
      noSection.push(item);
    } else {
      if (Object.keys(sectionedItems).includes(item.section)) {
        sectionedItems[item.section].push(item);
      } else {
        sectionedItems[item.section] = [item];
      }
    }
  });

  // create section components
  const sections = Object.entries(sectionedItems).map(entry =>
    <Section key={entry[0]} name={entry[0]} items={entry[1]}/>
  );

  return (
    <div>
      <Section key="noSection" name="" items={noSection} />
      {sections}
    </div>
  )
}



