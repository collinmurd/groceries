import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IItem } from '@groceries/shared';
import { List } from './List';
import { deleteItem, getItems } from '../../services/api';
import userEvent, { UserEvent } from '@testing-library/user-event';

jest.mock('../../services/api')

const mockData: IItem[] = [
  {
    id: "1",
    description: "Apples",
    section: "Produce",
    checked: false
  },
  {
    id: "2",
    description: "Steak",
    section: "Meat",
    checked: true
  },
  {
    id: "3",
    description: "Chicken",
    section: "Meat",
    checked: false
  },
]

describe('Retrieve data', () => {
  it('should render the list with resolved data', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    render(<List setError={jest.fn()}/>)

    expect(await screen.findByText(mockData[0].description)).toBeInTheDocument();
  });

  it('should show an error page if it failed to resolve data', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.reject('error'));
    const setError = jest.fn();
    render(<List setError={setError}/>)

    await waitFor(() => expect(setError).toHaveBeenCalled());
  })
});


describe('render List', () => {
  it('should render each section', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    render(<List setError={jest.fn()}/>);
    expect(await screen.findByText(mockData[0].section!)).toBeInTheDocument();
    expect(await screen.findByText(mockData[1].section!)).toBeInTheDocument();
    expect(await screen.findByText(mockData[2].section!)).toBeInTheDocument();
  });

  it('should place items in correct sections', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    render(<List setError={jest.fn()}/>);

    const produceSection = (await screen.findByText('Produce')).parentElement;
    const meatSection = (await screen.findByText('Meat')).parentNode;
    expect(produceSection?.contains(screen.getByText('Apples'))).toBeTruthy();
    expect(meatSection?.contains(screen.getByText('Steak'))).toBeTruthy();
    expect(meatSection?.contains(screen.getByText('Chicken'))).toBeTruthy();
  });
});

describe('removeItem', () => {
  var user: UserEvent;
  beforeEach(() => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve(mockData));
    (deleteItem as jest.Mock).mockReturnValue(Promise.resolve(""));
    user = userEvent.setup();
  });

  it('should call the delete API when an item is removed', async () => {
    render(<List setError={jest.fn()} />)
    await user.click(await screen.findByLabelText('Delete Apples'));

    expect(deleteItem).toHaveBeenCalled();
  });

  it('should remove the item from the list', async() => {
    render(<List setError={jest.fn()} />)
    await user.click(await screen.findByLabelText('Delete Apples'));

    expect(screen.queryByText('Apples')).toBeNull();
  });
});