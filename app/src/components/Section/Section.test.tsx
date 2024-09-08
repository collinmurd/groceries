import { render, screen } from '../../testing-utils';
import React from "react";
import { Section } from "./Section";
import { IItem } from "@groceries/shared";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { createItem, deleteItem } from "../../services/api";

jest.mock('../../services/api')

const mockName = "My Section";
const mockData: IItem[] = [
  {
    id: "1",
    description: "Steak",
    section: "Meat",
    checked: true
  },
  {
    id: "2",
    description: "Chicken",
    section: "Meat",
    checked: false
  },
]

describe('Render', () => {
  it('should render', () => {
    render(<Section name={mockName} items={mockData} />)
  });
});

describe('remove item', () => {
  var user: UserEvent;
  beforeEach(() => {
    (deleteItem as jest.Mock).mockReturnValue(Promise.resolve(""));
    user = userEvent.setup();
  });

  it('should call the delete API when an item is removed', async () => {
    render(<Section name={mockName} items={mockData} />)
    await user.click(await screen.findByLabelText('Delete Steak'));

    expect(deleteItem).toHaveBeenCalled();
  });

  it('should remove the item from the list', async() => {
    render(<Section name={mockName} items={mockData} />)
    await user.click(await screen.findByLabelText('Delete Steak'));

    expect(screen.queryByText('Apples')).toBeNull();
  });
});

describe('add item', () => {
  var user: UserEvent;
  const mockNewItem = {
    id: "3",
    description: "",
    section: "Meat",
    checked: false
  }
  beforeEach(() => {
    (createItem as jest.Mock).mockReturnValue(Promise.resolve(mockNewItem));
    user = userEvent.setup();
  });

  it('should add a new item to the list', async () => {
    render(<Section name={mockName} items={[]} />);
    (createItem as jest.Mock).mockReturnValue(Promise.resolve({
      id: "1",
      description: "New Item",
      section: "",
      checked: true
    }));
    await user.click(await screen.findByRole('button'));
    
    await user.type(screen.getByRole('textbox'), 'New Item');
    expect(screen.getByRole('textbox')).toHaveValue('New Item')

    await user.keyboard('{Escape}');
    expect(createItem).toHaveBeenCalled();
    expect(await screen.findByText('New Item')).toBeInTheDocument();
  });
});
