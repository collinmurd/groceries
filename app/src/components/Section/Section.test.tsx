import { render, screen } from "@testing-library/react";
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
    render(<Section name={mockName} items={mockData} edit={false}/>)
  });
});

describe('remove item', () => {
  var user: UserEvent;
  beforeEach(() => {
    (deleteItem as jest.Mock).mockReturnValue(Promise.resolve(""));
    user = userEvent.setup();
  });

  it('should call the delete API when an item is removed', async () => {
    render(<Section name={mockName} items={mockData} edit={false} />)
    await user.click(await screen.findByLabelText('Delete Steak'));

    expect(deleteItem).toHaveBeenCalled();
  });

  it('should remove the item from the list', async() => {
    render(<Section name={mockName} items={mockData} edit={false} />)
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

  it('should call the create API when the button is clicked', async () => {
    render(<Section name={mockName} items={[]} edit={false} />)
    await user.click(await screen.findByRole('button'));

    expect(createItem).toHaveBeenCalled();
  });

  it('should add a new item to the list', async () => {
    render(<Section name={mockName} items={[]} edit={false} />)
    await user.click(await screen.findByRole('button'));

    expect(screen.queryByRole('listitem')).toBeInTheDocument();
  });
});

describe('editing', () => {
  var user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
    render(<Section name={mockName} items={[]} edit={true} />)
  });

  it('should set the section name to the input when input is unfocused', async () => {
    await user.type(screen.getByRole('textbox'), 'New Section');
    expect(screen.getByRole('textbox')).toHaveValue('New Section')

    await user.keyboard('{Escape}');
    expect(await screen.findByText('New Section', {selector: 'h3'})).toBeInTheDocument();
  });
});