import { render, screen } from '../../testing-utils';
import React from "react";
import { Section } from "./Section";
import { IItem } from "@groceries/shared";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { createItem, deleteItem } from "../../services/api";
import { Item } from '../Item/Item';

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
    render(<Section name={mockName} addNewItem={jest.fn()}>
        {mockData.map(i => <Item key={i.id} item={i} removeItem={jest.fn()} edit={false} />)}
    </Section>)
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

  it('should create an input and call addNewItem prop', async () => {
    const addNewItem = jest.fn()
    render(<Section name={mockName} addNewItem={addNewItem}></Section>);
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
    expect(addNewItem).toHaveBeenCalled();
  });
});
