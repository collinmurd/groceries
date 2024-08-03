import React, { useEffect, useState } from 'react';
import './App.css';
import List from './List';
import IItemDto from '@groceries/shared';
import { getItems } from '../services/api';

function App() {
  const [items, setItems] = useState<IItemDto[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    console.log('effecting...')
    getItems()
      .then(data => setItems(data))
      .catch(err => {
        console.log(err);
        setError("Failed to get grocery list... try paper");
      })
  }, []);

  if (error) {
    return (
      <div className="App">
        <ErrorPage message={error} />
      </div>
    )
  }
  return (
    <div className="App">
      <List items={items}/>
    </div>
  );
}


function ErrorPage(props: {
  message: string,
}) {
  return (
    <div>
      <h2>{props.message}</h2>
    </div>
  )
}

export default App;
