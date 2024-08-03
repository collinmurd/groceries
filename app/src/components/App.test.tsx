import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { getItems } from '../services/api'
import { IItem } from '@groceries/shared/index'

jest.mock('../services/api')

const mockData: IItem[] = [
  {
    id: "1",
    description: "Apples",
    section: "Produce",
    checked: false
  },
]

describe('App', () => {
  it('should render the list with resolved data', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    render(<App />)

    expect(await screen.findByText(mockData[0].description)).toBeInTheDocument();
  });

  it('should show an error page if it failed to resolve data', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.reject('error'));
    render(<App />)

    expect(await screen.findByText(/Failed to get grocery list/)).toBeInTheDocument();
  })
});
