import React, { useState } from 'react';
import { List } from '../List/List';

import classes from './App.module.css';

export function App() {
  const [error, setError] = useState<string>("");

  if (error) {
    return (
      <div className={classes.app}>
        <ErrorPage message={error} />
      </div>
    )
  }

  return (
    <div className={classes.app}>
      <List setError={(error: string) => setError(error)}/>
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
