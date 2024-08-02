import React from 'react';
import './App.css';
import List from './List';
import IItemDto from '@groceries/shared';

const data: IItemDto[] = [
  {
    id: "1",
    description: "Apples",
    section: "Produce",
    checked: false
  },
  {
    id: "2",
    description: "Onions",
    section: "Produce",
    checked: false
  },
  {
    id: "3",
    description: "Steak",
    section: "Meat",
    checked: true
  },
  {
    id: "4",
    description: "Milk",
    section: "Dairy",
    checked: true
  },
  {
    id: "5",
    description: "Cheese",
    section: "Dairy",
    checked: true
  },
]

function App() {
  return (
    <div className="App">
      <List items={data}/>
    </div>
  );
}

export default App;
