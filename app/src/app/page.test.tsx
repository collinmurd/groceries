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
