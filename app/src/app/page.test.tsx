import { render, screen } from "@testing-library/react";
import React from "react";
import Page from "./page";
import { getFeatures, getItems } from "../services/api";
import GlobalProvider from "./components/GlobalProvider";

jest.mock('../services/api')

describe('Render', () => {
  it('should render', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve([]));
    (getFeatures as jest.Mock).mockReturnValue(Promise.resolve([]));
    render(<Page />, { wrapper: GlobalProvider });

    expect(screen.findByText('Failed')).rejects.toBeTruthy();
  });
});

describe('handle errors', () => {
  it('should display the error page when an error occurs getting features', async () => {
    (getItems as jest.Mock).mockReturnValue(Promise.resolve([]));
    (getFeatures as jest.Mock).mockReturnValue(Promise.reject('error'));

    render(<Page />, { wrapper: GlobalProvider });

    expect(await screen.findByText('Failed to get features... try again later')).toBeInTheDocument();
    expect(screen.findByText('List Content')).rejects.toBeTruthy();
  });

  it('should display the error page when an error getting list items', async () => {
    (getFeatures as jest.Mock).mockReturnValue(Promise.resolve([]));
    (getItems as jest.Mock).mockReturnValue(Promise.reject('error'));

    render(<Page />, { wrapper: GlobalProvider });

    expect(await screen.findByText('Failed to get grocery list... try paper')).toBeInTheDocument();
    expect(screen.findByText('List Content')).rejects.toBeTruthy();
  });
});