import React, { useEffect, useState } from 'react';
import './App.css';
import List from './List';
import IItemDto from '@groceries/shared';
import { getItems } from '../api';

function App() {
  const [items, setItems] = useState<IItemDto[]>([]);

  useEffect(() => {
    console.log('effecting...')
    getItems()
      .then(data => setItems(data))
      .catch(err => console.log(err))
  }, []);

  return (
    <div className="App">
      <List items={items}/>
    </div>
  );
}

export default App;
