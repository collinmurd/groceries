import React from 'react';
import { render, screen, waitFor } from '../../testing-utils';
import { IItem } from '@groceries/shared';
import { List } from './List';
import { getItems } from '../../services/api';
import userEvent from '@testing-library/user-event';

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

    const produceSection = (await screen.findByText('Produce')).parentNode?.parentNode;
    const meatSection = (await screen.findByText('Meat')).parentNode?.parentNode;
    expect(produceSection?.contains(screen.getByText('Apples'))).toBeTruthy();
    expect(meatSection?.contains(screen.getByText('Steak'))).toBeTruthy();
    expect(meatSection?.contains(screen.getByText('Chicken'))).toBeTruthy();
  });
});

describe('add Section', () => {
  it('should display an "Add Section" button', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve([]));
    render(<List setError={jest.fn()}/>);

    expect(await screen.findByText('Add Section')).toBeInTheDocument();
  });

  it('should display an input for a new section when clicked', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve([]));
    render(<List setError={jest.fn()}/>);
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button'));

    expect(await screen.findByRole('textbox'));
  });

  it('should create a new section when the input is unfocused', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve([]));
    render(<List setError={jest.fn()}/>);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), 'New Section');
    expect(screen.getByRole('textbox')).toHaveValue('New Section')

    await user.keyboard('{Escape}');
    expect(await screen.findByText('New Section', {selector: 'h3'})).toBeInTheDocument();
  });

  it('should not create a new section when the input is unfocused with no content', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve([]));
    render(<List setError={jest.fn()}/>);
    const user = userEvent.setup();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('New Section', {selector: 'h3'})).toBeNull();
  });
});