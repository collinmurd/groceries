import './index.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { App } from '../components/App/App';

export default function Page() {
  return (
    <MantineProvider defaultColorScheme="auto" >
      <App />
    </MantineProvider>
  );
}