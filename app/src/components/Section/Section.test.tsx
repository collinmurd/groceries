import { render } from "@testing-library/react";
import React from "react";
import { Section } from "./Section";
import { IItem } from "@groceries/shared";

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
    render(<Section name={mockName} items={mockData} removeItem={jest.fn()}/>)
  });
});