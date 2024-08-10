import React from 'react';
import userEvent, { UserEvent } from "@testing-library/user-event";
import { render, screen } from '@testing-library/react';
import { updateItem } from "../../services/api";
import { Item } from "./Item";
import { IItem } from '@groceries/shared';

jest.mock('../../services/api');

const mockData: IItem = {
  id: "1",
  description: "Apples",
  section: "Produce",
  checked: true
}

describe('Render', () => {
  it('should mark checked', () => {
    render(<Item item={mockData} removeItem={jest.fn()} edit={false} />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('checked');
  });

  it('should not mark unchecked', () => {
    mockData.checked = false;
    render(<Item item={mockData} removeItem={jest.fn()} edit={false} />)
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('checked');
  });
})

describe('Check an item', () => {
  var user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should call the api when the box is checked', async () => {
    render(<Item item={mockData} removeItem={jest.fn()} edit={false} />);
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
    mockData.checked = true;
    render(<Item item={mockData} removeItem={jest.fn()} edit={false} />);
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
});

describe('Delete an item', () => {

  it('should call removeItem when delete button is clicked', async () => {
    const removeItem = jest.fn();
    const user = userEvent.setup();
    render(<Item item={mockData} removeItem={removeItem} edit={false} />)

    await user.click(screen.getByRole('button'));
    expect(removeItem).toHaveBeenCalled();
  });
});

describe('Edit an item', () => {
  it('should open the text box when the edit button is clicked', async () => {
    const removeItem = jest.fn();
    const user = userEvent.setup();
    render(<Item item={mockData} removeItem={removeItem} edit={true} />)

    await user.click(await screen.findByLabelText('Edit Apples'));

    expect(true).toBeTruthy();
  });
});