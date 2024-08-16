import { render, screen } from "@testing-library/react";
import React from "react";
import { Section } from "./Section";
import { IItem } from "@groceries/shared";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { deleteItem } from "../../services/api";

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

describe('removeItem', () => {
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