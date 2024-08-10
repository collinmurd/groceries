import { render, screen } from "@testing-library/react";
import React, { useEffect } from "react";
import { App } from "./App";
import { List } from '../List/List'

jest.mock('../List/List');

describe('Render', () => {
  it('should render', () => {
    render(<App />);
  });
});

describe('handle error', () => {
  it('should display the error page when an error occurs in List', () => {
    // have List call setError
    (List as jest.Mock).mockImplementation((props: {setError: Function}) => {
      useEffect(() => {
        props.setError("error")
      });
      return <div>List Content</div>
    });

    render(<App />);

    expect(screen.getByText('error')).toBeInTheDocument();
    expect(screen.queryByText('List Content')).toBeNull();
  });
});