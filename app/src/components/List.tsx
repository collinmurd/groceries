import React from 'react';
import './List.css';
import { IItem } from '@groceries/shared'

function List(props: {items: IItem[]}) {

  // split items into sections
  const noSection: IItem[] = [];
  const sectionedItems: {[key: string]: IItem[]} = {}
  props.items.forEach(item => {
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

function Section(props: {name: string, items: IItem[]}) {
  const listItems = props.items.map(item => 
    <li key={item.id}>
      <Item item={item}/>
    </li>
  )
  return (
    <div>
      <h3>{props.name}</h3>
      <ul>
        {listItems}
      </ul>
    </div>
  )
}

function Item(props: {item: IItem}) {
  return (
    <div>
      <input type="checkbox" defaultChecked={props.item.checked} />
      {props.item.description}
    </div>
  )
}

export default List;