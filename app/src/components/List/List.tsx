import React, { useEffect, useState } from 'react';
import './List.css';
import { IItem } from '@groceries/shared'
import { deleteItem, getItems } from '../../services/api';
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

  function removeItem(item: IItem) {
    deleteItem(item)
      .then(_ => setItems(items.filter(i => i != item)));
  }

  // split items into sections
  const sectionedItems: {[key: string]: IItem[]} = {}
  items.forEach(item => {
    if (Object.keys(sectionedItems).includes(item.section)) {
      sectionedItems[item.section].push(item);
    } else {
      sectionedItems[item.section] = [item];
    }
  });

  // create section components
  const sections = Object.entries(sectionedItems).map(entry =>
    <Section key={entry[0]} name={entry[0]} items={entry[1]} removeItem={removeItem}/>
  );

  return (
    <div>
      {sections}
    </div>
  )
}



