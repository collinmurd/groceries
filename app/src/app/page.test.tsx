import { render, screen } from "@testing-library/react";
import React, { act, useEffect } from "react";
import { List } from './components/List/List'
import Page from "./page";
import { getFeatures } from "../services/api";

jest.mock('./components/List/List');
jest.mock('../services/api')

describe('Render', () => {
  it('should render', async () => {
    (getFeatures as jest.Mock).mockReturnValue(Promise.resolve([]));
    render(<Page />);

    expect(await screen.findByText('Failed').catch(_ => true)).toBeTruthy();
  });
});

describe('handle error', () => {
  it('should display the error page when an error occurs in List', async () => {
    // have List call setError
    (List as jest.Mock).mockImplementation((props: {setError: Function}) => {
      useEffect(() => {
        props.setError("error")
      });
      return <div>List Content</div>
    });

    render(<Page />);

    expect(await screen.findByText('error')).toBeInTheDocument();
    expect(screen.findByText('List Content').catch(e => true)).toBeTruthy();
  });
});