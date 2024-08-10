import React, { useEffect, useState } from 'react';
import './App.css';
import { List } from '../List/List';

export function App() {
  const [error, setError] = useState<string>("");

  if (error) {
    return (
      <div className="App">
        <ErrorPage message={error} />
      </div>
    )
  }
  return (
    <div className="App">
      <List setError={setError}/>
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
