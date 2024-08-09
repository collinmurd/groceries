import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event'
import { IItem } from '@groceries/shared';
import List, { Item } from './List';
import { updateItem } from '../services/api';

jest.mock('../services/api')

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
  {
    id: "4",
    description: "Chocolate",
    checked: false
  },
]

describe('render List', () => {
  beforeEach(() => {
    render(<List items={mockData} />);
  });

  it('should render each section', () => {
    expect(screen.getByText(mockData[0].section!)).toBeInTheDocument();
    expect(screen.getByText(mockData[1].section!)).toBeInTheDocument();
    expect(screen.getByText(mockData[2].section!)).toBeInTheDocument();
  });

  it('should render items in correct sections', () => {
    const produceSection = screen.getByText('Produce').parentElement;
    const meatSection = screen.getByText('Meat').parentNode;
    expect(produceSection?.contains(screen.getByText('Apples'))).toBeTruthy();
    expect(produceSection?.contains(screen.getByText('Chocolate'))).toBeFalsy();
    expect(meatSection?.contains(screen.getByText('Steak'))).toBeTruthy();
    expect(meatSection?.contains(screen.getByText('Chicken'))).toBeTruthy();
    expect(meatSection?.contains(screen.getByText('Chocolate'))).toBeFalsy();
  });

  it('should mark checked items', () => {
    expect(screen.getAllByRole('checkbox')[2]).toHaveAttribute('checked');
  });

  it('should not mark unchecked items', () => {
    expect(screen.getAllByRole('checkbox')[0]).not.toHaveAttribute('checked');
    expect(screen.getAllByRole('checkbox')[1]).not.toHaveAttribute('checked');
    expect(screen.getAllByRole('checkbox')[3]).not.toHaveAttribute('checked');
  });
});

describe('Check an item', () => {
  var user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should call the api when the box is checked', async () => {
    render(<Item item={mockData[0]} />);
    (updateItem as jest.Mock).mockReturnValue(Promise.resolve({
      id: "1",
      description: "Apples",
      section: "Produce",
      checked: true
    }));

    const appleCheckbox = screen.getByRole('checkbox');
    await user.click(appleCheckbox);
    expect(updateItem).toHaveBeenCalled();
  });

  it('should call the api when the box is unchecked', async () => {
    mockData[0].checked = true;
    render(<Item item={mockData[0]} />);
    (updateItem as jest.Mock).mockReturnValue(Promise.resolve({
      id: "1",
      description: "Apples",
      section: "Produce",
      checked: false
    }));

    const appleCheckbox = screen.getByRole('checkbox');
    await user.click(appleCheckbox);
    expect(updateItem).toHaveBeenCalled();
  });
})